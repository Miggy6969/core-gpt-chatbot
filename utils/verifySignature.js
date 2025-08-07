// utils/verifySignature.js
const crypto = require('crypto');

function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.warn('⚠️ No signature found on request');
    return;
  }

  const elements = signature.split('=');
  const method = elements[0];
  const signatureHash = elements[1];

  const expectedHash = crypto
    .createHmac('sha256', process.env.APP_SECRET)
    .update(buf)
    .digest('hex');

  if (signatureHash !== expectedHash) {
    throw new Error('Signature verification failed');
  }
}

module.exports = { verifyRequestSignature };