<template>
  <div>
    <span class="current-locale">
      {{ currentLocale }}
    </span>
    <ul>
      <li
        v-for="loc in locales"
        :key="loc"
      >
        <a href="#" :class="loc" @click.prevent="changeLocale(loc)">{{ loc }}</a>
      </li>
    </ul>
    <p class="locale-path-string">
      {{ getLocalePath('/article/article-string') }}
    </p>
    <NuxtLink
      :to="getLocalePath('/article/article-string')"
      class="to-article-string"
    >
      go to article string
    </NuxtLink>
    <p class="locale-path-object">
      {{ JSON.stringify(getLocalePath({
        name: 'article-urlized',
        params: {
          urlized: 'article-object'
        }
      })) }}
    </p>
    <NuxtLink
      :to="getLocalePath({
        name: 'article-urlized',
        params: {
          urlized: 'article-object'
        }
      })"
      class="to-article-object"
    >
      go to article object
    </NuxtLink>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const route = useRoute()
const config = useRuntimeConfig()
const locales = config.public.i18n.availableLocales
const changeLocale = nuxtApp.$i18n.changeLocale
const currentLocale = nuxtApp.$i18n.currentLocale
const getLocalePath = nuxtApp.$i18n.getLocalePath
const goToArticle = () => route.push(getLocalePath({
  name: 'article-urlized',
  params: {
    urlized: 'article-1'
  }
}))
</script>
