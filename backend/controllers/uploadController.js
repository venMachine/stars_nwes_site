const { uploadImageFromUrl } = require('../services/cloudinaryService');

exports.uploadImageFromUrl = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL изображения обязателен' });
    }

    const cloudinaryUrl = await uploadImageFromUrl(imageUrl);
    res.json({ url: cloudinaryUrl });
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    res.status(500).json({ error: 'Не удалось загрузить изображение' });
  }
};