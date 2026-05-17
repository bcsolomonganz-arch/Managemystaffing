/**
 * Data Minimization — Role-based and purpose-based field filtering
 * SOC 2 CC6.1, P6.1 — Data access limited to business need
 */

/**
 * Fields accessible by each role
 */
const ROLE_FIELDS = {
  super_admin: '*', // All fields
  admin: [
    'id', 'name', 'email', 'role', 'status', 'facilityId', 'avatar',
    'formData.firstName', 'formData.lastName', 'formData.mi',
    'formData.phone', 'formData.address', 'formData.city', 'formData.state', 'formData.zip',
    'formData.app_position', 'formData.dob',
    'formData.ssn', // Masked in output layer
    'formData.dd_bank1Name', 'formData.dd_bank1Routing', 'formData.dd_bank1Account', 'formData.dd_bank1Type',
    'formData.w4_filingStatus',
    'formData.ec1_name', 'formData.ec1_phone', 'formData.ec1_relation',
    'onboardingComplete', 'submittedDocs', 'inviteType'
  ],
  employee: [
    'id', 'name', 'email', 'role', 'status', 'facilityId', 'avatar',
    'formData.firstName', 'formData.lastName',
    'formData.phone', 'formData.app_position'
  ],
  new_hire: [
    'id', 'name', 'email', 'role', 'status', 'facilityId',
    'formData' // Own form data only
  ]
};

/**
 * Purpose-based data scoping — only return fields needed for the operation
 */
const PURPOSE_FIELDS = {
  scheduling: [
    'id', 'name', 'email', 'role', 'status', 'facilityId', 'avatar',
    'formData.firstName', 'formData.lastName', 'formData.phone'
  ],
  payroll: [
    'id', 'name', 'email', 'role', 'status', 'facilityId',
    'formData.firstName', 'formData.lastName', 'formData.ssn',
    'formData.dd_bank1Name', 'formData.dd_bank1Routing', 'formData.dd_bank1Account', 'formData.dd_bank1Type',
    'formData.dd_bank2Name', 'formData.dd_bank2Routing', 'formData.dd_bank2Account', 'formData.dd_bank2Type',
    'formData.w4_filingStatus', 'formData.w4_extraWithholding'
  ],
  onboarding: [
    'id', 'name', 'email', 'role', 'status', 'facilityId',
    'formData', 'onboardingComplete', 'submittedDocs', 'inviteType'
  ],
  reporting: [
    'id', 'name', 'role', 'status', 'facilityId',
    'formData.firstName', 'formData.lastName', 'formData.app_position'
  ],
  directory: [
    'id', 'name', 'email', 'role', 'status', 'facilityId', 'avatar',
    'formData.firstName', 'formData.lastName', 'formData.phone'
  ]
};

/**
 * Filter employee data based on the requesting user's role
 */
function filterByRole(data, role) {
  const allowedFields = ROLE_FIELDS[role];
  if (!allowedFields) return {};
  if (allowedFields === '*') return data;

  return filterObject(data, allowedFields);
}

/**
 * Filter data for a specific business purpose
 */
function filterForPurpose(data, purpose) {
  const allowedFields = PURPOSE_FIELDS[purpose];
  if (!allowedFields) return data;

  return filterObject(data, allowedFields);
}

/**
 * Internal: recursively filter object to only include allowed fields
 */
function filterObject(data, allowedFields) {
  if (Array.isArray(data)) {
    return data.map(item => filterObject(item, allowedFields));
  }

  if (typeof data !== 'object' || data === null) return data;

  const result = {};

  for (const field of allowedFields) {
    if (field.includes('.')) {
      const [parent, ...rest] = field.split('.');
      const childField = rest.join('.');

      if (data[parent] !== undefined) {
        if (childField === '' || !rest.length) {
          result[parent] = data[parent];
        } else {
          if (!result[parent]) result[parent] = {};
          if (typeof data[parent] === 'object' && data[parent] !== null) {
            const nestedValue = getNestedValue(data[parent], childField);
            if (nestedValue !== undefined) {
              setNestedValue(result[parent], childField, nestedValue);
            }
          }
        }
      }
    } else {
      if (data[field] !== undefined) {
        result[field] = data[field];
      }
    }
  }

  // Special case: if 'formData' is in allowed fields without qualifier, include all of it
  if (allowedFields.includes('formData') && data.formData) {
    result.formData = data.formData;
  }

  return result;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * Check data retention policies — flag records past retention period
 */
function checkRetention(records, retentionDays = 2555) { // ~7 years for employment records
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  return records.map(record => ({
    ...record,
    _retentionStatus: record.terminatedAt && new Date(record.terminatedAt) < cutoff
      ? 'eligible_for_deletion'
      : 'retain'
  }));
}

module.exports = {
  ROLE_FIELDS,
  PURPOSE_FIELDS,
  filterByRole,
  filterForPurpose,
  checkRetention
};
