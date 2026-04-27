<template>
  <div class="advertising-page">
    <h1 class="page-title">Реклама на BarracudaStars</h1>

    <section class="info-section">
      <h2>Почему стоит размещать рекламу у нас</h2>
      <p>Аудитория BarracudaStars — это тысячи активных пользователей, интересующихся жизнью голливудских звёзд, модой, скандалами и шоу-бизнесом. Мы предлагаем эффективные форматы для охвата вашей целевой аудитории.</p>
    </section>

    <section class="info-section">
      <h2>Форматы рекламы</h2>
      <div class="formats-grid">
        <div class="format-card">
          <h3> Медийная реклама</h3>
          <p>Баннеры в шапке, сайдбаре и между статьями. Доступны размеры 728×90, 300×250, 160×600.</p>
        </div>
        <div class="format-card">
          <h3> Нативные статьи</h3>
          <p>Экспертные материалы, написанные нашей редакцией, которые органично вписываются в контент сайта.</p>
        </div>
        <div class="format-card">
          <h3> Спонсорство рубрик</h3>
          <p>Размещение вашего бренда в популярных рубриках: «Скандалы», «Мода», «Слухи» и других.</p>
        </div>
        <div class="format-card">
          <h3> E-mail рассылка</h3>
          <p>Размещение информации в нашей еженедельной рассылке по базе подписчиков.</p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <h2>Контакты для сотрудничества</h2>
      <p>По всем вопросам обращайтесь на <a href="mailto:u272511@yandex.ru">u272511@yandex.ru</a> или через форму на странице <NuxtLink to="/contacts">контактов</NuxtLink>.</p>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Реклама на BarracudaStars',
  description: 'Разместите рекламу на BarracudaStars и привлеките тысячи активных пользователей, интересующихся жизнью голливудских звёзд.'
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.advertising-page {
  max-width: 1000px;
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

.info-section {
  margin-bottom: 2rem;

  h2 {
    font-family: $font-family-heading;
    color: $primary;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  p {
    line-height: 1.7;
    color: $text-primary;
    font-size: 1rem;
  }

  a {
    color: $primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.formats-grid {
  @include grid(2, 1.5rem);
  margin-top: 1rem;

  @media (max-width: 768px) {
    @include grid(1, 1rem);
  }
}

.format-card {
  background: rgba($primary, 0.05);
  border: 1px solid rgba($primary, 0.15);
  padding: 1.25rem;

  h3 {
    font-family: $font-family-heading;
    color: $primary;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  p {
    font-size: 0.9rem;
    margin: 0;
  }
}
</style>