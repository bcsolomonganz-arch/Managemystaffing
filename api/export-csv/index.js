const { authenticateRequest, auditLog, rateLimiter, errorResponse } = require('../lib/middleware');
const { authorize, hasFacilityAccess } = require('../lib/rbac');
const { validate, exportRequestSchema } = require('../lib/validation');
const { employees } = require('../employees-data/index');

const FACILITIES = [
  { id: 'F001', name: 'Sunrise Senior Living', state: 'TX', code: 'SSL', adpCode: 'SSL' },
  { id: 'F002', name: 'Heritage Oaks Care', state: 'TX', code: 'HOC', adpCode: 'HOC' },
  { id: 'F003', name: 'Meadow Creek Nursing', state: 'OK', code: 'MCN', adpCode: 'MCN' }
];

module.exports = async function (context, req) {
  // Authenticate
  const authResult = authenticateRequest(req);
  if (!authResult.authenticated) {
    context.res = errorResponse(authResult.status, authResult.message);
    return;
  }

  // Check permission
  const authz = authorize(req, 'export:csv');
  if (!authz.authorized) {
    context.res = errorResponse(authz.status, authz.message);
    return;
  }

  // Rate limit: 3 exports per hour
  const rateResult = rateLimiter(`export:${req.user.sub}`, 3, 3600000);
  if (rateResult.limited) {
    auditLog(req, 'export:rate_limited', { result: 'blocked', message: `${req.user.email} hit export rate limit` });
    context.res = errorResponse(429, 'Export rate limit exceeded (3 per hour). Try again later.');
    return;
  }

  // Validate request
  const body = req.body || {};
  const { valid, errors } = validate(body, exportRequestSchema);
  if (!valid) {
    context.res = errorResponse(400, 'Invalid request');
    context.res.body = JSON.stringify({ error: 'Invalid request', details: errors });
    return;
  }

  const { employeeIds, format, facilityId } = body;

  // Check facility access
  if (!hasFacilityAccess(req.user, facilityId)) {
    context.res = errorResponse(403, 'No access to this facility');
    return;
  }

  // Get employees
  const exportEmps = employees.filter(e => employeeIds.includes(e.id));
  if (exportEmps.length === 0) {
    context.res = errorResponse(404, 'No matching employees found');
    return;
  }

  const facility = FACILITIES.find(f => f.id === facilityId) || FACILITIES[0];

  // Generate CSV
  let csvContent;
  if (format === 'smartlinx') {
    csvContent = generateSmartLinxCSV(exportEmps, facility);
  } else {
    csvContent = generateADPCSV(exportEmps, facility);
  }

  // Audit log with all exported employee IDs
  const isBulk = exportEmps.length > 10;
  auditLog(req, 'export:csv', {
    result: 'success',
    resource: 'employees',
    message: `Exported ${exportEmps.length} employees as ${format} CSV`,
    metadata: {
      employeeIds: exportEmps.map(e => e.id),
      format,
      facilityId,
      bulk: isBulk
    }
  });

  // Bulk export triggers additional notification audit
  if (isBulk) {
    auditLog(req, 'export:bulk_notification', {
      result: 'alert',
      message: `Bulk export of ${exportEmps.length} employee records by ${req.user.email}`,
      metadata: { count: exportEmps.length, exportedBy: req.user.email }
    });
  }

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="export-${format}-${new Date().toISOString().split('T')[0]}.csv"`
    },
    body: csvContent
  };
};

function esc(v) {
  const s = String(v ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function generateSmartLinxCSV(emps, facility) {
  const headers = ['Employee ID', 'First Name', 'MI', 'Last Name', 'SSN', 'DOB', 'Address', 'City', 'State', 'ZIP', 'Phone', 'Email', 'Position/Title', 'Department', 'Hire Date', 'Employment Status', 'Hourly Rate', 'Filing Status', 'Bank Name', 'Routing Number', 'Account Number', 'Account Type', 'Facility Name', 'Facility State'];
  const rows = emps.map(emp => {
    const d = emp.formData || {};
    return [
      emp.id, d.firstName || '', d.mi || '', d.lastName || '', d.ssn || '', d.dob || '',
      d.address || '', d.city || '', d.state || '', d.zip || '', d.phone || '', emp.email || '',
      d.app_position || emp.role || '', emp.role || '', new Date().toISOString().split('T')[0],
      'Active', '', d.w4_filingStatus || '',
      d.dd_bank1Name || '', d.dd_bank1Routing || '', d.dd_bank1Account || '', d.dd_bank1Type || '',
      facility.name, facility.state
    ].map(esc).join(',');
  });
  return headers.map(esc).join(',') + '\n' + rows.join('\n') + '\n';
}

function generateADPCSV(emps, facility) {
  const headers = ['Company Code', 'File Number', 'First Name', 'Middle Name', 'Last Name', 'SSN', 'DOB', 'Gender', 'Marital Status', 'Address Line 1', 'City', 'State', 'ZIP', 'Phone', 'Email', 'Hire Date', 'Job Title', 'Department', 'Pay Rate', 'Pay Frequency', 'W4 Filing Status', 'Bank Name', 'Routing Number', 'Account Number', 'Account Type', 'Emergency Contact Name', 'Emergency Contact Phone'];
  const rows = emps.map(emp => {
    const d = emp.formData || {};
    return [
      facility.code || '', emp.id, d.firstName || '', d.mi || '', d.lastName || '',
      d.ssn || '', d.dob || '', '', '',
      d.address || '', d.city || '', d.state || '', d.zip || '',
      d.phone || '', emp.email || '',
      new Date().toISOString().split('T')[0],
      d.app_position || emp.role || '', emp.role || '',
      '', 'Hourly', d.w4_filingStatus || '',
      d.dd_bank1Name || '', d.dd_bank1Routing || '', d.dd_bank1Account || '', d.dd_bank1Type || '',
      d.ec1_name || '', d.ec1_phone || ''
    ].map(esc).join(',');
  });
  return headers.map(esc).join(',') + '\n' + rows.join('\n') + '\n';
}
