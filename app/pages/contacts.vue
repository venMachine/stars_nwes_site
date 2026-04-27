<template>
  <div class="contacts-page">
    <h1 class="page-title">Контакты</h1>

    <section class="contacts-section">
      <h2>Напишите нам</h2>
      <div class="contacts-info">
        <div class="contact-item">
          <span class="contact-icon">📧</span>
          <div>
            <strong>E-mail</strong>
            <p><a href="mailto:u272511@yandex.ru">u272511@yandex.ru</a></p>
          </div>
        </div>
      </div>
    </section>

    <section class="contacts-section">
      <h2>Социальные сети</h2>
      <div class="social-links">
        <a href="https://t.me/news_barracuda" target="_blank" rel="noopener" class="social-link">Telegram</a>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Контакты - BarracudaStars',
  description: 'Свяжитесь с нами по любым вопросам: сотрудничество, реклама, поддержка. E-mail и социальные сети.'
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.contacts-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: $bg-card;
  border: 1px solid rgba($primary, 0.15);
}

.page-title {
  font-family: $font-family-heading;
  color: $primary;
  margin-bottom: 2rem;
  font-size: 2rem;
  letter-spacing: 2px;
}

.contacts-section {
  margin-bottom: 2rem;

  h2 {
    font-family: $font-family-heading;
    color: $primary;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
}

.contacts-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;

  .contact-icon {
    font-size: 1.5rem;
  }

  strong {
    display: block;
    margin-bottom: 0.25rem;
    color: $text-primary;
  }

  p {
    margin: 0;
  }

  a {
    color: $primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .social-link {
    background: rgba($primary, 0.1);
    padding: 0.5rem 1.2rem;
    border: 1px solid rgba($primary, 0.2);
    font-family: $font-family-heading;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:hover {
      background: $primary;
      color: white;
    }
  }
}
</style>