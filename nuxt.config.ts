// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  build: {
    transpile: ['@vuepic/vue-datepicker']
},
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: true
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap',
          rel: 'stylesheet'
        }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  components: false,
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      googleApiKey: process.env.GOOGLE_API_KEY
    }
  },
  tailwindcss: { viewer: false },
  typescript: { typeCheck: true },
  imports: { dirs: ['composables/resources'] }
})
