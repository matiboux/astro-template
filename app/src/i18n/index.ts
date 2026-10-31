import { defaultLocale, locales, i18n } from './i18n'
import { i18nFactory } from './i18nFactory'
import { getLocaleByUrl } from './getLocaleByUrl'
import { getRelativeLocaleUrl } from './getRelativeLocaleUrl'
import { getLocaleUrlList } from './getLocaleUrlList'
import { getUrlWithoutLocale } from './getUrlWithoutLocale'
import type { Locales, I18nKeys } from './types.d.ts'

export {
	i18n,
	defaultLocale,
	locales,
	i18nFactory,
	getLocaleByUrl,
	getLocaleUrlList,
	getRelativeLocaleUrl,
	getUrlWithoutLocale,
}

export type {
	Locales,
	I18nKeys
}
