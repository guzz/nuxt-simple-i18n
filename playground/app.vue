<template>
  <div>
    {{ currentLocale }}
    <ul>
      <li
        v-for="loc in locales"
        :key="loc"
      >
        <a href="#" @click.prevent="changeLocale(loc)">{{ loc }}</a>
      </li>
    </ul>
    <p>{{ getLocalePath('/teste/outro') }}</p>
    <p>
      {{ JSON.stringify(getLocalePath({
        name: 'artigo-urlized',
        params: {
          urlized: 'artigo-1'
        }
      })) }}
    </p>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const config = useRuntimeConfig()
const router = useRouter()
const locales = config.public.i18n.availableLocales
const changeLocale = nuxtApp.$i18n.changeLocale
const currentLocale = nuxtApp.$i18n.currentLocale
const getLocalePath = nuxtApp.$i18n.getLocalePath
</script>
