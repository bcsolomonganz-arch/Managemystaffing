const { verifyToken, generateAccessToken, generateRefreshToken, generateCSRFToken, getUserById } = require('../lib/auth');
const { auditLog, errorResponse, successResponse } = require('../lib/middleware');

module.exports = async function (context, req) {
  // Extract refresh token from cookie
  const cookies = parseCookies(req.headers?.cookie || '');
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    context.res = errorResponse(401, 'No refresh token provided');
    return;
  }

  // Verify refresh token
  const result = verifyToken(refreshToken, 'refresh');
  if (!result.valid) {
    auditLog(req, 'auth:refresh_failed', { result: 'failure', message: result.error });
    context.res = errorResponse(401, 'Invalid or expired refresh token');
    return;
  }

  const user = getUserById(result.payload.sub);
  if (!user) {
    context.res = errorResponse(401, 'User not found');
    return;
  }

  // Rotate tokens
  const tokenPayload = { sub: user.id, email: user.email, role: user.role, facilityIds: user.facilityIds };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);
  const csrfToken = generateCSRFToken();

  auditLog(req, 'auth:refresh', { result: 'success', message: `Token rotated for ${user.email}` });

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `refreshToken=${newRefreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=28800`
    },
    body: JSON.stringify({
      accessToken: newAccessToken,
      csrfToken
    })
  };
};

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(pair => {
    const [key, ...val] = pair.trim().split('=');
    if (key) cookies[key.trim()] = val.join('=').trim();
  });
  return cookies;
}
