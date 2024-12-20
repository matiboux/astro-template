import type { AstroConfig } from 'astro'

export const i18n =
{
	locales: [
		{
			codes: ['en', 'en_US'],
			path: 'en',
		},
		{
			codes: ['fr', 'fr_FR'],
			path: 'fr',
		},
		{
			codes: ['de', 'de_DE'],
			path: 'de',
		},
		{
			codes: ['es', 'es_ES'],
			path: 'es',
		},
	],
	defaultLocale: 'en',
	fallback: {
		fr: 'en',
		de: 'en',
		es: 'en',
	},
	routing: {
		prefixDefaultLocale: false,
		fallbackType: 'rewrite',
	},
} as const satisfies AstroConfig['i18n']
