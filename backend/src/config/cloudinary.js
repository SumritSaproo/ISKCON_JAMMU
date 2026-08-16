const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a local/buffer file to Cloudinary under a folder per content type,
 * so gallery/event/blog images stay organized and easy to purge via CDN.
 */
async function uploadImage(filePathOrBuffer, folder = 'iskcon-jammu/misc') {
  const result = await cloudinary.uploader.upload(filePathOrBuffer, {
    folder,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

module.exports = { cloudinary, uploadImage };
