import type { DefaultLocaleConst } from './keys.ts'

export type LocaleKeys = DefaultLocaleConst[number]

export type LocaleType = { [key in LocaleKeys]: key }
