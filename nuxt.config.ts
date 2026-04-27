export default defineNuxtConfig({
  compatibilityDate: '2026-04-09',

  ssr: true,

  srcDir: 'app/',

  modules: [
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
  ],

  plugins: [
    '~/plugins/fontawesome.js'
  ],

  css: [
    '~/assets/scss/main.scss'
  ],

  app: {
    head: {
      title: 'BarracudaStars - Звёздные новости',
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Самые свежие новости о голливудских звёздах, скандалах, моде и шоу-бизнесе'
        },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', iso: 'ru-RU', file: 'ru.json' },
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  } as any,

  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'avif', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      telegramChannelUrl: 'https://t.me/news_barracuda'
    }
  },

  nitro: {
    devStorage: {
      cache: {
        driver: 'memory'
      }
    }
  },

  experimental: {
    payloadExtraction: false
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/vue-fontawesome',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        'dayjs',
        'dayjs/locale/ru'
      ]
    }
  },

  devtools: { enabled: true },

  typescript: {
    strict: false,
    typeCheck: false
  },

  routeRules: {
    '/': { swr: 60 },
    '/news/**': { swr: 300 },
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000' } }
  },

  future: {
    compatibilityVersion: 4
  }
})