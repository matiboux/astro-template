import { localeKeys } from './keys'
import type { LocaleType } from './types.d.ts'

// Default locale uses keys as both keys and values
const locale = localeKeys
	.reduce<LocaleType>((acc, key) =>
		{
			(acc as any)[key] = key
			return acc
		},
		{} as LocaleType,
	)

export default locale
