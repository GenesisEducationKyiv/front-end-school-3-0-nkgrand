import { test, expect } from '@playwright/test';

test.describe('TracksTable Component', () => {
  test('should render tracks correctly', async ({ page }) => {
    await page.route('**/api/tracks**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '1',
              title: 'Test Track',
              artist: 'Test Artist',
              album: 'Test Album',
              coverImage: 'https://example.com/image.jpg',
              genres: ['pop'],
              audioFile: '',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              slug: 'test-track',
              fileUrl: '',
            },
          ],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        }),
      });
    });

    await page.goto('/tracks');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Test Track')).toBeVisible();
    await expect(page.locator('text=Test Artist')).toBeVisible();
  });
});
