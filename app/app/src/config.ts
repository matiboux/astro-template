import type { AstroUserConfig } from 'astro/config'

export const i18n =
{
	defaultLocale: 'en',
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
			codes: ['es', 'es-ES'],
			path: 'es',
		},
		{
			codes: ['de', 'de-DE'],
			path: 'de',
		},
	],
	routing: {
		prefixDefaultLocale: false,
	},
} as const satisfies AstroUserConfig['i18n']
