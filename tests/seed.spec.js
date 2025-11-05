import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('Patient seed', async ({ page }) => {
    // generate code here.
    await page.goto('https://xj9.sandbox-encounterservices.com/');
  });
});
