/**
 * PII Masking utilities for UI display
 * SOC 2 CC6.1 - Data display minimization
 */

/**
 * Mask SSN: 123-45-6789 -> ***-**-6789
 */
export function maskSSN(value) {
  if (!value) return '';
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return '***-**-****';
  return `***-**-${cleaned.slice(-4)}`;
}

/**
 * Mask bank account number: 123456789 -> ****6789
 */
export function maskBankAccount(value) {
  if (!value) return '';
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return '****';
  return `****${cleaned.slice(-4)}`;
}

/**
 * Mask routing number: 021000021 -> *****0021
 */
export function maskRoutingNumber(value) {
  if (!value) return '';
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return '*****';
  return `*****${cleaned.slice(-4)}`;
}

/**
 * Mask date of birth: 1990-03-15 -> [redacted]/[redacted]/1990
 */
export function maskDOB(value) {
  if (!value) return '';
  // Handle both YYYY-MM-DD and MM/DD/YYYY formats
  const parts = value.includes('-') ? value.split('-') : value.split('/');
  if (parts.length === 3) {
    if (value.includes('-')) {
      // YYYY-MM-DD
      return `**/**/${parts[0]}`;
    }
    // MM/DD/YYYY
    return `**/**/${parts[2]}`;
  }
  return '**/**/****';
}

/**
 * Mask phone number: (555) 123-4567 -> (***) ***-4567
 */
export function maskPhone(value) {
  if (!value) return '';
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return '(***) ***-****';
  return `(***) ***-${cleaned.slice(-4)}`;
}

/**
 * Mask email: user@example.com -> u***@example.com
 */
export function maskEmail(value) {
  if (!value || !value.includes('@')) return '';
  const [local, domain] = value.split('@');
  if (local.length <= 1) return `${local}***@${domain}`;
  return `${local[0]}***@${domain}`;
}

/**
 * Master dispatcher for PII masking based on field type
 */
export function formatForDisplay(value, fieldType, revealed = false) {
  if (revealed || !value) return value || '';

  switch (fieldType) {
    case 'ssn':
      return maskSSN(value);
    case 'bankAccount':
    case 'account':
      return maskBankAccount(value);
    case 'routingNumber':
    case 'routing':
      return maskRoutingNumber(value);
    case 'dob':
    case 'dateOfBirth':
      return maskDOB(value);
    case 'phone':
      return maskPhone(value);
    case 'email':
      return maskEmail(value);
    default:
      return value;
  }
}

/**
 * Check if a value appears to be PII based on pattern
 */
export function isPIIField(fieldName) {
  const piiFields = [
    'ssn', 'social', 'dob', 'dateOfBirth', 'date_of_birth',
    'routing', 'dd_bank1Routing', 'dd_bank2Routing',
    'account', 'dd_bank1Account', 'dd_bank2Account',
    'bankAccount'
  ];
  return piiFields.some(f => fieldName.toLowerCase().includes(f.toLowerCase()));
}
