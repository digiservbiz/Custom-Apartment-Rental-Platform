const cloudinary = require('cloudinary').v2;
const config = require('../config');

// Lazily configure Cloudinary so the app boots without credentials;
// uploads simply report "not configured" until the env vars are set.
let configured = false;
const isConfigured = () => {
  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) return false;
  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    configured = true;
  }
  return true;
};

/**
 * Upload an in-memory image buffer to Cloudinary.
 * @param {Buffer} buffer - File contents from multer memory storage.
 * @param {string} mimetype - e.g. "image/jpeg".
 * @returns {Promise<string>} The hosted image's secure URL.
 */
const uploadImage = async (buffer, mimetype) => {
  const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'apartments',
    resource_type: 'image',
  });
  return result.secure_url;
};

module.exports = { isConfigured, uploadImage };
