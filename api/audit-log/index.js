const { authenticateRequest, auditLog, getAuditLogs, errorResponse, successResponse } = require('../lib/middleware');
const { authorize } = require('../lib/rbac');

module.exports = async function (context, req) {
  // Authenticate
  const authResult = authenticateRequest(req);
  if (!authResult.authenticated) {
    context.res = errorResponse(authResult.status, authResult.message);
    return;
  }

  // Only super_admin can view audit logs
  const authz = authorize(req, 'audit:read');
  if (!authz.authorized) {
    context.res = errorResponse(authz.status, authz.message);
    return;
  }

  // Parse query filters
  const filters = {
    userId: req.query?.userId || null,
    action: req.query?.action || null,
    startDate: req.query?.startDate || null,
    endDate: req.query?.endDate || null
  };

  const page = parseInt(req.query?.page || '1', 10);
  const pageSize = Math.min(parseInt(req.query?.pageSize || '50', 10), 100);

  // Get logs
  const allLogs = getAuditLogs(filters);
  const total = allLogs.length;
  const offset = (page - 1) * pageSize;
  const logs = allLogs.slice(offset, offset + pageSize);

  // Audit the audit log access itself
  auditLog(req, 'audit:read', {
    result: 'success',
    message: `Viewed audit logs (page ${page}, filters: ${JSON.stringify(filters)})`,
    metadata: { page, pageSize, totalResults: total }
  });

  context.res = successResponse({
    logs,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  });
};
