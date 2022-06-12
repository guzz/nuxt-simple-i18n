import { defineNuxtPlugin } from '#app'
import type { RouteLocationRaw, LocationQueryRaw, RouteParamsRaw } from 'vue-router'

interface LocaleRouteRaw {
  name?: string
  path?: string
  params?: RouteParamsRaw
  query?: LocationQueryRaw
}

type LocaleRoute = string | LocaleRouteRaw

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const routePrefix = config.public.i18n.routePrefix
  const availableLocales = config.public.i18n.availableLocales
  const defaultLocale = config.public.i18n.defaultLocale
  const loadLocale = route?.params?.locale?.toString() ?? defaultLocale
  const locale = useState<string>('locale', () => loadLocale)
  watch(locale, (val) => {
    if (!route || !router) {
      return
    }
    const routeName = route?.name?.toString() ?? 'index'
    if (routeName.includes(routePrefix)) {
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
          name: routeName.replace(routePrefix, ''),
          params: newParams,
          query: route.query
        })
      }
    } else if (val !== defaultLocale) {
      router.push({
        name: routePrefix + routeName,
        params: {
          ...route.params,
          locale: val
        },
        query: route.query
      })
    }
  })
  if (route && router) {
    watch(
      route,
      (to) => {
        if (to.params.locale && to.params.locale !== locale.value) {
          changeLocale(to.params.locale.toString())
        } else if (!to.params.locale && locale.value !== defaultLocale) {
          changeLocale(defaultLocale)
        }
      },
      { deep: true }
    )
  }

  const changeLocale = (newLocale: string) => {
    if (availableLocales.includes(newLocale)) {
      locale.value = newLocale
    } else {
      throw new Error('Location not supported')
    }
  }

  const getLocalePath = (rawRoute: LocaleRoute): RouteLocationRaw => {
    const isDefaultLocale = locale.value === defaultLocale
    const getPath = (path: string): string => {
      const pathSplit = path.split('/')
      pathSplit.shift()
      const firstPath = pathSplit.shift()
      if (availableLocales.includes(firstPath)) {
        if (isDefaultLocale) {
          return ['', ...pathSplit].join('/')
        } else if (firstPath !== locale.value) {
          return ['', locale.value, ...pathSplit].join('/')
        } else {
          return path
        }
      } else {
        const prefix = isDefaultLocale ? '' : `/${locale.value}`
        return [prefix, firstPath, ...pathSplit].join('/')
      }
    }
    const getName = (name: string): string => {
      const hasLocale = name.includes(routePrefix)
      if (isDefaultLocale && hasLocale) {
        return name.replace(routePrefix, '')
      } else if (!isDefaultLocale && !hasLocale) {
        return `${routePrefix}${name}`
      } else {
        return name
      }
    }
    if (typeof rawRoute === 'string') {
      return getPath(rawRoute)
    } else if (!(rawRoute instanceof String)) {
      const name = rawRoute?.name ? getName(rawRoute.name) : undefined
      const path = rawRoute?.path ? getPath(rawRoute.path) : undefined
      const query = rawRoute?.query
      const params = {
        ...(rawRoute.params ?? {})
      }
      if (!isDefaultLocale) {
        params.locale = locale.value
      }
      return {
        name,
        path,
        query,
        params
      }
    }
  }

  const currentLocale = computed(() => locale.value)
  return {
    provide: {
      i18n: {
        currentLocale,
        /**
         * Change current locale
         * @param {String} newLocale Locale to change
         */
        changeLocale,
        availableLocales,
        /**
         * Get the path based on current locale
         * @param {LocaleRoute} rawRoute RouteLocationRaw
         * @returns {LocaleRoute} Converted route
         */
        getLocalePath
      }
    }
  }
})
