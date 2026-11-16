import { expect, test } from '@playwright/test';

test('logs a new inquiry and finds it in the contacts list', async ({ page }) => {
  await page.goto('/contacts/new');
  await page.getByRole('button', { name: 'Log inquiry' }).click();
  await expect(page.getByRole('group', { name: 'Fix 5 fields before saving' })).toBeVisible();

  await page.getByLabel('Full name').fill('Hamza Qureshi');
  await page.getByRole('textbox', { name: 'Phone' }).fill('+92 321 5550123');
  await page.getByLabel('Matter type').selectOption('Property');
  await page.getByLabel('How they found us').selectOption('Walk-in');
  await page.getByLabel('Summary').fill('Tenant has refused to leave after the lease ended.');
  await page.getByRole('button', { name: 'Log inquiry' }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'Hamza Qureshi' })).toBeVisible();
  await expect(page.getByText(/Inquiry logged as INT-/)).toBeVisible();

  await page.goto('/contacts');
  await page.getByRole('searchbox', { name: 'Search contacts' }).fill('Hamza');
  await expect(page).toHaveURL('/contacts?q=Hamza');
  const contactLink = page.getByRole('link', { name: 'Hamza Qureshi' });
  await expect(contactLink).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bilal Ahmed' })).toBeHidden();

  await page.reload();
  await expect(contactLink).toBeVisible();
});
