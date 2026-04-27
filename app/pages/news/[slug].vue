<template>
  <div v-if="pending" class="loading">Загрузка...</div>
  <div v-else-if="article" class="article-page">
    <header class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="article-category">{{ article.category?.name || 'Новости' }}</span>
        <span class="article-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
        <span class="article-views">👁 {{ formatViews(article.views || 0) }}</span>
      </div>
    </header>

    <NuxtImg
      v-if="article.image"
      :src="article.image"
      :alt="article.title"
      class="article-image"
      width="1200"
      height="630"
      loading="lazy"
    />

    <div v-if="article.author" class="author-block">
      <div class="author-avatar">
        <img
          :src="`/authors/author-${article.author.id}.jpg`"
          :alt="article.author.name"
          
        />
      </div>
      <div class="author-info">
        <h3>Автор: {{ article.author.name }}</h3>
        <p class="author-bio">{{ article.author.bio || 'Нет дополнительной информации' }}</p>
      </div>
      <div class="telegram-link">
        <a :href="config.public.telegramChannelUrl" target="_blank" rel="noopener noreferrer" class="tg-button-icon" aria-label="Telegram-канал">
          <font-awesome-icon :icon="['fab', 'telegram']" />
        </a>
      </div>
    </div>

    <div class="article-content" v-html="article.content"></div>

    <ShareButtons
      :title="article.title"
      :url="shareUrl"
    />

    <div v-if="article.tags?.length" class="article-tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
    </div>

    <div v-if="relatedArticles.length" class="related-articles">
      <h2 class="related-title">Читайте также</h2>
      <div class="related-grid">
        <ArticleCard
          v-for="article in relatedArticles"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>
  </div>
  <div v-else class="not-found">Статья не найдена</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Article } from '~/components/ArticleCard.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const config = useRuntimeConfig()
const route = useRoute()

const slug = route.params.slug as string
if (!slug) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

const { data: article, pending, error } = await useFetch<Article>(
  () => `${config.public.apiBaseUrl}/articles/${slug}`
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
}

const formatDate = (dateString: string) => {
  const date = dayjs(dateString)
  dayjs.locale('ru')
  if (date.isSame(dayjs(), 'day')) return `Сегодня, ${date.format('HH:mm')}`
  if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return `Вчера, ${date.format('HH:mm')}`
  return date.format('D MMMM YYYY')
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
  return views.toString()
}

const shareUrl = computed(() => `${config.public.siteUrl}/news/${article.value?.slug}`)

const { data: relatedResponse } = await useFetch(
  () => `${config.public.apiBaseUrl}/articles?category=${article.value?.category?.slug || ''}&limit=4`
)

const relatedArticles = computed(() => {
  if (!relatedResponse.value) return []
  const articles = Array.isArray(relatedResponse.value)
    ? relatedResponse.value
    : (relatedResponse.value?.data || [])
  return articles.filter((a: Article) => a.slug !== slug).slice(0, 3)
})

useSeoMeta({
  title: () => article.value?.title || 'Статья',
  description: () => article.value?.excerpt || '',
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.excerpt,
  ogImage: () => article.value?.image,
  ogUrl: () => shareUrl.value
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: shareUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.value?.title,
        description: article.value?.excerpt,
        image: article.value?.image,
        datePublished: article.value?.publishedAt || article.value?.createdAt,
        author: {
          '@type': 'Person',
          name: article.value?.author?.name || 'BarracudaStars'
        },
        publisher: {
          '@type': 'Organization',
          name: 'BarracudaStars',
          logo: {
            '@type': 'ImageObject',
            url: `${config.public.siteUrl}/logo.png`
          }
        }
      })
    }
  ]
})
</script>
<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e0e0e0;
}

.article-header {
  margin-bottom: 2rem;
}

.article-title {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.article-category {
  background: #332932;
  color: #faf9f6;
  padding: 0.2rem 0.8rem;
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.article-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}

.article-content {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #1a1a1a;

  h2, h3 {
    font-family: 'Playfair Display', 'Times New Roman', serif;
    color: #1a1a1a;
    margin: 1.5rem 0 0.75rem;
  }

  p {
    margin: 1rem 0;
  }

  img {
    max-width: 100%;
  }
}

.article-tags {
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  .tag {
    background: #f0f0f0;
    padding: 0.2rem 0.8rem;
    font-family: 'Cormorant Garamond', 'Georgia', serif;
    font-size: 0.75rem;
    color: #666;
  }
}

.author-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-left: 3px solid #332932;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}

.author-avatar {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #e0e0e0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
}

.author-info {
  flex: 1;
  
  h3 {
    font-family: 'Playfair Display', 'Times New Roman', serif;
    font-size: 1rem;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  .author-bio {
    font-family: 'Cormorant Garamond', 'Georgia', serif;
    font-size: 0.8rem;
    color: #666;
    
    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }
}

.telegram-link {
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin-top: 0.25rem;
  }
}

.tg-button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #26A5E4;
  border-radius: 50%;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #1f8fc9;
  }

  svg {
    font-size: 1.2rem;
  }
}

.related-articles {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.related-title {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-size: 1.3rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.loading, .not-found {
  text-align: center;
  padding: 3rem;
  color: #999;
}
</style>