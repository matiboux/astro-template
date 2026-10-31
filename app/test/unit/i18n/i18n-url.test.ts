import { describe, expect, test } from 'vitest'

import { getLocaleByUrl, getUrlWithoutLocale } from '~/i18n'

describe('getLocaleByUrl', () =>
{
	test.each([
		['/fr/about', 'fr'],
		['/de/', 'de'],
		['/es', 'es'],
		['/en/about', 'en'],
		['https://example.com/fr/about', 'fr'],
	])('detects the locale of %s', (url, expected) =>
	{
		expect(getLocaleByUrl(url)).toBe(expected)
	})

	test('accepts a URL object', () =>
	{
		expect(getLocaleByUrl(new URL('https://example.com/fr/about'))).toBe('fr')
	})

	test('falls back to the default locale', () =>
	{
		expect(getLocaleByUrl('/about')).toBe('en')
		expect(getLocaleByUrl('/')).toBe('en')
	})

	test('returns undefined without fallback when no locale is found', () =>
	{
		expect(getLocaleByUrl('/about', false)).toBeUndefined()
	})
})

describe('getUrlWithoutLocale', () =>
{
	test.each([
		['/fr/about', '/about'],
		['/fr', '/'],
		['/fr/', '/'],
		['/about', '/about'],
		['/', '/'],
	])('strips the locale from %s', (url, expected) =>
	{
		expect(getUrlWithoutLocale(url)).toBe(expected)
	})

	test('accepts a URL object', () =>
	{
		expect(getUrlWithoutLocale(new URL('https://example.com/de/about'))).toBe('/about')
	})
})
