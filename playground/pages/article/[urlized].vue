<template>
  <div>
    <span class="current-locale">
      {{ currentLocale }}
    </span>
    <p class="urlized">
      {{ route.params.urlized }}
    </p>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const currentLocale = nuxtApp.$i18n.currentLocale
const route = useRoute()
</script>
