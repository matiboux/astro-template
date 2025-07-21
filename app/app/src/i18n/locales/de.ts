import type { Diff } from '~/i18n/types.d.ts'

import type { LocaleKeys } from './types.d.ts'

const locale = {
	'Welcome!': 'Willkommen!',
} as const

export default locale satisfies
	// Static type check for missing keys
	Readonly<Record<Diff<LocaleKeys, keyof typeof locale>, string>> &
	// Static type check for extra keys
	Readonly<Record<Diff<keyof typeof locale, LocaleKeys>, never>>
