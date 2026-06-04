#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/stars_nwes_site

export API_BASE_URL=https://barracudastars.ru/api
export PATH=/usr/bin:/bin:/usr/local/bin:$PATH

npm run build
pm2 restart stars-frontend

# IndexNow
KEY="ae2a33ccbfdcd0f23f920e035e32e390"
SITE_URL="https://barracudastars.ru"
if command -v jq &> /dev/null && [ -f /var/www/stars_nwes_site/public/sitemap.xml ]; then
  URLS=$(grep -oP '(?<=<loc>).*?(?=</loc>)' /var/www/stars_nwes_site/public/sitemap.xml | head -10000)
  if [ -n "$URLS" ]; then
    JSON_URLS=$(echo "$URLS" | jq -R . | jq -s .)
    curl -X POST "https://api.indexnow.org/IndexNow" \
      -H "Content-Type: application/json" \
      -d "{\"host\":\"$SITE_URL\",\"key\":\"$KEY\",\"keyLocation\":\"$SITE_URL/$KEY.txt\",\"urlList\":$JSON_URLS}" \
      -s -o /dev/null -w "\n%{http_code}\n"
    echo "✅ IndexNow уведомление отправлено"
  fi
fi

echo "✅ Пересборка выполнена $(date)" >> /var/log/deploy.log
