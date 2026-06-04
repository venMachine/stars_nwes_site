const OpenAI = require('openai');
const Parser = require('rss-parser');
const parser = new Parser();


const categoryFeeds = {
  stars: [
    'https://news.google.com/rss/search?q=celebrity+news&hl=en-US&gl=US&ceid=US:en',
    'https://www.buzzfeed.com/tag/actors.xml',
    'https://www.ok.co.uk/celebrity-news/?service=rss',
   
  ],
  gossip: [
    'https://news.google.com/rss/search?q=celebrity+gossip+rumors+exclusive&hl=en-US&gl=US&ceid=US:en',
    'https://mastodon.social/tags/CelebrityNews.rss'
  
  ],
  scandals: [
    'https://news.google.com/rss/search?q=celebrity+scandal+controversy&hl=en-US&gl=US&ceid=US:en',
    'https://feeds-api.dotdashmeredith.com/v1/rss/google/79365970-e87d-4fb6-966a-1c657b08f44f',
 
  ],
  fashion: [
    'https://news.google.com/rss/search?q=celebrity+fashion&hl=en-US&gl=US&ceid=US:en',
    'https://okmagazine.com/style/rss/'
  ],
  couples: [
    'https://news.google.com/rss/search?q=celebrity+couples+dating+split&hl=en-US&gl=US&ceid=US:en',
    'https://www.tmz.com/rss.xml',
  ],
  babies: [
    'https://news.google.com/rss/search?q=celebrity+baby+OR+welcomes+OR+gave+birth+OR+expecting+OR+pregnant&hl=en-US&gl=US&ceid=US:en',
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

  let prompt = `Ты генерируешь JSON для Яндекс.Дзен. НАРУШЕНИЕ ЛЮБОГО ПРАВИЛА НЕДОПУСТИМО. ОСОБО ВАЖНО: ЗАПРЕЩЕНО ВЫДУМЫВАТЬ ЛЮБЫЕ ФАКТЫ, ЗНАМЕНИТОСТЕЙ, ФИЛЬМЫ, ДАТЫ, СОБЫТИЯ.

**ТЕМАТИКА:** Новости голливудских знаменитостей, категория "${category}"
**АВТОР (только в метаданных, НЕ В CONTENT):** ${author.name}
**СТИЛЬ АВТОРА:** ${author.desc}
**ЕДИНСТВЕННЫЕ ИСТОЧНИКИ ФАКТОВ (других нет):** ${realNewsContext}

---

## ⛔ ЖЁСТКИЙ ЗАПРЕТ НА ВЫДУМЫВАНИЕ
- НЕ придумывай знаменитостей, фильмы, сериалы, премьеры, скандалы, разводы, беременности, романы.
- НЕ придумывай даты, места, цитаты, цифры, имена детей или инсайдеров.
- ЕСЛИ в источнике написано «возможно», «слухи», «инсайдер сообщает» — сохрани эту модальность.
- Используй ТОЛЬКО ссылки из контекста (в формате <a href="URL">название</a>).
- Если факта нет в контексте — НЕ ПИШИ.

---

## 📋 ПРАВИЛА ФОРМАТИРОВАНИЯ CONTENT (для Яндекс.Дзен)

### 1. ЗАПРЕЩЕНО В CONTENT:
- Начинать с «Я, [имя]...», «Мы...», с представления автора. Первая строка — сразу факт или интрига.
- Длинные абзацы (максимум 3 предложения или 4 строки).
- Пассивный залог («было отмечено», «сообщается»).
- Служебные фразы («как уже было сказано», «на основе источников»).
- Любые выдуманные факты.

### 2. ОБЯЗАТЕЛЬНЫЕ ЭЛЕМЕНТЫ:
- **Первый абзац (лид)** — начинается с громкого факта, цифры, интриги. Без имени автора.
- **Минимум 2 подзаголовка** (каждый на отдельной строке, 3–7 слов, можно с эмодзи). Пример: «🕯️ Скандал на красной дорожке» или **«Почему они расстались»**.
- **Блок «Что в итоге?»** или «Коротко» в конце (обязательно). Резюмирует главное.
- **Каждая ссылка** из контекста обёрнута в <a href="URL">текст</a>.

### 3. ШАБЛОН CONTENT (заполни точно, заменив описания на реальные факты):

[ЛИД: 2-3 коротких предложения, начинаются с самого яркого факта (кто, что, где, когда). Без "Я".]

[ПОДЗАГОЛОВОК 1 (короткий)]

[Абзац: 2-3 предложения с первой порцией фактов + ссылка на источник]
[Абзац: ещё 2-3 предложения, детали, цитаты, реакция]

[ПОДЗАГОЛОВОК 2 (короткий)]

[Абзац: 2-3 предложения с продолжением или другой гранью события + ссылка]
[Абзац: пояснение, контекст, мнение эксперта (если есть в источнике)]

[Если нужно — ПОДЗАГОЛОВОК 3 и т.д.]

[БЛОК «Что в итоге?»: 2-4 предложения, простой язык, главный вывод для читателя]

---

## 🔁 САМОПРОВЕРКА ПЕРЕД ВЫДАЧЕЙ JSON

1. Начинается ли content с имени автора? → ЕСЛИ ДА, ОСТАНОВИСЬ И ИСПРАВЬ.
2. Есть ли хотя бы 2 подзаголовка? → ЕСЛИ НЕТ, ДОБАВЬ.
3. Есть ли блок «Что в итоге?»? → ЕСЛИ НЕТ, ДОБАВЬ.
4. Все ли абзацы короче 3 предложений? → ЕСЛИ НЕТ, РАЗБЕЙ.
5. Каждый ли факт взят из предоставленных источников? → ЕСЛИ ХОТЬ ОДИН ФАКТ ВЫДУМАН, УДАЛИ.
6. Использованы ли ТОЛЬКО ссылки из контекста? → ЕСЛИ ЕСТЬ ЛИШНИЕ, УДАЛИ.

ТОЛЬКО ПОСЛЕ УСПЕШНОЙ ПРОВЕРКИ ВЫДАВАЙ JSON.

---

## 📦 ФОРМАТ JSON (все поля обязательны)

{
  "title": "до 10 слов, кликабельный, с громким именем или интригой",
  "excerpt": "1-2 предложения, 150-250 знаков, раскрывает суть",
  "content": "текст по шаблону выше (минимум 2500 знаков, с подзаголовками, с блоком Что в итоге?)",
  "tags": ["тег1", "тег2", "тег3", "тег4", "тег5"] (3-5 тегов, например: ["БрэдПитт", "скандал", "Голливуд"]),
  "yandex_news": "Сухой фактологический текст 300-500 знаков. Только факты: кто, что, где, когда. Без эмодзи, без оценки.",
  "google_news": "Аналогично, 300-500 знаков. Без оценки и эмоций.",
  "image": "URL изображения из контекста (если есть строка 'Изображение: https://...') или пустая строка"
}

ВЕРНИ ТОЛЬКО JSON. НИКАКОГО ПОЯСНИТЕЛЬНОГО ТЕКСТА.`
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
















