const Joi = require('joi');

/**
 * SSN validation: 9 digits, no 000/666/900-999 area codes
 */
const ssnPattern = /^(?!000|666|9\d{2})\d{3}-?(?!00)\d{2}-?(?!0000)\d{4}$/;

/**
 * ABA routing number checksum validation
 */
function validateRoutingChecksum(routing) {
  if (!/^\d{9}$/.test(routing)) return false;
  const d = routing.split('').map(Number);
  const checksum = (3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8])) % 10;
  return checksum === 0;
}

// --- Joi Schemas ---

const ssnSchema = Joi.string()
  .pattern(ssnPattern)
  .messages({ 'string.pattern.base': 'Invalid SSN format. Must be XXX-XX-XXXX with valid area code.' });

const routingNumberSchema = Joi.string()
  .length(9)
  .pattern(/^\d{9}$/)
  .custom((value, helpers) => {
    if (!validateRoutingChecksum(value)) {
      return helpers.error('custom.routingChecksum');
    }
    return value;
  })
  .messages({
    'string.length': 'Routing number must be exactly 9 digits',
    'string.pattern.base': 'Routing number must contain only digits',
    'custom.routingChecksum': 'Invalid routing number (checksum failed)'
  });

const bankAccountSchema = Joi.string()
  .min(4)
  .max(17)
  .pattern(/^\d{4,17}$/)
  .messages({
    'string.min': 'Account number must be at least 4 digits',
    'string.max': 'Account number must be at most 17 digits',
    'string.pattern.base': 'Account number must contain only digits'
  });

const passwordSchema = Joi.string()
  .min(12)
  .max(128)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/\d/, 'digit')
  .pattern(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'special')
  .messages({
    'string.min': 'Password must be at least 12 characters',
    'string.max': 'Password must be at most 128 characters',
    'string.pattern.name': 'Password must contain at least one {#name} character'
  });

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(254)
  .messages({ 'string.email': 'Invalid email format' });

const phoneSchema = Joi.string()
  .pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
  .messages({ 'string.pattern.base': 'Invalid US phone number format' });

const w4FilingStatusSchema = Joi.string()
  .valid('single', 'married', 'married_separately', 'head_of_household')
  .messages({ 'any.only': 'Invalid W-4 filing status' });

// Login request schema
const loginSchema = Joi.object({
  email: emailSchema.required(),
  password: Joi.string().min(1).max(128).required()
});

// MFA verification schema
const mfaVerifySchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d{6}$/).required()
    .messages({ 'string.pattern.base': 'MFA code must be 6 digits' }),
  mfaToken: Joi.string().required()
});

// Employee form data schema
const employeeFormSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  mi: Joi.string().max(5).allow(''),
  ssn: ssnSchema.optional(),
  dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
  address: Joi.string().max(200).optional(),
  apt: Joi.string().max(50).allow(''),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(2).optional(),
  zip: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional(),
  phone: phoneSchema.optional().allow(''),
  email: emailSchema.optional(),
  app_position: Joi.string().max(100).optional(),
  w4_filingStatus: w4FilingStatusSchema.optional().allow(''),
  w4_extraWithholding: Joi.string().max(20).allow(''),
  w4_multipleJobs: Joi.string().max(5).allow(''),
  dd_bank1Name: Joi.string().max(100).allow(''),
  dd_bank1Routing: routingNumberSchema.optional().allow(''),
  dd_bank1Account: bankAccountSchema.optional().allow(''),
  dd_bank1Type: Joi.string().valid('checking', 'savings', '').allow(''),
  dd_bank1Amount: Joi.string().max(20).allow(''),
  dd_bank2Name: Joi.string().max(100).allow(''),
  dd_bank2Routing: routingNumberSchema.optional().allow(''),
  dd_bank2Account: bankAccountSchema.optional().allow(''),
  dd_bank2Type: Joi.string().valid('checking', 'savings', '').allow(''),
  ec1_name: Joi.string().max(100).allow(''),
  ec1_phone: phoneSchema.optional().allow(''),
  ec1_relation: Joi.string().max(50).allow(''),
  ec2_name: Joi.string().max(100).allow(''),
  ec2_phone: phoneSchema.optional().allow(''),
  ec2_relation: Joi.string().max(50).allow(''),
  i9_citizenship: Joi.string().max(100).allow('')
}).unknown(true); // Allow additional fields for extensibility

// CSV export request schema
const exportRequestSchema = Joi.object({
  employeeIds: Joi.array().items(Joi.string()).min(1).max(100).required(),
  format: Joi.string().valid('smartlinx', 'adp').required(),
  facilityId: Joi.string().required()
});

// PII reveal request schema
const piiRevealSchema = Joi.object({
  employeeId: Joi.string().required(),
  field: Joi.string().valid('ssn', 'dd_bank1Routing', 'dd_bank1Account', 'dd_bank2Routing', 'dd_bank2Account', 'dob').required(),
  password: passwordSchema.required(),
  justification: Joi.string().min(5).max(500).required()
});

/**
 * Validate data against a schema, return { valid, value, errors }
 */
function validate(data, schema) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: false });
  if (error) {
    return {
      valid: false,
      errors: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    };
  }
  return { valid: true, value };
}

module.exports = {
  ssnSchema,
  routingNumberSchema,
  bankAccountSchema,
  passwordSchema,
  emailSchema,
  phoneSchema,
  w4FilingStatusSchema,
  loginSchema,
  mfaVerifySchema,
  employeeFormSchema,
  exportRequestSchema,
  piiRevealSchema,
  validate,
  validateRoutingChecksum
};
