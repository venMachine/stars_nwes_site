const Article = require('../models/Article');
const telegramService = require('../services/telegramService');
const { generateYandexRss, generateGoogleSitemap } = require('../services/newsFeedsService');

// exports.getAllArticles = async (req, res) => {
//   try {
//     const { limit = 1000, category, published_to_news } = req.query;
//     const filter = {};
//     if (category && category !== 'all') filter['category.slug'] = category;
//     if (published_to_news === 'true') {
//       filter.$or = [{ published_to_yandex: true }, { published_to_google: true }];
//     }
//     const articles = await Article.find(filter)
//       .sort({ publishedAt: -1, createdAt: -1 })
//       .limit(parseInt(limit));
//     res.json(articles);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { category, isFeatured, excludeFeatured } = req.query;
    
    const filter = {};
    if (category && category !== 'all') filter['category.slug'] = category;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (excludeFeatured === 'true') filter.isFeatured = { $ne: true };
    
    const articles = await Article.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Article.countDocuments(filter);
    
    res.json({
      data: articles,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    
   
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createArticle = async (req, res) => {
  try {
    const articleData = req.body;

    if (articleData.publishToTelegram === undefined) {
      articleData.publishToTelegram = true;
    }

    const article = new Article(articleData);
    await article.save();

  
    if (article.publishToTelegram !== false) {
      
      telegramService.publishNews(article).catch(err => 
        console.error('Ошибка фоновой публикации в Telegram:', err)
      );
    }

    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  await generateYandexRss(await Article.find({ publishedAt: { $ne: null } }).sort({ publishedAt: -1 }).limit(100));
  await generateGoogleSitemap(await Article.find({ publishedAt: { $ne: null } }).sort({ publishedAt: -1 }).limit(1000));
};


exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
      
    if (article.publishToTelegram !== false) {
      
      telegramService.publishNews(article).catch(err => 
        console.error('Ошибка фоновой публикации в Telegram:', err)
      );
    }
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({ slug: req.params.slug });
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    res.json({ message: 'Статья удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchArticles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]); 
    }

    const articles = await Article.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).sort({ publishedAt: -1, createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  };

  exports.publishToYandex = async (req, res) => {
  try {
    const { slug } = req.body;
    const article = await Article.findOneAndUpdate(
      { slug },
      { published_to_yandex: true },
      { new: true }
    );
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    
   
    const { generateYandexRss } = require('../services/newsFeedsService');
    const articles = await Article.find({ published_to_yandex: true }).sort({ createdAt: -1 }).limit(50);
    await generateYandexRss(articles);
    
    res.json({ message: 'Статья отправлена в Яндекс.Новости' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.publishToGoogle = async (req, res) => {
  try {
    const { slug } = req.body;
    const article = await Article.findOneAndUpdate(
      { slug },
      { published_to_google: true },
      { new: true }
    );
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    

    const { generateGoogleSitemap } = require('../services/newsFeedsService');
    const articles = await Article.find({ published_to_google: true }).sort({ createdAt: -1 }).limit(50);
    await generateGoogleSitemap(articles);
    
    res.json({ message: 'Статья отправлена в Google News' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllArticlesForSitemap = async (req, res) => {
  try {
    const articles = await Article.find({})
      .sort({ publishedAt: -1, createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};