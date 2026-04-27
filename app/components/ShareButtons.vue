<template>
  <div class="share-buttons">
    <span class="share-label">Поделиться:</span>
    <a 
      :href="telegramUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="share-btn share-telegram"
      title="Поделиться в Telegram"
    >
      <i class="fab fa-telegram"></i> Telegram
    </a>
    <a 
      :href="vkUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="share-btn share-vk"
      title="Поделиться в VK"
    >
      <i class="fab fa-vk"></i> VK
    </a>
    <a 
      :href="twitterUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="share-btn share-twitter"
      title="Поделиться в X (Twitter)"
    >
      <i class="fab fa-twitter"></i> X
    </a>
    <a 
      :href="whatsappUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="share-btn share-whatsapp"
      title="Поделиться в WhatsApp"
    >
      <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  url: { type: String, required: true }
})

const encodedTitle = encodeURIComponent(props.title)
const encodedUrl = encodeURIComponent(props.url)

const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
const vkUrl = `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`
const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.share-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin: 2rem 0 1rem;
}

.share-label {
  color: $text-secondary;
  font-size: 0.9rem;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  // gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;

  i {
    font-size: 1.1rem;
  }

  &:hover {
    transform: translateY(-2px);
  }
}

.share-telegram {
  background: #26A5E4;
  color: white;
  &:hover { background: #1f8fc9; }
}
.share-vk {
  background: #4680C2;
  color: white;
  &:hover { background: #3b6ea8; }
}
.share-twitter {
  background: #000000;
  color: white;
  &:hover { background: #1a1a1a; }
}
.share-whatsapp {
  background: #25D366;
  color: white;
  &:hover { background: #1ebea5; }
}
</style>