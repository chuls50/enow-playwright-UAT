import { test } from '@playwright/test';

test.describe('Patient Authentication Setup', () => {
  test('setup patient authentication', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const baseUrl = process.env.UAT_URL;
    await page.goto(baseUrl);
    await page.waitForURL(/.*\/login/);

    // Fill email - use UAT_PATIENT_USERNAME
    await page
      .getByPlaceholder('Enter email')
      .fill(process.env.UAT_PATIENT_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill password - use UAT_PATIENT_PASSWORD
    await page
      .getByPlaceholder('Enter your password')
      .fill(process.env.UAT_PATIENT_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for successful login
    await page.waitForURL(/.*\/route-me/);
    await page.waitForLoadState('networkidle');

    // Save authentication state
    await context.storageState({ path: 'playwright/.auth/patient.json' });
    console.log(`✅ Patient authentication state saved. (UAT-CodyTest)`);

    await context.close();
  });
});
