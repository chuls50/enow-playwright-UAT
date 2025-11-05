import { test } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Provider Authentication Setup', () => {
  test('setup provider authentication', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const baseUrl = process.env.PROD_URL;
    await page.goto(baseUrl);
    await page.waitForURL(/.*\/login/);

    // Fill email - use PROV_PROD_USERNAME
    await page.getByPlaceholder('Enter email').fill(process.env.PROV_PROD_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill password - use PROV_PROD_PASSWORD
    await page.getByPlaceholder('Enter your password').fill(process.env.PROV_PROD_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for successful login
    await page.waitForURL(/.*\/route-me/);
    await page.waitForLoadState('networkidle');

    // Save authentication state
    await context.storageState({ path: 'playwright/.auth/provider.json' });
    console.log(`✅ Provider authentication state saved.`);

    await context.close();
  });
});
