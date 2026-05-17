const { authenticateRequest, auditLog, sanitizeOutput, errorResponse, successResponse } = require('../lib/middleware');
const { authorize, filterByFacility } = require('../lib/rbac');
const { validate, employeeFormSchema } = require('../lib/validation');

// In-memory employee store (in production, use database)
const employees = [
  { id: 'E001', name: 'Sarah Johnson', email: 'sjohnson@facility.com', role: 'RN', status: 'active', facilityId: 'F001', avatar: 'SJ', formData: { firstName: 'Sarah', lastName: 'Johnson', ssn: '123-45-6789', dob: '1985-03-15', phone: '(555) 123-4567', dd_bank1Routing: '021000021', dd_bank1Account: '123456789' } },
  { id: 'E002', name: 'Michael Park', email: 'mpark@facility.com', role: 'CNA', status: 'active', facilityId: 'F001', avatar: 'MP', formData: { firstName: 'Michael', lastName: 'Park', ssn: '234-56-7890', dob: '1990-07-22', phone: '(555) 234-5678', dd_bank1Routing: '021000021', dd_bank1Account: '987654321' } },
  { id: 'E003', name: 'Emily Chen', email: 'echen@facility.com', role: 'LPN', status: 'onboarding', facilityId: 'F001', avatar: 'EC', formData: { firstName: 'Emily', lastName: 'Chen', ssn: '345-67-8901', dob: '1992-11-08' } },
  { id: 'E004', name: 'James Wilson', email: 'jwilson@facility.com', role: 'CNA', status: 'active', facilityId: 'F001', avatar: 'JW', formData: { firstName: 'James', lastName: 'Wilson', ssn: '456-78-9012', dob: '1988-01-30', phone: '(555) 456-7890', dd_bank1Routing: '021000021', dd_bank1Account: '456789123' } },
  { id: 'E005', name: 'Lisa Rodriguez', email: 'lrodriguez@facility.com', role: 'RN', status: 'active', facilityId: 'F002', avatar: 'LR', formData: { firstName: 'Lisa', lastName: 'Rodriguez', ssn: '567-89-0123', dob: '1983-05-20' } },
  { id: 'E006', name: 'David Kim', email: 'dkim@facility.com', role: 'CNA', status: 'active', facilityId: 'F002', avatar: 'DK', formData: { firstName: 'David', lastName: 'Kim', ssn: '678-90-1234', dob: '1995-09-12' } },
  { id: 'E007', name: 'Amanda Foster', email: 'afoster@facility.com', role: 'LPN', status: 'active', facilityId: 'F001', avatar: 'AF', formData: { firstName: 'Amanda', lastName: 'Foster', ssn: '789-01-2345', dob: '1991-12-03' } }
];

module.exports = async function (context, req) {
  // Authenticate
  const authResult = authenticateRequest(req);
  if (!authResult.authenticated) {
    context.res = errorResponse(authResult.status, authResult.message);
    return;
  }

  const method = req.method.toUpperCase();
  const employeeId = context.bindingData?.id;

  if (method === 'GET') {
    // Check permission
    const authz = authorize(req, 'employees:read');
    if (!authz.authorized) {
      context.res = errorResponse(authz.status, authz.message);
      return;
    }

    let data;
    if (employeeId) {
      data = employees.find(e => e.id === employeeId);
      if (!data) {
        context.res = errorResponse(404, 'Employee not found');
        return;
      }
      // Employee role can only view own data
      if (req.user.role === 'employee' && data.id !== req.user.sub) {
        context.res = errorResponse(403, 'Can only view own record');
        return;
      }
    } else {
      data = filterByFacility(employees, req.user);
      // Employees can only see their own record
      if (req.user.role === 'employee') {
        data = data.filter(e => e.id === req.user.sub);
      }
    }

    // Sanitize PII based on role
    const sanitized = sanitizeOutput(data, req.user.role);

    auditLog(req, 'employees:read', {
      result: 'success',
      resource: 'employee',
      resourceId: employeeId || 'list',
      message: `Read ${employeeId ? '1' : (Array.isArray(sanitized) ? sanitized.length : 0)} employee(s)`
    });

    context.res = successResponse(sanitized);
    return;
  }

  if (method === 'POST') {
    // Check permission
    const authz = authorize(req, 'employees:write');
    if (!authz.authorized) {
      context.res = errorResponse(authz.status, authz.message);
      return;
    }

    // Validate form data
    const body = req.body || {};
    if (body.formData) {
      const { valid, errors } = validate(body.formData, employeeFormSchema);
      if (!valid) {
        context.res = errorResponse(400, 'Validation failed');
        context.res.body = JSON.stringify({ error: 'Validation failed', details: errors });
        return;
      }
    }

    // Create/update employee
    const existing = employeeId ? employees.find(e => e.id === employeeId) : null;
    if (existing) {
      Object.assign(existing, body, { id: existing.id });
      auditLog(req, 'employees:update', { result: 'success', resource: 'employee', resourceId: existing.id });
      context.res = successResponse(sanitizeOutput(existing, req.user.role));
    } else {
      const newEmp = { id: `E${String(employees.length + 1).padStart(3, '0')}`, ...body };
      employees.push(newEmp);
      auditLog(req, 'employees:create', { result: 'success', resource: 'employee', resourceId: newEmp.id });
      context.res = successResponse(sanitizeOutput(newEmp, req.user.role), 201);
    }
    return;
  }

  context.res = errorResponse(405, 'Method not allowed');
};

module.exports.employees = employees;
