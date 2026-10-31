import { describe, expect, test } from 'vitest'

import { i18n } from '~/i18n/i18n'
import { i18nFactory } from '~/i18n/i18nFactory'

describe('i18n', () =>
{
	test('translates a key for the requested locale', () =>
	{
		expect(i18n('fr', 'Welcome!')).toBe('Bienvenue !')
	})

	test('falls back to the key itself when it is unknown', () =>
	{
		expect(i18n('fr', 'Unknown key' as any)).toBe('Unknown key')
	})

	test('picks the requested locale from an inline dictionary', () =>
	{
		expect(i18n('de', { en: 'Hello', de: 'Hallo' } as any)).toBe('Hallo')
	})

	test('falls back to the default locale in an inline dictionary', () =>
	{
		expect(i18n('es', { en: 'Hello', de: 'Hallo' } as any)).toBe('Hello')
	})

	test('replaces named arguments', () =>
	{
		expect(i18n('en', { en: 'Hi {name}' } as any, { name: 'Ada' })).toBe('Hi Ada')
	})

	test('replaces positional arguments', () =>
	{
		expect(i18n('en', { en: '{0} and {1}' } as any, 'a', 'b')).toBe('a and b')
	})
})

describe('i18nFactory', () =>
{
	test('binds the locale', () =>
	{
		expect(i18nFactory('fr')('Welcome!')).toBe('Bienvenue !')
	})

	test('uses the default locale when undefined', () =>
	{
		expect(i18nFactory(undefined)('Welcome!')).toBe('Welcome!')
	})
})
