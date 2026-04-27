import { writeFileSync } from 'fs';

async function generateNewsSitemap() {
  try {
    const res = await fetch('https://barracudastars.ru/api/articles?published_to_google=true&limit=1000');
    const data = await res.json();
    const articles = data.data || [];

    if (!articles.length) {
      console.log('⚠ Нет статей для Google News');
      return;
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

    for (const article of articles) {
      const pubDate = new Date(article.publishedAt || article.createdAt).toISOString();
      const title = escapeXml(article.title);
      const link = `https://barracudastars.ru/news/${article.slug}`;

      xml += '  <url>\n';
      xml += `    <loc>${link}</loc>\n`;
      xml += '    <news:news>\n';
      xml += '      <news:publication>\n';
      xml += '        <news:name>BarracudaStars</news:name>\n';
      xml += '        <news:language>ru</news:language>\n';
      xml += '      </news:publication>\n';
      xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
      xml += `      <news:title>${title}</news:title>\n`;
      xml += '    </news:news>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    writeFileSync('/var/www/stars_nwes_site/public/news-sitemap.xml', xml);
    console.log(`News Sitemap для Google создан: ${articles.length} статей`);
  } catch (err) {
    console.error('Ошибка:', err);
  }
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
generateNewsSitemap();