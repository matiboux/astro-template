import type { I18nKeys } from '~/i18n/type.d.ts'

export interface Site
{
	title?: string
	description?: string | I18nKeys
	author?: string
	keywords?: string[]
	themeColor?: string
	favicon?: string
	lang?: string
}

export const site: Site = {
	title: 'Astro Template',
	description: {
		'en': 'Template project for an Astro web application',
		'fr': 'Modèle de projet pour une application web Astro',
	},
	author: 'Matiboux',
	themeColor: '#ffffff',
}
