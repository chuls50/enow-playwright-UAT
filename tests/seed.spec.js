import { test, expect } from '@playwright/test';

// Use admin authentication for this test file
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Test group', () => {
  test('Admin seed', async ({ page }) => {
    // generate code here.
    await page.goto('https://xj9.sandbox-encounterservices.com/dashboard');
  });
});
