const { initDemoUsers, getUserByEmail, verifyPassword, generateAccessToken, generateRefreshToken, generateCSRFToken } = require('../lib/auth');
const { rateLimiter, auditLog, errorResponse, successResponse } = require('../lib/middleware');
const { validate, loginSchema } = require('../lib/validation');

module.exports = async function (context, req) {
  // Initialize demo users on first call
  await initDemoUsers();

  // Rate limiting: 5 attempts per 15 minutes per IP
  const ip = req.headers['x-forwarded-for'] || req.headers['client-ip'] || 'unknown';
  const rateResult = rateLimiter(`auth:${ip}`, 5, 900000);
  if (rateResult.limited) {
    auditLog(req, 'auth:rate_limited', { result: 'blocked', message: `IP ${ip} rate limited` });
    context.res = errorResponse(429, 'Too many login attempts. Please try again later.');
    context.res.headers = { ...context.res.headers, 'Retry-After': String(rateResult.retryAfter) };
    return;
  }

  // Validate request body
  const body = req.body || {};
  const { valid, errors } = validate(body, loginSchema);
  if (!valid) {
    context.res = errorResponse(400, 'Invalid request', errors);
    return;
  }

  const { email, password } = body;

  // Find user
  const user = getUserByEmail(email);
  if (!user) {
    auditLog(req, 'auth:login_failed', { result: 'failure', message: `Unknown email: ${email}`, metadata: { ip } });
    // Use same delay as successful bcrypt to prevent timing attacks
    await new Promise(r => setTimeout(r, 200));
    context.res = errorResponse(401, 'Invalid email or password');
    return;
  }

  // Verify password
  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    auditLog(req, 'auth:login_failed', { result: 'failure', message: `Bad password for ${email}`, metadata: { ip } });
    context.res = errorResponse(401, 'Invalid email or password');
    return;
  }

  // Check if MFA is enabled
  if (user.mfaEnabled && user.mfaSecret) {
    // Return MFA challenge instead of full tokens
    const mfaToken = generateAccessToken({ sub: user.id, email: user.email, role: 'mfa_pending', facilityIds: [] });
    auditLog(req, 'auth:mfa_required', { result: 'pending', message: `MFA challenge for ${email}` });
    context.res = successResponse({
      requiresMfa: true,
      mfaToken
    });
    return;
  }

  // Generate tokens
  const tokenPayload = { sub: user.id, email: user.email, role: user.role, facilityIds: user.facilityIds };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  const csrfToken = generateCSRFToken();

  auditLog(req, 'auth:login', { result: 'success', message: `Login from ${ip}`, metadata: { userId: user.id, ip } });

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
