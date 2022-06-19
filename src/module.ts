import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { name, version } from '../package.json'

export interface ModuleOptions {
  availableLocales: string[]
  defaultLocale: string
  routePrefix: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'i18n'
  },
  defaults: {
    availableLocales: [],
    defaultLocale: '',
    routePrefix: 'locale-'
  },
  setup (options, nuxt) {
    nuxt.hook('pages:extend', (pages) => {
      pages.forEach((r) => {
        let filePath = r.path
        const params = filePath.match(/:([A-z a-z])\w+/g)
        if (params) {
          params.forEach((param) => {
            const transformParam = `[${param.replace(':', '')}]`
            filePath = filePath.replace(param, transformParam)
          })
        }
        if (filePath.charAt(filePath.length - 1) === '/') {
          filePath = filePath + 'index'
        }
        const newRoute = {
          // eslint-disable-next-line no-useless-escape
          path: `/:locale(\[A-Z a-z]{2}\)${r.path}`,
          name: `${options.routePrefix}${r.name.toString()}`,
          file: r.file,
          children: r.children
        }
        pages.push(newRoute)
      })
    })
    const { resolve } = createResolver(import.meta.url)
    addPlugin(resolve('./runtime/plugin'))
    nuxt.options.runtimeConfig.public.i18n = {
      availableLocales: options.availableLocales,
      defaultLocale: options.defaultLocale,
      routePrefix: options.routePrefix
    }
  }
})

declare module '@nuxt/schema' {
  interface ConfigSchema {
    runtimeConfig: {
      public: {
        i18n?: ModuleOptions
      }
    }
  }
}
