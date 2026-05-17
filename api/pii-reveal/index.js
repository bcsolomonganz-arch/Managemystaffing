const { getUserById, verifyPassword } = require('../lib/auth');
const { authenticateRequest, auditLog, rateLimiter, errorResponse, successResponse } = require('../lib/middleware');
const { authorize } = require('../lib/rbac');
const { validate, piiRevealSchema } = require('../lib/validation');
const { employees } = require('../employees-data/index');

module.exports = async function (context, req) {
  // Authenticate
  const authResult = authenticateRequest(req);
  if (!authResult.authenticated) {
    context.res = errorResponse(authResult.status, authResult.message);
    return;
  }

  // Only super_admin can reveal PII
  const authz = authorize(req, 'pii:reveal');
  if (!authz.authorized) {
    auditLog(req, 'pii:reveal_denied', { result: 'denied', message: `${req.user.email} attempted PII reveal without permission` });
    context.res = errorResponse(authz.status, authz.message);
    return;
  }

  // Rate limit: 10 reveals per hour
  const rateResult = rateLimiter(`pii:${req.user.sub}`, 10, 3600000);
  if (rateResult.limited) {
    auditLog(req, 'pii:reveal_rate_limited', { result: 'blocked', message: `${req.user.email} hit PII reveal rate limit` });
    context.res = errorResponse(429, 'PII reveal rate limit exceeded. Try again later.');
    return;
  }

  // Validate request
  const body = req.body || {};
  const { valid, errors } = validate(body, piiRevealSchema);
  if (!valid) {
    context.res = errorResponse(400, 'Invalid request');
    return;
  }

  const { employeeId, field, password, justification } = body;

  // Step-up auth: require password re-entry
  const user = getUserById(req.user.sub);
  if (!user) {
    context.res = errorResponse(401, 'User not found');
    return;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    auditLog(req, 'pii:reveal_auth_failed', {
      result: 'failure',
      resource: 'employee',
      resourceId: employeeId,
      message: `Step-up auth failed for ${req.user.email}`
    });
    context.res = errorResponse(401, 'Password verification failed');
    return;
  }

  // Find employee and field
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) {
    context.res = errorResponse(404, 'Employee not found');
    return;
  }

  const formData = employee.formData || {};
  const value = formData[field];
  if (!value) {
    context.res = errorResponse(404, 'Field not found or empty');
    return;
  }

  // Critical audit entry
  const ip = req.headers['x-forwarded-for'] || req.headers['client-ip'] || 'unknown';
  auditLog(req, 'pii:reveal', {
    result: 'success',
    resource: 'employee',
    resourceId: employeeId,
    message: `Revealed ${field} for ${employee.name}`,
    metadata: {
      field,
      employeeId,
      employeeName: employee.name,
      justification,
      ip,
      userAgent: req.headers['user-agent']
    }
  });

  context.res = successResponse({
    employeeId,
    field,
    value
  });
};
