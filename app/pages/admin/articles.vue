<template>
  <div class="admin-articles">
    <h1>Управление статьями</h1>
    <NuxtLink to="/admin/news" class="btn-create">+ Новая статья</NuxtLink>

    <div v-if="loading">Загрузка...</div>
    <div v-else-if="articlesList.length" class="articles-list">
      <div v-for="article in articlesList" :key="article._id" class="article-row">
        <div class="article-info">
          <h3>
            {{ article.title }}
            <span v-if="article.published_to_yandex" class="badge-yandex" title="Отправлено в Яндекс.Новости">Я</span>
            <span v-if="article.published_to_google" class="badge-google" title="Отправлено в Google News">G</span>
          </h3>
          <p>{{ article.excerpt }}</p>
          <small>ID: {{ article._id }} / Slug: {{ article.slug }}</small>
        </div>
        <div class="article-actions">
          <NuxtLink :to="`/admin/${article.slug}`" class="btn-edit">✏️</NuxtLink>
          <button @click="deleteArticle(article.slug)" class="btn-delete">🗑️</button>
          <button 
            @click="publishToYandex(article.slug)" 
            class="btn-yandex" 
            title="Отправить в Яндекс.Новости"
            :disabled="publishing === article.slug"
          >
            {{ publishing === article.slug ? 'Отправка...' : ' Яндекс' }}
          </button>
          <button 
            @click="publishToGoogle(article.slug)" 
            class="btn-google" 
            title="Отправить в Google News"
            :disabled="publishing === article.slug"
          >
            {{ publishing === article.slug ? 'Отправка...' : ' Google' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>Статей пока нет.</div>

    <div v-if="hasMore" class="pagination">
      <button @click="loadMore" :disabled="loading" class="load-more__btn">
        {{ loading ? 'Загрузка...' : 'Показать ещё' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const publishing = ref(null)
const currentPage = ref(1)
const limit = 20
const allArticles = ref([])
const totalPages = ref(1)
const loading = ref(false)

const loadArticles = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/articles`, {
      params: {
        page: currentPage.value,
        limit: limit
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

const articlesList = computed(() => allArticles.value)
const hasMore = computed(() => currentPage.value < totalPages.value)

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    loadArticles()
  }
}

const deleteArticle = async (slug) => {
  if (!confirm('Удалить статью?')) return
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBaseUrl}/articles/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    
    currentPage.value = 1
    await loadArticles()
  } catch (err) {
    alert('Ошибка при удалении')
  }
}

const publishToYandex = async (slug) => {
  publishing.value = slug
  try {
    const token = localStorage.getItem('token')  
    await $fetch(`${config.public.apiBaseUrl}/articles/publish-yandex`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { slug }
    })
    alert(`Статья "${slug}" отправлена в Яндекс.Новости`)
   
    await loadArticles()
  } catch (err) {
    alert('Ошибка при отправке в Яндекс.Новости')
    console.error(err)
  } finally {
    publishing.value = null
  }
}

const publishToGoogle = async (slug) => {
  publishing.value = slug
  try {
    const token = localStorage.getItem('token')   
    await $fetch(`${config.public.apiBaseUrl}/articles/publish-google`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { slug }
    })
    alert(`Статья "${slug}" отправлена в Google News`)
    await loadArticles()
  } catch (err) {
    alert('Ошибка при отправке в Google News')
    console.error(err)
  } finally {
    publishing.value = null
  }
}


await loadArticles()
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.admin-articles {
  background: #101A23;
  min-height: 100vh;
  padding: 2rem;
  border-radius: $border-radius-lg;
}

.article-row {
  background: rgba(255, 255, 255, 0.05);
  border-radius: $border-radius;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.article-info {
  flex: 1;
  min-width: 200px;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-create {
  display: inline-block;
  background: $primary;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: $border-radius;
  text-decoration: none;
  margin-bottom: 1rem;
}

.btn-edit, .btn-delete, .btn-yandex, .btn-google {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-edit { color: $primary; }
.btn-delete { color: #ff4444; }
.btn-yandex { color: #fc3f1d; }
.btn-google { color: #4285f4; }

.badge-yandex, .badge-google {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
  vertical-align: middle;
}

.badge-yandex {
  background: #fc3f1d;
  color: white;
}

.badge-google {
  background: #4285f4;
  color: white;
}

.pagination {
  text-align: center;
  margin-top: 2rem;
}

.load-more__btn {
  background: transparent;
  border: 2px solid $primary;
  color: $primary;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: $primary;
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.admin-articles {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 2rem;
  border-radius: $border-radius-lg;
}

.article-row {
  background: white;
  border-radius: $border-radius;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>