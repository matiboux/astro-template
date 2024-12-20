import type { AstroUserConfig } from 'astro/config'

export const i18n =
{
	locales: [
		{
			codes: ['en', 'en-US'],
			path: 'en',
		},
		{
			codes: ['fr', 'fr-FR'],
			path: 'fr',
		},
		{
			codes: ['de', 'de-DE'],
			path: 'de',
		},
		{
			codes: ['es', 'es-ES'],
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
} as const satisfies AstroUserConfig['i18n']
