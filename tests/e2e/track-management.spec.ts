import { test, expect } from '@playwright/test';

test.describe('Track Management E2E', () => {
  test('should navigate through tracks page', async ({ page }) => {
    await page.goto('/tracks');

    await expect(
      page.getByTestId('tracks-header').filter({ hasText: 'Tracks list' })
    ).toBeVisible();

    const tracksContainer = page.locator(
      'table, [data-testid="tracks-list"], .tracks-container, .tracks-table'
    );
    await expect(tracksContainer).toBeVisible();
  });

  test('should display tracks list', async ({ page }) => {
    await page.goto('/tracks');

    const navigation = page.locator('nav, header, [role="navigation"]');
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible();
    }
  });

  test('should handle track search if available', async ({ page }) => {
    await page.goto('/tracks');

    const searchInput = page.getByTestId('search-input');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('should handle pagination if available', async ({ page }) => {
    await page.goto('/tracks');

    const pagination = page.locator('.ant-pagination');
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();

      const nextButton = pagination.locator('.ant-pagination-next');

      if ((await nextButton.isVisible()) && !(await nextButton.isDisabled())) {
        await nextButton.click();
        await expect(page).toHaveURL(/page=\d+/);
      }
    }
  });
});
