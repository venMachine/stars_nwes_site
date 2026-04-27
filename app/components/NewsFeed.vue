<template>
  <div class="news-feed">
    <div class="news-feed__container">
      <div class="news-feed__track" :style="{ animationDuration: `120s` }">
        <div v-for="(item, index) in duplicatedNews" :key="index" class="news-feed__item">
          <NuxtLink :to="`/news/${item.slug}`" class="news-feed__link">
            <span class="news-feed__title">{{ item.title }}</span>
            <span class="news-feed__date">{{ formatTime(item.publishedAt || item.createdAt) }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed, ref, onMounted } from 'vue';

const config = useRuntimeConfig();



const newsItems = ref([]);

const fetchNews = async () => {
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/articles?limit=20`);
    newsItems.value = response.data || [];
  } catch (err) {
    console.error( err);
  }
};

const duplicatedNews = computed(() => {
  if (newsItems.value.length === 0) return [];
  return [...newsItems.value, ...newsItems.value];
});

const formatTime = (dateString) => {
  const date = dayjs(dateString);
  return date.format('HH:mm');
};

onMounted(() => {
  fetchNews();
  setInterval(() => {
    fetchNews();
  }, 60000);
});
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.news-feed {
  position: relative;
  width: 100%;
  background: $bg-dark;
  border-top: 2px solid $primary;
  border-bottom: 2px solid $primary;
  overflow: hidden;
  margin-bottom: 2rem;
}

.news-feed__container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.news-feed__track {
  display: inline-flex;
  animation: ticker linear infinite;
  will-change: transform;
}

.news-feed__item {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-right: 1px solid rgba($primary, 0.3);
  white-space: nowrap;
}

.news-feed__link {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: $text-primary;
  transition: color 0.2s;

  &:hover {
    color: $primary;
  }
}

.news-feed__title {
  font-family: $font-family-base;
  font-size: 0.9rem;
  font-weight: 600;
}

.news-feed__date {
  font-family: $font-family-mono;
  font-size: 0.7rem;
  color: $text-muted;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .news-feed__item {
    padding: 0.5rem 1rem;
  }

  .news-feed__title {
    font-size: 0.75rem;
  }
}
</style>