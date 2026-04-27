const OpenAI = require('openai');
const Parser = require('rss-parser');
const parser = new Parser();


const categoryFeeds = {
  stars: [
    'https://news.google.com/rss/search?q=celebrity+news&hl=en-US&gl=US&ceid=US:en',
    'https://okmagazine.com/rss/',
    'https://feeds-api.dotdashmeredith.com/v1/rss/google/79365970-e87d-4fb6-966a-1c657b08f44f',
    'https://www.tmz.com/rss.xml',
    'https://www.buzzfeed.com/tag/actors.xml',
    'https://www.ok.co.uk/celebrity-news/?service=rss',
    'https://mastodon.social/tags/CelebrityNews.rss'
  ],
  gossip: [
    'https://news.google.com/rss/search?q=celebrity+gossip+rumors+exclusive&hl=en-US&gl=US&ceid=US:en',
    'https://okmagazine.com/rss/',
    'https://feeds-api.dotdashmeredith.com/v1/rss/google/79365970-e87d-4fb6-966a-1c657b08f44f',
    'https://www.tmz.com/rss.xml',
    'https://www.buzzfeed.com/tag/actors.xml',
    'https://www.ok.co.uk/celebrity-news/?service=rss'
  ],
  scandals: [
    'https://news.google.com/rss/search?q=celebrity+scandal+controversy&hl=en-US&gl=US&ceid=US:en',
    'https://okmagazine.com/rss/',
    'https://feeds-api.dotdashmeredith.com/v1/rss/google/79365970-e87d-4fb6-966a-1c657b08f44f',
    'https://www.tmz.com/rss.xml',
    'https://www.buzzfeed.com/tag/actors.xml',
    'https://www.ok.co.uk/celebrity-news/?service=rss'
  ],
  fashion: [
    'https://news.google.com/rss/search?q=celebrity+fashion&hl=en-US&gl=US&ceid=US:en',
    'https://okmagazine.com/style/rss/'
  ],
  couples: [
    'https://news.google.com/rss/search?q=celebrity+couples+dating+split&hl=en-US&gl=US&ceid=US:en',
    'https://feeds-api.dotdashmeredith.com/v1/rss/google/79365970-e87d-4fb6-966a-1c657b08f44f',
    'https://okmagazine.com/royals/rss/',
    'https://www.tmz.com/rss.xml',
    'https://www.buzzfeed.com/tag/actors.xml',
    'https://www.ok.co.uk/celebrity-news/?service=rss'
  ],
  babies: [
    'https://news.google.com/rss/search?q=celebrity+baby+OR+welcomes+OR+gave+birth+OR+expecting+OR+pregnant&hl=en-US&gl=US&ceid=US:en',
    'https://okmagazine.com/royals/rss/',
    'https://www.tmz.com/rss.xml',
    'https://www.buzzfeed.com/tag/actors.xml'
  ]
};


async function fetchRealNewsFromRSS(category) {
  try {
    const feeds = categoryFeeds[category] || categoryFeeds['stars'];
    let allArticles = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        let articles = feed.items.slice(0, 15);
        allArticles = allArticles.concat(articles);
      } catch (err) {
        console.error(`Ошибка парсинга RSS ${feedUrl}:`, err.message);
      }
    }

    if (allArticles.length === 0) return null;

    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const latest = allArticles.slice(0, 30);

    const context = latest.map((item, idx) => {
      let domain = '';
      try {
        domain = new URL(item.link).hostname;
      } catch (e) {
        domain = 'источник';
      }

      let imageUrl = '';
      
      
      if (item.enclosure && item.enclosure.url) {
        imageUrl = item.enclosure.url;
      }
      
      else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
        imageUrl = item['media:content'].$.url;
      }
      
      else if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
        imageUrl = item['media:thumbnail'].$.url;
      }
    
      else if (item['content:encoded'] && item['content:encoded'].match(/<img[^>]+src="([^">]+)"/)) {
        imageUrl = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/)[1];
      }
     
      else if (item.content && item.content.match(/<img[^>]+src="([^">]+)"/)) {
        imageUrl = item.content.match(/<img[^>]+src="([^">]+)"/)[1];
      }
     
      else if (item.description && item.description.match(/<img[^>]+src="([^">]+)"/)) {
        imageUrl = item.description.match(/<img[^>]+src="([^">]+)"/)[1];
      }
      
    
      if (imageUrl && imageUrl.includes('?')) {
        imageUrl = imageUrl.split('?')[0];
      }

      return `[${idx + 1}] ${item.title}
Источник: ${domain}
Ссылка: ${item.link}
${imageUrl ? `Изображение: ${imageUrl}` : 'Изображение: не найдено'}
Кратко: ${(item.contentSnippet || item.summary || '').substring(0, 300)}`;
    }).join('\n\n');

    return context;
  } catch (error) {
    console.error('Ошибка получения RSS-новостей:', error.message);
    return null;
  }
}


const authorStyles = {
  1: {
    name: 'Роберта «Naughty» Шутер',
    desc: `Стиль: энергичный подкаст-сторителлинг.
    - Короткие, ритмичные предложения, как в устном рассказе.
    - Инсайдерские детали: "я слышала от источника...", "они не хотели, чтобы это попало в прессу".
    - Юмор, самоирония, легкая провокация без злости.
    - Лексика: "сплетня", "эксклюзив", "скандал", "интрига", "лайфстайл".
    - Тон: дружеский, заговорщицкий, будто вы пьете кофе с лучшей подругой из Голливуда.
    - Важно: даже слухи подаются с пометкой "naughty but nice" — пикантно, но не жестоко.`
  },
  2: {
    name: 'Риис «GuyWithACamera» Фельдман',
    desc: `Стиль: иммерсивный репортаж изнутри системы.
    - Очень короткие фразы, как подписи к вирусным видео.
    - Глаголы действия: "смотрю", "вижу", "ловлю момент", "вот как это происходит на самом деле".
    - Отсутствие пафоса, максимальная аутентичность.
    - Лексика: "закадровик", "премьера", "красная дорожка", "монтажная", "ассистентка".
    - Тон: наблюдательный, слегка удивленный, без прикрас.
    - Важно: никаких теорий — только то, что она сама видела своей камерой.`
  },
  3: {
    name: 'Ливия «MyLifeInMovies» Маркс',
    desc: `Стиль: теплое звездное интервью в TikTok-формате.
    - Разговорный тон, будто вы болтаете с подругой.
    - Искренние комплименты звездам и эмпатия к ним.
    - Короткие вовлекающие фразы: "вы не поверите...", "она сказала мне...".
    - Лексика: "интервью", "красная дорожка", "звезда", "эмоции", "искренность", "кастинг".
    - Тон: восхищенный, но без фанатизма, дружелюбный.
    - Важно: теплота и открытость не должны превращаться в навязчивость.`
  },
  4: {
    name: 'Переста «Perez» Хилтон',
    desc: `Стиль: скандально-саркастический обзор.
    - Короткие, рубленые фразы с ядовитым комментарием.
    - Ирония, сарказм, иногда гротеск.
    - Обращение к звезде напрямую: "дорогая Бритни...", "послушай, Канье...".
    - Лексика: "позор", "фейл", "икона", "скандал", "развод", "пластика", "сплетня".
    - Тон: эпатажный, на грани фола, но уже более политкорректный, чем в 2000-х.
    - Важно: сарказм не должен переходить в откровенную травлю.`
  },
  5: {
    name: 'Джастина «JustJared» Джерард',
    desc: `Стиль: оперативный новостной репортаж с фото.
    - Факты, даты, места, имена — максимально конкретно.
    - Нет лишних эмоций, только проверенная информация.
    - Структура: кто → что → где → когда → почему (если известно).
    - Лексика: "эксклюзив", "фото", "источник", "подтверждено", "премьера", "контракт", "слухи опровергнуты".
    - Тон: сдержанный, информативный, профессиональный.
    - Важно: даже сенсация подается без желтизны — только сухие факты и качественные фотографии.`
  }
};

exports.generateNews = async (req, res) => {
  try {
    const { authorId, category } = req.body;
    if (!authorId || !category) {
      return res.status(400).json({ error: 'Не выбраны автор и категория' });
    }

    const author = authorStyles[authorId];
    if (!author) {
      return res.status(400).json({ error: 'Автор не найден' });
    }

    let realNewsContext = await fetchRealNewsFromRSS(category);
    console.log('RSS контекст получен:', realNewsContext ? 'да' : 'нет');

    if (!realNewsContext) {
      return res.status(400).json({ error: 'Не найдено актуальных новостей по этой категории. Попробуйте другую категорию или повторите позже.' });
    }

    const now = new Date();
    const currentMonth = now.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const previousMonth = oneMonthAgo.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

   let prompt = `Требуется сгенерировать JSON-объект, представляющий **реальную, свежую новость** из мира голливудских знаменитостей по тематике "${category}". 

**АВТОР:** Новость должна быть написана от лица журналистки **${author.name}**.
**ВАЖНО:** В финальном тексте НЕ ИСПОЛЬЗУЙ служебные маркеры (например, **факт**, **тезис**, **вывод**, **итог** и подобные). Пиши связный текст без выделений структуры.    
**ЗАПРЕЩЕНО:** добавлять служебные строки, не относящиеся к тексту новости: «Дата публикации новости в подборке», «Статус события», «по материалам», «источник», «дата публикации» и т.п. Вся информация должна быть внутри связного текста.

**СТИЛЬ:** ${author.desc}

**АКТУАЛЬНОСТЬ И ДАТИРОВКА:**
- Новость должна описывать **УЖЕ ПРОИЗОШЕДШЕЕ** событие, которое случилось в период **с ${previousMonth} по ${currentMonth}** (последние 30 дней).
- Если точная дата неизвестна, укажи примерный период по контексту: "в начале марта 2026", "в середине февраля 2026", "на прошлой неделе" и т.п.
- Дата должна быть естественно вплетена в текст новости.

**РЕАЛЬНЫЕ НОВОСТИ ДЛЯ ОСНОВЫ (используй их факты, не выдумывай!):**
${realNewsContext}

**ВАЖНО:** 
- Используй ТОЛЬКО те новости и ссылки, которые перечислены выше. Если в одном источнике нет всех деталей, используй факты из нескольких, чтобы собрать полную картину. Укажи, что информация основана на нескольких источниках.
- Если ссылка есть в контексте, используй её. Не добавляй новые ссылки от себя. Не выдумывай события, имена звезд, названия фильмов, даты.
- Если в контексте недостаточно деталей для полноценной новости (нет конкретных имен, дат, мест), верни ошибку.

**КРИТИЧЕСКИ ВАЖНО:**
- **НЕ ВЫДУМЫВАЙ НЕСУЩЕСТВУЮЩИХ ЗНАМЕНИТОСТЕЙ, ФИЛЬМОВ, ПРЕМЬЕР, СКАНДАЛОВ, РАЗВОДОВ, БЕРЕМЕННОСТЕЙ.**
- Сохраняй все факты из контекста (имена звезд, названия фильмов/шоу, даты, цитаты).
- **Самопроверка:** перед ответом проверь, все ли ключе факты подтверждаются контекстом. Если нет — верни ошибку.

**ТРЕБОВАНИЯ К ФОРМАТУ:**
- Включай гиперссылки (в формате <a href="URL">название источника</a>) на предоставленные в контексте источники. Если источник не указан в контексте, не добавляй ссылку.
- Структура: заголовок (цепляющий, в стиле автора), лид (1-2 предложения с сутью), основная часть (развернуто, с деталями), ссылки, дата.
- Тон: строго в стиле автора, но факты остаются точными.

**ТРЕБОВАНИЯ К КОНКРЕТИКЕ:**
- Обязательно укажи конкретные имена звезд (реальные, из контекста).
- Для скандалов: кто участники, что произошло, где, когда, реакция сторон.
- Для слухов: источник слуха (инсайдер, анонимный источник, соцсети звезды).
- Для пар: имена обоих, статус отношений (встречаются, помолвлены, расстались, поженились).
- Для детей: кто из звезд, имя ребенка (если известно), дата рождения, пол.
- Для моды: мероприятие, дизайнер, детали наряда, реакция публики/критиков.
- Добавь конкретные детали (даты, места, цитаты, цифры), если они есть в контексте.

**ФОРМАТ JSON:**
{
  "title": "... (короткий, яркий заголовок, до 10 слов)",
  "excerpt": "... (1-2 предложения, 150-250 знаков, раскрывает суть)",
  "content": "... (минимум 1500 знаков, с гиперссылками, в стиле автора)",
  "tags": ["тег1", "тег2", "тег3"] (3-5 тегов, например: ["БрэдПитт", "скандал", "Голливуд"]),
  "yandex_news": "Текст для Яндекс.Новостей. Сухой, фактологический, без лишних деталей и оценки. Только факты: кто, что, где, когда. Без восклицаний и эмоций. Объём: 300–500 знаков.",
  "google_news": "Текст для Google News. Аналогичный формат, фактологический, без оценки. Только ключевые факты. 300–500 знаков.",
  "image": "URL изображения из контекста, если есть строка 'Изображение: https://...' в новости выше. Если есть - скопируй этот URL. Если нет - оставь пустую строку." 
}

Верни только JSON, без пояснений, без markdown-разметки.`;

    const client = new OpenAI({
      apiKey: process.env.AITUNNEL_API_KEY,
      baseURL: 'https://api.aitunnel.ru/v1/'
    });

    const response = await client.chat.completions.create({
      model: 'gpt-5.4-nano',   
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 3000
    });
    
    const content = response.choices[0].message.content;
    console.log(content);
    if (!content) return res.status(500).json({ error: 'AI вернул пустой ответ' });

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Не удалось найти JSON в ответе:', content);
      return res.status(500).json({ error: 'Ответ AI не содержит JSON' });
    }

    let cleaned = jsonMatch[0];
    cleaned = cleaned.replace(/^```json\s*|```\s*$/g, '').trim();

    let newsData;
    try {
      newsData = JSON.parse(cleaned);
    } catch (e) {
      console.error('Ошибка парсинга JSON от AI:', cleaned);
      return res.status(500).json({ error: 'Не удалось распарсить ответ AI' });
    }

    if (newsData.error) {
      return res.status(400).json({ error: newsData.error });
    }

    res.json(newsData);
  } catch (error) {
    console.error('Ошибка генерации новости:', error);
    res.status(500).json({ error: 'Ошибка при обращении к AI' });
  }
};
















