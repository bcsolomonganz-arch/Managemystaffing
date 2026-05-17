const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY_MINUTES || '15';
const REFRESH_TOKEN_EXPIRY = process.env.SESSION_ABSOLUTE_TIMEOUT_HOURS || '8';

/**
 * Hash a plaintext password with bcrypt (cost 12)
 */
async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, BCRYPT_ROUNDS);
}

/**
 * Verify plaintext against bcrypt hash
 */
async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Generate a short-lived access token (15 min default)
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      facilityIds: payload.facilityIds || [],
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: `${ACCESS_TOKEN_EXPIRY}m`, algorithm: 'HS256' }
  );
}

/**
 * Generate a refresh token (8-hr absolute session limit)
 */
function generateRefreshToken(payload) {
  return jwt.sign(
    {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: `${REFRESH_TOKEN_EXPIRY}h`, algorithm: 'HS256' }
  );
}

/**
 * Verify a token (access or refresh)
 */
function verifyToken(token, type = 'access') {
  const secret = type === 'refresh' ? JWT_REFRESH_SECRET : JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (decoded.type !== type) {
      return { valid: false, error: 'Token type mismatch' };
    }
    return { valid: true, payload: decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

/**
 * Generate a CSRF token (32-byte random hex)
 */
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token using constant-time comparison
 */
function verifyCSRFToken(token, expected) {
  if (!token || !expected) return false;
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

// Revocation list (in-memory; use Redis/DB in production)
const revokedTokens = new Set();

function revokeToken(jti) {
  revokedTokens.add(jti);
}

function isTokenRevoked(jti) {
  return revokedTokens.has(jti);
}

// Demo users (in production, these come from a database)
const DEMO_USERS = [
  {
    id: 'U001',
    email: 'admin@staffhub.com',
    passwordHash: null, // Will be set on first load
    role: 'super_admin',
    facilityIds: ['F001', 'F002', 'F003'],
    mfaEnabled: false,
    mfaSecret: null,
    name: 'Super Admin'
  },
  {
    id: 'U002',
    email: 'manager@staffhub.com',
    passwordHash: null,
    role: 'admin',
    facilityIds: ['F001'],
    mfaEnabled: false,
    mfaSecret: null,
    name: 'Rebecca Torres'
  },
  {
    id: 'U003',
    email: 'nurse@staffhub.com',
    passwordHash: null,
    role: 'employee',
    facilityIds: ['F001'],
    mfaEnabled: false,
    mfaSecret: null,
    name: 'Sarah Johnson'
  },
  {
    id: 'U004',
    email: 'newhire@staffhub.com',
    passwordHash: null,
    role: 'new_hire',
    facilityIds: ['F001'],
    mfaEnabled: false,
    mfaSecret: null,
    name: 'Emily Chen'
  }
];

// Initialize password hashes (all use "SecurePass123!" for demo)
let initialized = false;
async function initDemoUsers() {
  if (initialized) return;
  const defaultHash = await hashPassword('SecurePass123!');
  DEMO_USERS.forEach(u => { u.passwordHash = defaultHash; });
  initialized = true;
}

function getUserByEmail(email) {
  return DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

function getUserById(id) {
  return DEMO_USERS.find(u => u.id === id) || null;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateCSRFToken,
  verifyCSRFToken,
  revokeToken,
  isTokenRevoked,
  initDemoUsers,
  getUserByEmail,
  getUserById,
  DEMO_USERS
};
