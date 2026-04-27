const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  published_to_yandex: { type: Boolean, default: false },
  published_to_google: { type: Boolean, default: false },
  image: { type: String, default: 'https://images.unsplash.com/photo-1511512578047-dfb367046420' },
  category: {
    id: Number,
    name: String,
    slug: String
  },
  author: {
    id: Number,
    name: String,
    avatar: String,
    bio: String
  },
  publishedAt: Date,
  views: { type: Number, default: 0 },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  publishToTelegram: { type: Boolean, default: true }
}, {
  timestamps: true
});


articleSchema.pre('validate', async function() {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});
module.exports = mongoose.model('Article', articleSchema);