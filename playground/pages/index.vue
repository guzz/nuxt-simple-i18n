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
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const config = useRuntimeConfig()
const locales = config.public.i18n.availableLocales
const changeLocale = nuxtApp.$i18n.changeLocale
const currentLocale = nuxtApp.$i18n.currentLocale
</script>
