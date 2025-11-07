import { test } from '@playwright/test';

test.describe('Device Authentication Setup', () => {
  test('setup device authentication', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const baseUrl = process.env.UAT_URL;
    await page.goto(baseUrl);
    await page.waitForURL(/.*\/login/);

    // goto current URL +/device
    const currentURL = page.url();
    await page.goto(`${currentURL}/device`);

    // wait for getByRole('textbox', { name: '1234' }) to be visible
    await page.getByRole('textbox', { name: '1234' }).waitFor({ state: 'visible' });

    // Fill device id - use UAT_DEVICE_ID
    await page.getByRole('textbox', { name: '1234' }).fill(process.env.UAT_DEVICE_ID);
    await page.getByRole('button', { name: 'Verify Device ID' }).click();

    // Wait for successful device authentication
    await page.waitForURL(/.*\/route-me/);
    await page.waitForLoadState('networkidle');

    // Save authentication state
    await context.storageState({ path: 'playwright/.auth/device.json' });
    console.log(`✅ Device authentication state saved. (UAT-CodyTest)`);
  });
});
