const { authenticator } = require('otplib');
const { verifyToken, getUserById, generateAccessToken, generateRefreshToken, generateCSRFToken } = require('../lib/auth');
const { auditLog, errorResponse, successResponse, rateLimiter } = require('../lib/middleware');
const { validate, mfaVerifySchema } = require('../lib/validation');

module.exports = async function (context, req) {
  const body = req.body || {};
  const { valid, errors } = validate(body, mfaVerifySchema);
  if (!valid) {
    context.res = errorResponse(400, 'Invalid request');
    return;
  }

  const { code, mfaToken } = body;

  // Verify MFA token (short-lived token from login)
  const tokenResult = verifyToken(mfaToken, 'access');
  if (!tokenResult.valid) {
    context.res = errorResponse(401, 'MFA session expired. Please login again.');
    return;
  }

  if (tokenResult.payload.role !== 'mfa_pending') {
    context.res = errorResponse(400, 'Invalid MFA token');
    return;
  }

  // Rate limit MFA attempts
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const rateResult = rateLimiter(`mfa:${tokenResult.payload.sub}`, 5, 300000);
  if (rateResult.limited) {
    context.res = errorResponse(429, 'Too many MFA attempts');
    return;
  }

  const user = getUserById(tokenResult.payload.sub);
  if (!user) {
    context.res = errorResponse(404, 'User not found');
    return;
  }

  // If this is during setup, verify against pending secret
  const secret = user.mfaSecret || user._pendingMfaSecret;
  if (!secret) {
    context.res = errorResponse(400, 'MFA not configured');
    return;
  }

  // Verify TOTP code
  const isValid = authenticator.verify({ token: code, secret });
  if (!isValid) {
    auditLog(req, 'auth:mfa_failed', { result: 'failure', message: `Bad MFA code for ${user.email}` });
    context.res = errorResponse(401, 'Invalid MFA code');
    return;
  }

  // If this was setup verification, activate MFA
  if (user._pendingMfaSecret && !user.mfaEnabled) {
    user.mfaSecret = user._pendingMfaSecret;
    user.mfaEnabled = true;
    delete user._pendingMfaSecret;
    auditLog(req, 'auth:mfa_enabled', { result: 'success', message: `MFA activated for ${user.email}` });
  }

  // Issue full tokens
  const tokenPayload = { sub: user.id, email: user.email, role: user.role, facilityIds: user.facilityIds };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  const csrfToken = generateCSRFToken();

  auditLog(req, 'auth:mfa_verified', { result: 'success', message: `MFA verified for ${user.email}` });

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=28800`
    },
    body: JSON.stringify({
      accessToken,
      csrfToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        facilityIds: user.facilityIds,
        mfaEnabled: user.mfaEnabled
      }
    })
  };
};
