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
let prompt = `Ты генерируешь JSON для Яндекс.Дзен. НАРУШЕНИЕ ЛЮБОГО ПРАВИЛА НЕДОПУСТИМО.

**ТЕМАТИКА:** Новости голливудских знаменитостей, категория "${category}"
**АВТОР (только в метаданных, НЕ В CONTENT):** ${author.name}
**СТИЛЬ АВТОРА:** ${author.desc}
**ЕДИНСТВЕННЫЕ ИСТОЧНИКИ ФАКТОВ (других нет):** ${realNewsContext}

---

## ⛔ ЖЁСТКИЕ ЗАПРЕТЫ

- НЕ выдумывай знаменитостей, фильмы, скандалы, даты, цифры, цитаты, имена.
- НЕ начинай поле content с «Я», «Мы», с имени автора, с представления себя.
- НЕ пиши длинные абзацы (максимум 3–4 предложения или 5 строк).
- НЕ используй пассивный залог («было отмечено», «сообщается»).
- НЕ пиши служебные фразы («как уже было сказано», «на основе источников»).
- **НЕ используй квадратные скобки и метки-заполнители вроде [ЛИД], [ПОДЗАГОЛОВОК 1].**
- **НЕ обрезай текст** — ты должен выдать статью объёмом НЕ МЕНЕЕ 6000 символов (с пробелами).

## ✅ ОБЯЗАТЕЛЬНЫЕ ЭЛЕМЕНТЫ

1. **Лид** — первые 2–3 предложения. Начинается с яркого факта (кто, что, где, когда). Без «Я».
2. **Минимум 3 подзаголовка** — каждый на отдельной строке, 3–7 слов, можно с эмодзи.
3. **Короткие абзацы** — не более 3–4 предложений каждый.
4. **Блок «Что в итоге?»** — в конце, 3–5 предложений, без квадратных скобок.
5. **Гиперссылки** — все ссылки из контекста обёрнуты в <a href="URL">текст</a>.
6. **Изображение** — если в контексте есть строка «Изображение: https://...», ты ОБЯЗАН скопировать этот URL (целиком, только URL) в поле "image" JSON. Если такой строки нет — оставь пустую строку.

## 📝 КАК ДОЛЖЕН ВЫГЛЯДЕТЬ content (пример структуры)

Первые 2–3 предложения лида. Самый сочный факт сразу.

🕯️ Первый подзаголовок

Короткий абзац с фактами и первой ссылкой. 2–3 предложения.
Второй абзац с продолжением. Тоже 2–3 предложения.

✨ Второй подзаголовок

Следующий абзац с деталями. Ещё один абзац.

🎬 Третий подзаголовок

Дополнительные детали, цитаты (если есть в источнике), реакция.

Что в итоге?

Резюме из 3–5 предложений. Главный вывод для читателя.

## 🔁 САМОПРОВЕРКА ПЕРЕД ВЫДАЧЕЙ JSON

1. Content начинается не с «Я»? → ЕСЛИ ДА, ИСПРАВЬ.
2. Есть минимум 3 подзаголовка? → ЕСЛИ НЕТ, ДОБАВЬ.
3. Есть блок «Что в итоге?» без скобок? → ЕСЛИ НЕТ, ДОБАВЬ.
4. Все абзацы короче 5 строк? → ЕСЛИ НЕТ, РАЗБЕЙ.
5. Длина content больше 6000 символов? → ЕСЛИ НЕТ, РАСШИРЬ, добавив больше деталей из источников.
6. Нет квадратных скобок? → ЕСЛИ ЕСТЬ, УДАЛИ.
7. Если в контексте есть строка «Изображение: URL» → скопировал ли я этот URL в поле image? → ЕСЛИ НЕТ, ИСПРАВЬ.

## 📦 ФОРМАТ JSON

{
  "title": "до 12 слов, кликабельный, с громким именем",
  "excerpt": "1–2 предложения, 150–250 знаков",
  "content": "текст по структуре выше (минимум 6000 знаков, с подзаголовками, с блоком Что в итоге?, без квадратных скобок)",
  "tags": ["тег1", "тег2", "тег3", "тег4"],
  "yandex_news": "Сухой фактологический текст 300–500 знаков. Без эмодзи, без оценки.",
  "google_news": "Аналогично, 300–500 знаков.",
  "image": "скопируй сюда URL из строки 'Изображение: https://...' или оставь пустую строку"
}

ВЕРНИ ТОЛЬКО JSON. НИКАКОГО ПОЯСНИТЕЛЬНОГО ТЕКСТА.`;
    const client = new OpenAI({
      apiKey: process.env.AITUNNEL_API_KEY,
      baseURL: 'https://api.aitunnel.ru/v1/'
    });

    const response = await client.chat.completions.create({
      model: 'gpt-5.4-nano',   
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 7000
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
















