import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { expect, test } from 'vitest'
import LocalesPicker from './LocalesPicker.astro'

test('LocalesPicker with defaults', async () =>
{
	const container = await AstroContainer.create()
	const result = await container.renderToString(LocalesPicker)

	expect(result).toBeTruthy()
	expect(result).not.toContain('active')
})

test('LocalesPicker with FR language', async () =>
{
	const container = await AstroContainer.create()
	const result = await container.renderToString(LocalesPicker, {
		props: {
			lang: 'fr',
		}
	})

	expect(result).toBeTruthy()
	expect(result).toContain('active')
	expect(result).toMatch(/<a href="\/fr"[^>]+class="active"[^>]*>/)
})
