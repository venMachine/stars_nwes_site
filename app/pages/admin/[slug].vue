<template>
  <div class="admin-form">
    <h1>Редактировать статью</h1>
    <div v-if="pending">Загрузка...</div>
    <ArticleForm v-else-if="article" :initial-data="article" @submit="updateArticle" />
    <div v-else>Статья не найдена</div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const { data: article, pending } = await useFetch(
  `${config.public.apiBaseUrl}/articles/${route.params.slug}`
)

const updateArticle = async (articleData) => {
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBaseUrl}/articles/${route.params.slug}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: articleData
    })
    refreshNuxtData('articles-all')
    refreshNuxtData('news-feed')
    router.push('/admin/articles')
  } catch (err) {
    alert('Ошибка при обновлении')
  }
}
</script>
