const { verifyToken, isTokenRevoked } = require('./auth');
const { authorize } = require('./rbac');

/**
 * Rate limiter — in-memory sliding window
 * In production, use Redis for distributed rate limiting
 */
const rateLimitStore = new Map();

function rateLimiter(key, max, windowMs) {
  const now = Date.now();
  const windowKey = `${key}`;

  if (!rateLimitStore.has(windowKey)) {
    rateLimitStore.set(windowKey, []);
  }

  const requests = rateLimitStore.get(windowKey);
  // Remove expired entries
  const valid = requests.filter(ts => now - ts < windowMs);
  rateLimitStore.set(windowKey, valid);

  if (valid.length >= max) {
    return {
      limited: true,
      retryAfter: Math.ceil((valid[0] + windowMs - now) / 1000)
    };
  }

  valid.push(now);
  return { limited: false, remaining: max - valid.length };
}

/**
 * Authenticate request — extract and verify JWT from Bearer header
 */
function authenticateRequest(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { authenticated: false, status: 401, message: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.slice(7);
  const result = verifyToken(token, 'access');

  if (!result.valid) {
    return { authenticated: false, status: 401, message: `Token invalid: ${result.error}` };
  }

  if (result.payload.jti && isTokenRevoked(result.payload.jti)) {
    return { authenticated: false, status: 401, message: 'Token has been revoked' };
  }

  req.user = result.payload;
  return { authenticated: true, user: result.payload };
}

/**
 * Verify CSRF token on state-changing requests
 */
function verifyCsrf(req) {
  const method = (req.method || '').toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const csrfToken = req.headers?.['x-csrf-token'] || req.headers?.['X-CSRF-Token'] || '';
  if (!csrfToken) {
    return { valid: false, message: 'Missing CSRF token' };
  }

  // In production, validate against server-stored CSRF token for the session
  // For now, presence check + format validation
  if (csrfToken.length < 32) {
    return { valid: false, message: 'Invalid CSRF token' };
  }

  return { valid: true };
}

/**
 * Structured audit log entry
 */
const auditLogStore = [];

function auditLog(req, action, details = {}) {
  const entry = {
    id: `AL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    userId: req.user?.sub || 'anonymous',
    userEmail: req.user?.email || 'unknown',
    userRole: req.user?.role || 'none',
    action,
    resource: details.resource || null,
    resourceId: details.resourceId || null,
    result: details.result || 'success',
    ip: req.headers?.['x-forwarded-for'] || req.headers?.['client-ip'] || 'unknown',
    userAgent: req.headers?.['user-agent'] || 'unknown',
    details: details.message || null,
    metadata: details.metadata || null
  };

  auditLogStore.push(entry);

  // Keep only last 10000 entries in memory (use persistent store in production)
  if (auditLogStore.length > 10000) {
    auditLogStore.splice(0, auditLogStore.length - 10000);
  }

  // Anomaly detection
  detectAnomalies(entry);

  return entry;
}

function getAuditLogs(filters = {}) {
  let logs = [...auditLogStore];

  if (filters.userId) {
    logs = logs.filter(l => l.userId === filters.userId);
  }
  if (filters.action) {
    logs = logs.filter(l => l.action === filters.action);
  }
  if (filters.startDate) {
    logs = logs.filter(l => l.timestamp >= filters.startDate);
  }
  if (filters.endDate) {
    logs = logs.filter(l => l.timestamp <= filters.endDate);
  }

  // Sort newest first
  logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return logs;
}

/**
 * Anomaly detection in audit events
 */
const anomalyCounters = new Map();

function detectAnomalies(entry) {
  const now = Date.now();
  const windowMs = 600000; // 10 minutes

  // Track PII reveals per user
  if (entry.action === 'pii:reveal') {
    const key = `pii_reveal:${entry.userId}`;
    if (!anomalyCounters.has(key)) anomalyCounters.set(key, []);
    const times = anomalyCounters.get(key);
    times.push(now);
    const recent = times.filter(t => now - t < windowMs);
    anomalyCounters.set(key, recent);
    if (recent.length > 5) {
      auditLog({ user: { sub: 'system' }, headers: {} }, 'anomaly:bulk_pii_access', {
        result: 'alert',
        message: `User ${entry.userEmail} accessed >5 PII reveals in 10 minutes`,
        metadata: { triggeredBy: entry.userId, count: recent.length }
      });
    }
  }

  // Track failed logins per IP
  if (entry.action === 'auth:login_failed') {
    const key = `login_fail:${entry.ip}`;
    if (!anomalyCounters.has(key)) anomalyCounters.set(key, []);
    const times = anomalyCounters.get(key);
    times.push(now);
    const recent = times.filter(t => now - t < 900000); // 15 min
    anomalyCounters.set(key, recent);
    if (recent.length > 5) {
      auditLog({ user: { sub: 'system' }, headers: {} }, 'anomaly:brute_force', {
        result: 'alert',
        message: `IP ${entry.ip} has >5 failed logins in 15 minutes`,
        metadata: { ip: entry.ip, count: recent.length }
      });
    }
  }

  // Track off-hours admin access
  if (entry.userRole === 'super_admin' || entry.userRole === 'admin') {
    const hour = new Date(entry.timestamp).getHours();
    if (hour < 6 || hour > 22) {
      auditLog({ user: { sub: 'system' }, headers: {} }, 'anomaly:off_hours_access', {
        result: 'flag',
        message: `Admin ${entry.userEmail} accessed system at ${hour}:00`,
        metadata: { triggeredBy: entry.userId, hour }
      });
    }
  }
}

/**
 * Sanitize output — strip/mask fields per role before response
 */
function sanitizeOutput(data, role) {
  if (!data) return data;

  const sensitiveFields = ['ssn', 'dd_bank1Routing', 'dd_bank1Account', 'dd_bank2Routing', 'dd_bank2Account', 'passwordHash'];

  function maskValue(key, value) {
    if (!value || typeof value !== 'string') return value;
    if (key === 'ssn') return `***-**-${value.slice(-4)}`;
    if (key.includes('Routing')) return `*****${value.slice(-4)}`;
    if (key.includes('Account')) return `****${value.slice(-4)}`;
    return value;
  }

  function sanitizeObject(obj) {
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj !== 'object' || obj === null) return obj;

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'passwordHash') continue; // Never send password hashes
      if (sensitiveFields.includes(key) && role !== 'super_admin') {
        result[key] = maskValue(key, value);
      } else if (typeof value === 'object') {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return sanitizeObject(data);
}

/**
 * Standard error response (no internal details leaked)
 */
function errorResponse(status, message, referenceId = null) {
  const body = { error: message, status };
  if (referenceId) body.referenceId = referenceId;
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

/**
 * Standard success response
 */
function successResponse(data, status = 200) {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

module.exports = {
  rateLimiter,
  authenticateRequest,
  verifyCsrf,
  auditLog,
  getAuditLogs,
  sanitizeOutput,
  errorResponse,
  successResponse,
  auditLogStore
};
