import { expect, test } from '@playwright/test';

test('closes a lead from its card menu with a reason', async ({ page }) => {
  await page.goto('/pipeline');
  await page.getByRole('button', { name: 'Move Bilal Ahmed' }).click();
  await page.getByRole('menuitem', { name: /^Closed/ }).click();

  const dialog = page.getByRole('dialog', { name: "Close Bilal's inquiry" });
  await dialog.getByRole('button', { name: 'Close inquiry' }).click();
  await expect(dialog.getByText('Choose a reason to close this inquiry.')).toBeVisible();

  await dialog.getByRole('radio', { name: /^Retained/ }).check();
  await dialog.getByRole('button', { name: 'Close inquiry' }).click();

  const closedColumn = page.getByRole('region', { name: 'Closed', exact: true });
  const card = closedColumn.getByRole('listitem').filter({ hasText: 'Bilal Ahmed' });
  await expect(card).toContainText('Retained');
  await expect(page.getByText('Moved Bilal to Closed')).toBeVisible();

  await page.reload();
  await expect(card).toContainText('Retained');
});
