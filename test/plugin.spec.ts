import { fileURLToPath } from 'node:url'
import { describe, test, expect } from 'vitest'
import { setup, $fetch, useTestContext, createPage } from '@nuxt/test-utils'
import * as Playwright from '@playwright/test'

await setup({
  rootDir: fileURLToPath(new URL('../playground/', import.meta.url)),
  browser: true
})

describe('i18n module', () => {
  test('available locales', async () => {
    const html = await $fetch('/')
    const context = useTestContext()
    const moduleOpts = context.nuxt?.options.runtimeConfig.public.i18n
    moduleOpts.availableLocales.forEach((loc) => {
      expect(html).toContain(`<li><a href="#" class="${loc}">${loc}</a></li>`)
    })
  })
  test('default locale', async () => {
    const page = await createPage('/')
    const context = useTestContext()
    const moduleOpts = context.nuxt?.options.runtimeConfig.public.i18n
    const defaultLocale = moduleOpts.defaultLocale
    const currentLocale = page.locator('span.current-locale')
    await Playwright.expect(currentLocale).toHaveText(defaultLocale)
  })
  test('change locale with method', async () => {
    const page = await createPage('/')
    const pageUrl = page.url()
    const context = useTestContext()
    const moduleOpts = context.nuxt?.options.runtimeConfig.public.i18n
    const defaultLocale = moduleOpts.defaultLocale
    const otherLocale = moduleOpts.availableLocales.filter(l => l !== defaultLocale)[0]
    const currentLocale = page.locator('span.current-locale')
    await page.click(`a.${otherLocale}`)
    await Playwright.expect(currentLocale).toHaveText(otherLocale)
    Playwright.expect(page.url()).toBe(`${pageUrl}${otherLocale}/`)
  })
  test('change locale with url', async () => {
    const page = await createPage('/pt')
    const currentLocale = page.locator('span.current-locale')
    await Playwright.expect(currentLocale).toHaveText('pt')
  })
  test('navigate with NuxtLink with string location', async () => {
    const page = await createPage('/pt')
    await page.click('.to-article-string')
    const currentLocale = page.locator('span.current-locale')
    await Playwright.expect(currentLocale).toHaveText('pt')
  })
  test('navigate with NuxtLink with string object', async () => {
    const page = await createPage('/pt')
    await page.click('.to-article-object')
    const currentLocale = page.locator('span.current-locale')
    await Playwright.expect(currentLocale).toHaveText('pt')
  })
})
