import { writeFileSync } from 'fs';

function getYandexCategory(categorySlug) {
  const mapping = {
    'stars': 'Звёзды',
    'gossip': 'Слухи',
    'scandals': 'Скандалы',
    'fashion': 'Мода',
    'couples': 'Пары',
    'babies': 'Дети'
  };

  if (mapping[categorySlug]) {
    return mapping[categorySlug];
  }

  return 'Звёзды';
}

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateYandexNews() {
  try {
    const res = await fetch('https://barracudastars.ru/api/articles?published_to_yandex=true&limit=100');
    const data = await res.json();
    const articles = data.data || [];
    
    if (!articles.length) {
      console.log('Нет статей для Яндекс.Новостей');
      return;
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0" xmlns:yandex="http://news.yandex.ru">\n';
    xml += '<channel>\n';
    xml += '  <title>BarracudaStars</title>\n';
    xml += '  <link>https://barracudastars.ru</link>\n';
    xml += '  <description>Новости голливудских звёзд, скандалы, мода, слухи и шоу-бизнес</description>\n';
    xml += '  <language>ru</language>\n';

    for (const article of articles) {
      const pubDate = new Date(article.publishedAt || article.createdAt).toUTCString();
      const title = escapeXml(article.title);
      const link = `https://barracudastars.ru/news/${article.slug}`;
      const description = escapeXml(article.yandex_news || article.excerpt || '');
      const fullText = escapeXml(article.yandex_news || article.content || '');
      const category = getYandexCategory(article.category?.slug || '');

      xml += '  <item>\n';
      xml += `    <title>${title}</title>\n`;
      xml += `    <link>${link}</link>\n`;
      xml += `    <pubDate>${pubDate}</pubDate>\n`;
      xml += `    <description>${description}</description>\n`;
      xml += `    <yandex:full-text>${fullText}</yandex:full-text>\n`;
      xml += `    <category>${category}</category>\n`;
      xml += '  </item>\n';
    }

    xml += '</channel>\n';
    xml += '</rss>';

    writeFileSync('/var/www/stars_nwes_site/public/yandex-news.xml', xml);
    console.log(`RSS для Яндекс.Новостей создан: ${articles.length} статей`);
  } catch (err) {
    console.error('Ошибка:', err);
  }
}

generateYandexNews();