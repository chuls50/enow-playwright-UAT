import { test, expect } from '@playwright/test';

// Device ID Access - Total tests 11

const TEST_DATA = {
  // Device ID test data
  VALID_DEVICE_ID: '911272679',
  INVALID_DEVICE_ID: '12345678',
  INVALID_DEVICE_ID_SHORT: '9',
  INVALID_SPECIAL_CHARS: '!@#$%^&*',
  DEVICE_SANDBOX_URL: 'https://xj9.sandbox-encounterservices.com/login/device',
  PRODUCT_NAME: 'UAT Automation',
};

test.describe('Device_ID @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_DATA.DEVICE_SANDBOX_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Verify Device ID Access Screen Layout and Elements @[115016] @device @ui', async ({ page }) => {
    // verify device id
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
    await expect(page.getByText(`Welcome to ${TEST_DATA.PRODUCT_NAME}! Please enter`)).toBeVisible();
    await expect(page.getByText('Device ID*')).toBeVisible();

    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.VALID_DEVICE_ID);
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeEnabled();
  });

  test('Verify Successful and Failed Device ID Verification @[115017] @device @functional', async ({ page }) => {
    // Failed verification
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.INVALID_DEVICE_ID);
    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(
      page.getByText(
        'The Device ID you specified is not found for this Institution. Please confirm that you have entered the created value.'
      )
    ).toBeVisible();

    // Successful verification
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.VALID_DEVICE_ID);
    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  test('Verify Language Dropdown Opens @[115018] @device @ui', async ({ page }) => {
    // verify language dropdown
    await page.getByText('English').click();
    await expect(page.getByText('Spanish')).toBeVisible();
    await expect(page.getByText('English').nth(1)).toBeVisible();
    await expect(page.getByText('Portuguese')).toBeVisible();
  });

  // bug here #121851
  test.fixme('Verify Language Change Updates UI @[115019] @device @functional', async ({ page }) => {
    // verify language dropdown
    await page.getByText('English').click();
    await page.getByText('Spanish').click();
    await expect(page.getByRole('heading', { name: 'Acceso por id. de dispositivo' })).toBeVisible();

    //reload the page and verify default language is still spanish
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Acceso por id. de dispositivo' })).toBeVisible();

    // reset state
    await page.getByText('Español').click();
    await page.getByText('Inglés').click();
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
  });

  test('[Negative] Verify Error When Submitting Blank Device ID @[115020] @device @functional', async ({ page }) => {
    // submit blank
    await page.getByRole('button', { name: 'Verify Device ID' }).click();

    // verify error "Device ID is required"
    await expect(page.getByText('Device ID is required')).toBeVisible();
  });

  test('[Negative] Verify Device ID With Invalid Format is Rejected @[115021] @device @functional', async ({ page }) => {
    // submit invalid format
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.INVALID_SPECIAL_CHARS);
    await page.getByRole('button', { name: 'Verify Device ID' }).click();

    // verify "The Device ID you specified is not found for this Institution. Please confirm that you have entered the created value.
    await expect(
      page.getByText(
        'The Device ID you specified is not found for this Institution. Please confirm that you have entered the created value.'
      )
    ).toBeVisible();
  });

  test('Verify Device ID Link Opens Correct URL With /device @[115022] @device @ui', async ({ page }) => {
    // verify URL end with /login/device
    await expect(page).toHaveURL(/.*\/login\/device/);
  });

  // bug here #121851
  test('Verify Language Setting Persists Across Reload @[115023] @device @functional', async ({ page }) => {
    // verify language dropdown
    await page.getByText('English').click();
    await page.getByText('Spanish').click();
    await expect(page.getByRole('heading', { name: 'Acceso por id. de dispositivo' })).toBeVisible();

    //reload the page and verify default language is still spanish
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Acceso por id. de dispositivo' })).toBeVisible();

    // reset state
    await page.getByText('Español').click();
    await page.getByText('Inglés').click();
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
  });

  test('Verify Login Access via Device ID Link from Admin Panel @[115405] @device @functional', async ({ page }) => {
    // verify device id
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
    await expect(page.getByText(`Welcome to ${TEST_DATA.PRODUCT_NAME}! Please enter`)).toBeVisible();
    await expect(page.getByText('Device ID*')).toBeVisible();

    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.VALID_DEVICE_ID);
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeEnabled();

    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  test('[Negative] Verify Error Message When Device ID is Not Found for Insititution @[115406] @device @functional', async ({ page }) => {
    // verify device id
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
    await expect(page.getByText(`Welcome to ${TEST_DATA.PRODUCT_NAME}! Please enter`)).toBeVisible();
    await expect(page.getByText('Device ID*')).toBeVisible();

    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.INVALID_DEVICE_ID_SHORT);
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeEnabled();

    await page.getByRole('button', { name: 'Verify Device ID' }).click();

    //verify error
    await expect(
      page.getByText(
        'The Device ID you specified is not found for this Institution. Please confirm that you have entered the created value.'
      )
    ).toBeVisible();
  });

  test('Verify Redirection to Device ID Dashboard Upon Successful Login @[115407] @device @functional', async ({ page }) => {
    // verify device id
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
    await expect(page.getByText(`Welcome to ${TEST_DATA.PRODUCT_NAME}! Please enter`)).toBeVisible();
    await expect(page.getByText('Device ID*')).toBeVisible();

    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill(TEST_DATA.VALID_DEVICE_ID);
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Device ID' })).toBeEnabled();

    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();

    //wait for url to go from /route-me to /dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
