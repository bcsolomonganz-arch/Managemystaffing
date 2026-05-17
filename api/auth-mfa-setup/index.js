const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const { getUserById } = require('../lib/auth');
const { authenticateRequest, auditLog, errorResponse, successResponse } = require('../lib/middleware');

module.exports = async function (context, req) {
  // Authenticate
  const authResult = authenticateRequest(req);
  if (!authResult.authenticated) {
    context.res = errorResponse(authResult.status, authResult.message);
    return;
  }

  const user = getUserById(req.user.sub);
  if (!user) {
    context.res = errorResponse(404, 'User not found');
    return;
  }

  if (user.mfaEnabled) {
    context.res = errorResponse(400, 'MFA is already enabled');
    return;
  }

  // Generate TOTP secret
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, 'StaffHub', secret);

  // Generate QR code as data URL
  let qrDataUrl;
  try {
    qrDataUrl = await QRCode.toDataURL(otpauth);
  } catch (err) {
    context.res = errorResponse(500, 'Failed to generate QR code');
    return;
  }

  // Store secret temporarily (in production, use encrypted temp storage)
  user._pendingMfaSecret = secret;

  auditLog(req, 'auth:mfa_setup_initiated', { result: 'success', message: `MFA setup started for ${user.email}` });

  context.res = successResponse({
    secret,
    qrCode: qrDataUrl,
    message: 'Scan the QR code with your authenticator app, then verify with a code.'
  });
};
