require('dotenv').config({ path: __dirname + '/.env' });
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'загружена' : 'НЕ ЗАГРУЖЕНА');
const mongoose = require('mongoose');
const Article = require('./models/Article');
const articlesData = require('../app/mock/articles.json');

const seedDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Подключено к MongoDB');

  
    await Article.deleteMany({});
    console.log('Старые статьи удалены');

   
    await Article.insertMany(articlesData);
    console.log('Добавлено тестовых статей:', articlesData.length);

  
    await mongoose.connection.close();
    console.log('Отключились от MongoDB');
  } catch (err) {
    console.error('Ошибка при заполнении базы:', err);
    process.exit(1);
  }
};


if (require.main === module) {
  seedDB();
}

module.exports = seedDB;