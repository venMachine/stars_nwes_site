const axios = require('axios');

exports.searchImages = async (req, res) => {




  try {

    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Нужен поисковый запрос' });
    }

    const apiKey = process.env.PEXELS_API_KEY;


    if (!apiKey) {
      console.error('PEXELS_API_KEY не задан');
      return res.status(500).json({ error: 'Ключ Pexels не настроен' });
    }

    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        Authorization: apiKey
      },
      params: {
        query,
        per_page: 20,
        orientation: 'landscape'
      }
    });


    const images = response.data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large,
      thumbnail: photo.src.medium,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url
    }));

    res.json(images);
  } catch (error) {

     console.log('Ошибка Pexels:', error.response?.status, error.response?.data, error.message);
  res.status(500).json({ error: 'Не удалось загрузить изображения' });
    
  }
};
