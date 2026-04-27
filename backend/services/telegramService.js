const axios = require('axios');
require('dotenv').config();

class TelegramService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.apiUrl = `https://api.telegram.org/bot${this.token}`;
  }

  isDirectImageUrl(url) {
    if (!url) return false;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    return imageExtensions.test(url.split('?')[0]);
  }

  async publishNews(article, retries = 2) {
    if (!this.token || !this.chatId) {
      console.log('Telegram не настроен: отсутствуют токен или chat_id');
      return false;
    }

    const caption = this.formatMessage(article);
    const imageUrl = article.image;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        let response;
        if (imageUrl) {
          response = await axios.post(`${this.apiUrl}/sendPhoto`, {
            chat_id: this.chatId,
            photo: imageUrl,
            caption: caption,
            parse_mode: 'HTML',
            disable_web_page_preview: false
          }, {
            timeout: 15000
          });
          console.log(`Новость опубликована в Telegram с фото (ID: ${response.data.result.message_id})`);
        } else {
          response = await axios.post(`${this.apiUrl}/sendMessage`, {
            chat_id: this.chatId,
            text: caption,
            parse_mode: 'HTML',
            disable_web_page_preview: false
          }, {
            timeout: 15000
          });
          console.log(`Новость опубликована в Telegram (текст, ID: ${response.data.result.message_id})`);
        }
        return true;
      } catch (error) {
        if (attempt === retries) {
          if (error.code === 'ECONNRESET') {
            console.error('Ошибка сети при публикации в Telegram: соединение разорвано (возможно, блокировка)');
          } else if (error.response) {
            console.error(`Ошибка Telegram API: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          } else {
            console.error(`Ошибка публикации в Telegram (попытка ${attempt}): ${error.message}`);
          }
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        console.log(`Повторная попытка публикации в Telegram (${attempt}/${retries})...`);
      }
    }
  }

  formatMessage(article) {
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const articleUrl = `${siteUrl}/news/${article.slug}`;

    const escapeHtml = (text) => {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    return `<b>${escapeHtml(article.title)}</b>

${escapeHtml(article.excerpt)}

Автор: ${article.author?.name || 'BarracudaStars'}
Читать полностью: ${articleUrl}

#BarracudaStars #${article.category?.slug || 'stars'}`;
  }
}

module.exports = new TelegramService();