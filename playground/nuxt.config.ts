import { defineNuxtConfig } from 'nuxt'
import MyModule from '..'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  i18n: {
    availableLocales: ['en', 'pt-BR', 'es'],
    defaultLocale: 'en'
  }
})
