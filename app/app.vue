<template>
  <div class="app">
  <AppLoader :loading="pageLoading" />
    <header class="header">
      <div class="container">
        <div class="header__inner">

          <div class="logo">
            <NuxtLink to="/" class="logo__link">
              <NuxtImg
                src="/logo-B.png"
                alt="BarracudaStars"
                class="logo__image"
                width="42"
                height="42"
                format="webp"
                loading="eager"
              />
              <span class="logo__text">{{ $t('site_name') }}</span>
            </NuxtLink>
          </div>

          <div class="header__actions">
            <div class="language-switcher">
              <button
                v-for="locale in availableLocales"
                :key="locale.code"
                @click="switchLocale(locale.code)"
                :class="{ active: locale.code === currentLocale }"
              >
                {{ locale.name }}
              </button>
            </div>
            <a
              :href="config.public.telegramChannelUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="telegram-link"
              aria-label="Telegram канал"
            >
              <font-awesome-icon :icon="['fab', 'telegram']" /> 
            </a>
            <div class="search">
              <NuxtLink to="/search" class="search__btn">
                <span class="search__icon">SEARCH</span>
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <NuxtPage />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer__inner">
          <div class="footer__info">
            <h3 class="footer__title">{{ $t('site_name') }}</h3>
            <p class="footer__text">{{ $t('site_description') }}</p>
          </div>
          <div class="footer__links">
            <NuxtLink to="/about" class="footer__link">{{ $t('footer.about') }}</NuxtLink>
            <NuxtLink to="/advertising" class="footer__link">{{ $t('footer.advertising') }}</NuxtLink>
            <NuxtLink to="/contacts" class="footer__link">{{ $t('footer.contacts') }}</NuxtLink>
          </div>
          <div class="footer__copyright">
            <p>&copy; 2014 {{ $t('site_name') }}. {{ $t('footer.copyright') }}</p>
            <p>© Илья Говорухин</p>
            <p class="footer__disclaimer">{{ $t('footer.disclaimer') || 'Все торговые марки принадлежат их правообладателям.' }}</p>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()
const config = useRuntimeConfig()

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value.filter(i => i.code !== locale.value))
const pageLoading = ref(true)
const router = useRouter()
router.beforeEach(() => {
  pageLoading.value = true
})

router.afterEach(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 300)
})

onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 500)
})
const switchLocale = (code: string) => {
  setLocale(code)
}


useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-EERDHR72NW',
      async: true,
      defer: true
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-EERDHR72NW');
      `,
      type: 'text/javascript'
    },
    {
      innerHTML: `
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
        ym(108852211, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true
        });
      `,
      type: 'text/javascript'
    }
  ]
})


</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {

  border-bottom: 1px solid #e0e0e0;
  padding: 1.5rem 0;
  top: 0;
  z-index: 1000;
}

.header__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo {
  text-align: center;
  order: 1;
}

.logo__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.logo__image {
  width: 60px;
  height: 60px;
  margin-bottom: 0.5rem;
}

.logo__text {
  font-family: 'Times New Roman', serif;
  font-size: 6.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #1a1a1a;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
}

.header__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  order: 2;
}

.nav {
  background: #332932;
  padding: 0.75rem 0;
  width: 100%;
  order: 3;
}

.nav__list {
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav__link {
  color: #faf9f6;
  text-decoration: none;
  font-family: 'Georgia', serif;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.5rem 0;

  &:hover {
    color: #ddd;
  }

  &--active {
    border-bottom: 2px solid #faf9f6;
  }
}

.language-switcher {
  display: flex;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    font-family: 'Georgia', serif;
    font-size: 0.8rem;
    cursor: pointer;
    color: #1a1a1a;

    &:hover {
      color: #332932;
    }

    &.active {
      font-weight: bold;
      border-bottom: 1px solid #1a1a1a;
    }
  }
}

.telegram-link {
  color: #1a1a1a;
  font-size: 1.2rem;

  &:hover {
    color: #332932;
  }
}

.search__btn {
  color: #1a1a1a;
  font-size: 1rem;
  text-decoration: none;

  &:hover {
    color: #332932;
  }
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: #faf9f6;
  border-top: 1px solid #e0e0e0;
  padding: 2rem 0;
  margin-top: auto;
}

.footer__inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.footer__title {
  font-family: 'Times New Roman', serif;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.footer__text {
  font-size: 0.8rem;
  color: #666;
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer__link {
  font-size: 0.8rem;
  color: #666;
  text-decoration: none;

  &:hover {
    color: #332932;
  }
}

.footer__copyright {
  font-size: 0.7rem;
  color: #999;
}

@media (max-width: 768px) {
  .nav__list {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .language-switcher button {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .logo__text {
    font-size: 1.3rem;
  }
  
  .language-switcher button {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
  }
  
  .search__btn {
    font-size: 0.7rem;
  }
}
.logo__text {
  font-family: 'Times New Roman', serif;
  font-size: 6.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #1a1a1a;
  text-transform: uppercase;
  white-space: nowrap;
  
  @media (max-width: 1090px) {
    font-size: 4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
}




.header {



  background-image: url('https://res.cloudinary.com/dztn4jtdc/image/upload/v1777467092/a7840db8d2f19c74063a715249538552_ezrmwt.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background: #faf9f6;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
  top: 0;
  z-index: 1000;
}

.header__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.logo__image {
 
  margin-bottom: 0.25rem;
}

.nav {
  background: #332932;
  padding: 0.5rem 0;
  width: 100%;
}

.nav__list {
  gap: 1.5rem;
}
.logo__text {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 900;
}

.nav__link {
  font-family: 'Playfair Display', 'Times New Roman', serif;
  font-weight: 600;
}

.language-switcher button {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
}
</style>