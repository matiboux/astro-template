import { defineConfig, envField } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import { i18n } from '/src/config'

// https://astro.build/config
export default defineConfig({
	integrations: [],
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
	i18n: i18n,
	env: {
		schema: {
			GITHUB_REPOSITORY_URL: envField.string({ context: 'client', access: 'public', optional: true }),
			GITHUB_SHA: envField.string({ context: 'client', access: 'public', optional: true }),
			VERSION_TAG: envField.string({ context: 'client', access: 'public', optional: true }),
		},
		validateSecrets: true,
	},
})
