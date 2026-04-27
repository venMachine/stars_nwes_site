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
  category: { id: 1, name: 'Киберспорт', slug: 'esports' },
  author: null,
  tags: [],
  isFeatured: false
})

const saveArticle = async (articleData) => {
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBaseUrl}/articles`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: articleData
    })
    refreshNuxtData('articles-all')
    refreshNuxtData('news-feed')
    router.push('/admin/articles')
  } catch (err) {
    alert('Ошибка при сохранении')
  }
}
</script>