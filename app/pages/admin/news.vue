<template>
  <div class="admin-form">
    <h1>Создать новую статью</h1>
    <ArticleForm @submit="saveArticle" :initial-data="form" />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
import { refreshNuxtData } from '#app'
const config = useRuntimeConfig()
const router = useRouter()

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  image: '',
  yandex_news: '',
  google_news: '',
  category: { id: 1, name: 'Звёзды', slug: 'stars' },
  author: null,
  tags: [],
  isFeatured: false,
  publishToTelegram: true
})

const saveArticle = async (articleData) => {
  try {
    const token = localStorage.getItem('token')
    console.log('Сохраняем статью:', articleData)
    await $fetch(`${config.public.apiBaseUrl}/articles`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: articleData
    })
    refreshNuxtData('articles-all')
    refreshNuxtData('news-feed')
    router.push('/admin/articles')
  } catch (err) {
    console.error('Ошибка сохранения:', err)
    alert('Ошибка при сохранении')
  }
}
</script>