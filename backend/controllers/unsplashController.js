const axios = require('axios');

exports.searchImages = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Нужен поисковый запрос' });
    }

    const apiKey = process.env.UNSPLASH_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Ключ Unsplash не настроен' });
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${apiKey}`
      },
      params: {
        query,
        per_page: 20,
        orientation: 'landscape'
      }
    });

    const images = response.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.small,
      photographer: photo.user.name,
      photographer_url: photo.user.links.html
    }));

    res.json(images);
  } catch (error) {
    console.error('Ошибка запроса к Unsplash:', error.response?.data || error.message);
    res.status(500).json({ error: 'Не удалось загрузить изображения' });
  }
};