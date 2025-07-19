import type { DefaultLocaleConst } from './en.ts'

export type LocaleKeys = DefaultLocaleConst[number]

export type LocaleType = { [key in LocaleKeys]: key }
