import type { DefaultLocale } from '~/i18n/types.d.ts'

export const localeKeys = [
	'Welcome!',
	'Page not found',
] as const satisfies DefaultLocale

export type DefaultLocaleConst = typeof localeKeys
