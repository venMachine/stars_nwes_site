<template>
  <article class="article-card" :class="{ 'article-card--featured': featured }">
    <NuxtLink :to="`/news/${article.slug}`" class="article-card__link">
      <div class="article-card__image">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          :width="featured ? 1200 : 600"
          :height="featured ? 820 : 450"
          loading="lazy"
          fit="cover"
          format="webp"
          class="article-card__img"
        />
        <span class="article-card__category" :style="{ background: categoryColor }">
          {{ article.category?.name || 'Новости' }}
        </span>
        <span v-if="article.isHot && !featured" class="article-card__hot">
          HOT
        </span>
        <span v-if="featured" class="article-card__badge">
          ЭКСКЛЮЗИВ
        </span>
        
    
        <div v-if="featured" class="article-card__overlay--top">
          <div class="article-card__overlay-content">
            <h3 class="article-card__title--featured">
              {{ article.title }}
            </h3>
          </div>
        </div>
        
      
        <div v-if="featured" class="article-card__overlay--bottom">
          <div class="article-card__overlay-content">
            <p class="article-card__excerpt--featured">
              {{ article.excerpt }}
            </p>
            <div class="article-card__meta--featured">
              <span>{{ article.author?.name || 'StarsNews' }}</span>
              <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
              <span>{{ formatViews(article.views || 0) }} просмотров</span>
            </div>
            <div v-if="article.tags?.length" class="article-card__tags--featured">
              <span v-for="tag in article.tags.slice(0, 3)" :key="tag">#{{ tag }}</span>
            </div>
          </div>
        </div>
        
 
        <div v-if="!featured" class="article-card__overlay">
          <div class="article-card__overlay-content">
            <h3 class="article-card__title">
              {{ article.title }}
            </h3>
            <p class="article-card__excerpt">
              {{ article.excerpt }}
            </p>
            <div class="article-card__meta">
              <span>{{ article.author?.name || 'StarsNews' }}</span>
              <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
              <span>{{ formatViews(article.views || 0) }} просмотров</span>
            </div>
            <div v-if="article.tags?.length" class="article-card__tags">
              <span v-for="tag in article.tags.slice(0, 3)" :key="tag">#{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

export interface Article {
  id: number | string
  slug: string
  title: string
  excerpt: string
  image: string
  category?: { id: number; name: string; slug: string }
  author?: { id: number; name: string; avatar?: string; bio?: String }
  publishedAt?: string
  createdAt: string
  views?: number
  tags?: string[]
  isFeatured?: boolean
  isHot?: boolean
}

const props = defineProps<{ article: Article; featured?: boolean }>()

const categoryColors: Record<string, string> = {
  stars: '#2D6A4F',
  gossip: '#E67E22',
  scandals: '#C0392B',
  fashion: '#8E44AD',
  couples: '#2980B9',
  babies: '#D35400'
}

const categoryColor = computed(() => {
  const slug = props.article.category?.slug || 'stars'
  return categoryColors[slug] || '#2D6A4F'
})

const formatDate = (dateString: string) => {
  const date = dayjs(dateString)
  const now = dayjs()
  dayjs.locale('ru')
  if (date.isSame(now, 'day')) return `Сегодня, ${date.format('HH:mm')}`
  if (date.isSame(now.subtract(1, 'day'), 'day')) return `Вчера, ${date.format('HH:mm')}`
  if (now.diff(date, 'day') < 7) return date.format('dddd, HH:mm')
  return date.format('D MMMM YYYY')
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
  return views.toString()
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');

.article-card {
  background: #FFFFFF;
  overflow: hidden;
  border: 1px solid #EAECF0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all $transition-base;

  &:hover {
    transform: translateY(-4px);
    border-color: #D0D5DD;
    box-shadow: 0 12px 20px -12px rgba(0, 0, 0, 0.15);
    .article-card__img { transform: scale(1.05); }
  }

  &--featured {
    width: 100%;
    .article-card__badge { display: block; }
  }
}

.article-card__link {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-decoration: none;
  color: inherit;
}

.article-card__image {
  position: relative;
  overflow: hidden;
  background: $secondary;
  height: 450px;
}

.article-card--featured .article-card__image {
  background-image: url('https://res.cloudinary.com/dztn4jtdc/image/upload/v1776790745/feature-bg_wo7j2q.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 700px;
}

.article-card__img {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.article-card:not(.article-card--featured) .article-card__img {
  object-fit: cover;
}

.article-card--featured .article-card__img {
  object-fit: contain;
  background: transparent;
}

.article-card__category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: white;
  padding: 0.3rem 1rem;
  font-family: $font-family-mono;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 10;
  border-radius: 20px;
}

.article-card__hot {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: $danger;
  color: white;
  padding: 0.3rem 0.8rem;
  font-family: $font-family-heading;
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 1px;
  z-index: 2;
  border-radius: 20px;
  animation: blink 1s infinite;
}

.article-card__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: $gradient-exclusive;
  color: $text-dark;
  padding: 0.3rem 1rem;
  font-family: $font-family-heading;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
  z-index: 10;
  border-radius: 20px;
  animation: pulse 1.5s infinite;
}

.article-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
  padding: 1rem;
  z-index: 2;
}

.article-card__overlay--top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  padding: 1rem;
  z-index: 2;
}

.article-card__overlay--bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%);
  padding: 1rem;
  z-index: 2;
}

.article-card__overlay-content {
  color: white;
  width: 100%;
}

.article-card__title {
  font-family: 'Comic Neue', cursive;
  font-weight: 400;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__title--featured {
  margin-top: 3rem;
  text-align: center;
  font-family: 'Comic Neue', cursive;
  font-weight: 400;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 4rem;
  }
}

.article-card__excerpt {
  font-family: 'Comic Neue', cursive;
  font-weight: 400;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.3rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__excerpt--featured {
  font-family: 'Comic Neue', cursive;
  font-weight: 400;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
}

.article-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.3rem;
  padding-top: 0.3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 0.7rem;
  flex-wrap: wrap;
  gap: 0.3rem;
  font-family: 'Comic Neue', cursive;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
}

.article-card__meta--featured {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 0.65rem;
  flex-wrap: wrap;
  gap: 0.3rem;
  font-family: 'Comic Neue', cursive;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
}

.article-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;
  
  span {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.15rem 0.5rem;
    font-family: $font-family-mono;
    font-size: 0.7rem;
    border-radius: 12px;
  }
}

.article-card__tags--featured {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
  
  span {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.15rem 0.5rem;
    font-family: $font-family-mono;
    font-size: 0.7rem;
    border-radius: 12px;
  }
}

@media (max-width: 768px) {
  .article-card__image {
    height: 350px;
  }
  
  .article-card--featured .article-card__image {
    height: 500px;
  }
  
  .article-card__title {
    font-size: 0.8rem;
  }
  
  .article-card__title--featured {
    font-size: 1.2rem;
  }
  
  .article-card__excerpt {
    font-size: 0.6rem;
  }
  
  .article-card__excerpt--featured {
    font-size: 0.7rem;
  }
  
  .article-card__meta {
    font-size: 0.45rem;
  }
  
  .article-card__overlay,
  .article-card__overlay--top,
  .article-card__overlay--bottom {
    padding: 0.75rem;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.article-card__title {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__title--featured {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 800;
  font-size: 1.5rem;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 4rem;
  }
}

.article-card__excerpt {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 400;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.article-card__excerpt--featured {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 400;
  font-size:1rem;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
}

.article-card__meta {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 0.7rem;
}

.article-card__category {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 600;
  letter-spacing: 2px;
}
.article-card__title {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 700;
}

.article-card__excerpt {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
}

.article-card__category {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 600;
}
</style>
