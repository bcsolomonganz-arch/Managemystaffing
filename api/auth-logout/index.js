const { revokeToken } = require('../lib/auth');
const { authenticateRequest, auditLog, successResponse } = require('../lib/middleware');

module.exports = async function (context, req) {
  // Try to authenticate (but don't fail if token is already expired)
  const authResult = authenticateRequest(req);

  if (authResult.authenticated && req.user?.jti) {
    revokeToken(req.user.jti);
  }

  auditLog(req, 'auth:logout', {
    result: 'success',
    message: `User logged out: ${req.user?.email || 'unknown'}`
  });

  // Clear refresh token cookie
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    },
    body: JSON.stringify({ message: 'Logged out successfully' })
  };
};
