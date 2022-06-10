import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const availableLocales = config.public.i18n.availableLocales
  const defaultLocale = config.public.i18n.defaultLocale
  const locale = useState<string>('locale', () => defaultLocale)

  watch(locale, (val) => {
    const routeName = route.name.toString()
    if (routeName.includes('locale')) {
      const routeLocale = route.params.locale
      if (val !== routeLocale && val !== defaultLocale) {
        router.push({
          name: routeName,
          params: {
            ...route.params,
            locale: val
          },
          query: route.query
        })
      } else if (val === defaultLocale) {
        const newParams = { ...route.params }
        delete newParams.locale
        router.push({
          name: routeName.replace('locale-', ''),
          params: newParams,
          query: route.query
        })
      }
    } else if (val !== defaultLocale) {
      router.push({
        name: 'locale-' + routeName,
        params: {
          ...route.params,
          locale: val
        },
        query: route.query
      })
    }
  })

  watch(
    route,
    (to) => {
      if (to.params.locale && to.params.locale !== locale.value) {
        changeLocale(to.params.locale)
      } else if (!to.params.locale && locale.value !== defaultLocale) {
        changeLocale(defaultLocale)
      }
    },
    { deep: true }
  )

  const changeLocale = (newLocale) => {
    locale.value = newLocale
  }

  const currentLocale = computed(() => locale.value)
  return {
    provide: {
      i18n: {
        currentLocale,
        changeLocale,
        availableLocales
      }
    }
  }
})
