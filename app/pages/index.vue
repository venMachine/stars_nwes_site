<template>
  <div class="home">
    
    <div class="categories">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="categories__btn"
        :class="{ 'categories__btn--active': activeCategory === cat.slug }"
        @click="filterByCategory(cat.slug)"
      >
        {{ cat.name }}
      </button>
    </div>
<!--     <div class="two-columns">
      <div v-if="featuredArticle" class="featured-column">
        <ArticleCard :article="featuredArticle" featured />
      </div>
      <aside class="sidebar">
        <NewsFeed />
      </aside>
    </div> -->
    <aside class="sidebar">
        <NewsFeed />
    </aside>
    

    <div v-if="articlesToShow.length" class="news-grid">
      <template v-for="article in articlesToShow" :key="article.id">
        <div v-if="article.isFeatured" class="grid-full-width">
          <ArticleCard :article="article" featured />
        </div>
        <ArticleCard v-else :article="article" />
      </template>
    </div>
    <div v-else-if="!loading" class="no-news">
      <p>{{ $t('common.no_news') }}</p>
    </div>
    <div v-if="loading" class="loading">{{ $t('common.loading') }}</div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" :disabled="loading" class="load-more__btn">
        {{ loading ? $t('common.loading') : $t('common.show_more') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Article } from '~/components/ArticleCard.vue'
import NewsFeed from '~/components/NewsFeed.vue'

const config = useRuntimeConfig()

const categories = [
  { id: 0, name: $t('categories.all'), slug: 'all' },
  { id: 1, name: $t('categories.stars'), slug: 'stars' },
  { id: 2, name: $t('categories.gossip'), slug: 'gossip' },
  { id: 3, name: $t('categories.scandals'), slug: 'scandals' },
  { id: 4, name: $t('categories.fashion'), slug: 'fashion' },
  { id: 5, name: $t('categories.couples'), slug: 'couples' },
  { id: 6, name: $t('categories.babies'), slug: 'babies' }
]
const activeCategory = ref('all')
const currentPage = ref(1)
const limit = 12
const allArticles = ref<Article[]>([])
const totalPages = ref(1)
const loading = ref(false)

const { data: allData } = await useFetch<{ data: Article[] }>(
  () => `${config.public.apiBaseUrl}/articles?limit=1000&category=all`
)

const allArticlesForFeatured = computed(() => {
  if (!allData.value?.data) return []
  return [...allData.value.data].sort((a, b) =>
    new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
  )
})

const featuredArticle = computed(() => allArticlesForFeatured.value.find(a => a.isFeatured === true))

const loadArticles = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/articles`, {
      params: {
        page: currentPage.value,
        limit: limit,
        category: activeCategory.value
      }
    })
    const newArticles = res.data || []

    if (currentPage.value === 1) {
      allArticles.value = newArticles
    } else {
      allArticles.value = [...allArticles.value, ...newArticles]
    }
    totalPages.value = res.totalPages || 1
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const articlesToShow = computed(() => allArticles.value)
const hasMore = computed(() => currentPage.value < totalPages.value)

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    loadArticles()
  }
}

const filterByCategory = (slug: string) => {
  activeCategory.value = slug
  currentPage.value = 1
  loadArticles()
}

await loadArticles()

useSeoMeta({
  title: 'BarracudaStars - Главная страница',
  description: 'Самые свежие новости о голливудских звездах: слухи, скандалы, мода, отношения и эксклюзивы',
  ogTitle: 'BarracudaStars - Звёздные новости',
  ogDescription: 'Горячие новости из мира голливудских знаменитостей',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})
</script>
<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.home {
  padding-bottom: 3rem;
}

.categories {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.categories__btn {
  background: $bg-card;
  border: 1px solid rgba($primary, 0.2);
  color: $text-primary;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-family: $font-family-heading;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $primary;
  }

  &--active {
    background: $primary;
    color: white;
    border-color: $primary;
  }
}

.sidebar {
  min-width: 280px;
  margin-bottom: 2rem;
}

.news-grid {
  padding: 0 5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
@media (max-width: 992px) {
  .news-grid {
    padding: 0 2rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .news-grid {
    padding: 0;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
.grid-full-width {
  grid-column: 1 / -1;
}

.no-news {
  text-align: center;
  padding: 3rem;
  color: $text-muted;
  background: rgba($primary, 0.05);
  border: 1px dashed rgba($primary, 0.2);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: $text-secondary;
}

.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more__btn {
  background: transparent;
  border: 2px solid $primary;
  color: $primary;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $primary;
    color: white;
  }
}

@media (max-width: 992px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .categories {
    display: flex;
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }
  
  .categories__btn {
    white-space: nowrap;
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
    flex-shrink: 0;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .grid-full-width {
    grid-column: 1;
  }
  
  .load-more__btn {
    padding: 0.5rem 1.5rem;
    font-size: 0.85rem;
  }
}
.categories {
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.sidebar {
  margin-bottom: 1rem;
}

.news-grid {
  gap: 1rem;
}

@media (max-width: 768px) {
  .categories {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .news-grid {
    gap: 0.75rem;
  }
}
.categories__btn {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 600;
}
</style>