const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImageFromUrl(imageUrl) {
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    const compressed = await sharp(response.data)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'barracudastars/news',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      ).end(compressed);
    });

    return result.secure_url;
  } catch (error) {
    console.error('Ошибка загрузки в Cloudinary:', error);
    throw error;
  }
}

module.exports = { uploadImageFromUrl };