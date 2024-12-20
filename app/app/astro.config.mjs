import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

import { i18n } from '/src/config'

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	i18n: i18n,
	integrations: [
		tailwind(),
	],
	trailingSlash: 'never',
})
