import { test, expect } from '@playwright/test'

test('has title', async ({ page }) =>
{
	await page.goto('/')
	await expect(page).toHaveTitle('Astro Template')
});

test('renders the default locale', async ({ page }) =>
{
	await page.goto('/')
	await expect(page.getByText('Welcome!')).toBeVisible()
});

test('renders a translated page', async ({ page }) =>
{
	await page.goto('/fr/')
	await expect(page.getByText('Bienvenue !')).toBeVisible()
});

test('switches locale from the picker', async ({ page }) =>
{
	await page.goto('/')
	await page.locator('.lang-list a[href*="/fr"]').click()
	await expect(page).toHaveURL(/\/fr\/?$/)
	await expect(page.getByText('Bienvenue !')).toBeVisible()
});

test('shows the 404 page for unknown routes', async ({ page }) =>
{
	await page.goto('/does-not-exist')
	await expect(page.getByText('Page not found')).toBeVisible()
});
