import { describe, expect, test } from 'vitest'
import {
	getRelativeLocaleUrl,
	getRelativeLocaleUrlList,
	getPathByLocale,
	getLocaleByPath,
} from 'astro:i18n'

import { getLocaleUrlList } from '~/i18n'

// Test cases for the Astro i18n routing helpers used by the app,
// to catch behaviour changes when updating Astro.
// (URLs are expected with a trailing slash, as returned by Astro's default config.)

describe('getRelativeLocaleUrl', () =>
{
	test.each([
		[['fr'], '/fr/'],
		[['fr', ''], '/fr/'],
		[['fr', 'getting-started'], '/fr/getting-started/'],
		[['de', 'getting-started', { prependWith: 'blog' }], '/blog/de/getting-started/'],
		[['de', 'getting-started', { prependWith: 'blog', normalizeLocale: false }], '/blog/de/getting-started/'],
	] as const)('%j', (args, expected) =>
	{
		expect((getRelativeLocaleUrl as any)(...args)).toBe(expected)
	})
})

describe('getRelativeLocaleUrlList', () =>
{
	test('lists the URL of every locale', () =>
	{
		expect(getRelativeLocaleUrlList('about')).toEqual([
			'/about/',
			'/fr/about/',
			'/de/about/',
			'/es/about/',
		])
	})

	test('supports prependWith', () =>
	{
		expect(getRelativeLocaleUrlList('about', { prependWith: 'blog' })).toEqual([
			'/blog/about/',
			'/blog/fr/about/',
			'/blog/de/about/',
			'/blog/es/about/',
		])
	})
})

describe('getPathByLocale', () =>
{
	test.each([
		['fr', 'fr'],
		['fr_FR', 'fr'],
	])('%s -> %s', (locale, expected) =>
	{
		expect(getPathByLocale(locale)).toBe(expected)
	})
})

describe('getLocaleByPath', () =>
{
	test('returns the first locale code of a path', () =>
	{
		expect(getLocaleByPath('fr')).toBe('fr')
	})
})

describe('getLocaleUrlList', () =>
{
	test('lists locales for a path without locale', () =>
	{
		const list = getLocaleUrlList('/about')
		expect(list.map(({ locale }) => locale)).toEqual(['en', 'fr', 'de', 'es'])
	})

	test('ignores the current locale prefix', () =>
	{
		const list = getLocaleUrlList('/fr/about')
		expect(list.map(({ url }) => new URL(url, 'http://x').pathname)).toEqual([
			'/about/',
			'/fr/about/',
			'/de/about/',
			'/es/about/',
		])
	})

	test('can exclude a locale', () =>
	{
		const list = getLocaleUrlList('/about', 'fr')
		expect(list.map(({ locale }) => locale)).toEqual(['en', 'de', 'es'])
	})
})
