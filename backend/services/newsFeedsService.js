const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = '/var/www/stars_nwes_site/public';

function generateYandexRss(articles) {
  const newsItems = articles
    .filter(a => a.yandex_news && a.publishedAt && new Date(a.publishedAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
    .slice(0, 20)
    .map(article => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>https://barracudastars.ru/news/${article.slug}</link>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
      <yandex:full-text>${escapeXml(article.yandex_news)}</yandex:full-text>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:yandex="http://news.yandex.ru">
<channel>
  <title>BarracudaStars</title>
  <link>https://barracudastars.ru</link>
  <description>Новости голливудских звёзд, скандалы, мода, слухи и шоу-бизнес</description>
  ${newsItems}
</channel>
</rss>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'yandex-news.xml'), rss);
}

function generateGoogleSitemap(articles) {
  const urls = articles
    .filter(a => a.google_news && a.publishedAt && new Date(a.publishedAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
    .slice(0, 1000)
    .map(article => `
  <url>
    <loc>https://barracudastars.ru/news/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>BarracudaStars</news:name>
        <news:language>ru</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>
`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'news-sitemap.xml'), sitemap);
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/[<>&]/g, function(m) {
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    if (m === '&') return '&amp;';
    return m;
  });
}

module.exports = { generateYandexRss, generateGoogleSitemap };