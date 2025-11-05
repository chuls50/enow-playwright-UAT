import { test } from '@playwright/test';

test.describe('Provider+Coordinator Authentication Setup', () => {
  test('setup provider+coordinator authentication', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const baseUrl = process.env.UAT_URL;
    await page.goto(baseUrl);
    await page.waitForURL(/.*\/login/);

    // Fill email - use UAT_PROVIDERCOORDINATOR_USERNAME
    await page
      .getByPlaceholder('Enter email')
      .fill(process.env.UAT_PROVIDERCOORDINATOR_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill password - use UAT_PROVIDERCOORDINATOR_PASSWORD
    await page
      .getByPlaceholder('Enter your password')
      .fill(process.env.UAT_PROVIDERCOORDINATOR_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for successful login
    await page.waitForURL(/.*\/route-me/);
    await page.waitForLoadState('networkidle');

    // Save authentication state
    await context.storageState({
      path: 'playwright/.auth/provider-coordinator.json',
    });
    console.log(
      `✅ Provider+Coordinator authentication state saved. (UAT-CodyTest)`
    );

    await context.close();
  });
});
