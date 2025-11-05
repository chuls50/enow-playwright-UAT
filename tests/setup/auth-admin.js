import { test } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Admin Authentication Setup', () => {
  test('setup admin authentication', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const baseUrl = process.env.UAT_URL;
    await page.goto(baseUrl);
    await page.waitForURL(/.*\/login/);

    // Fill email - use UAT_ADMIN_USERNAME
    await page
      .getByPlaceholder('Enter email')
      .fill(process.env.UAT_ADMIN_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill password - use UAT_ADMIN_PASSWORD
    await page
      .getByPlaceholder('Enter your password')
      .fill(process.env.UAT_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for successful login
    await page.waitForURL(/.*\/route-me/);
    await page.waitForLoadState('networkidle');

    // Save authentication state
    await context.storageState({ path: 'playwright/.auth/admin.json' });
    console.log(`✅ Admin authentication state saved.`);

    await context.close();
  });
});
