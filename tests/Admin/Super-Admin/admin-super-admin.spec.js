import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
import dotenv from 'dotenv';
dotenv.config();

// Super Admin - Total tests 5

// Skip tests for now as they are one-way door actions

test.describe('Admin Super Admin @regression', () => {
  let usersTablePage;

  test.beforeEach(async ({ page }) => {
    usersTablePage = new UsersTablePage(page);

    // Navigate to base URL and wait for login page
    await page.goto(process.env.SANDBOX_URL);
    await page.waitForURL(/.*\/login/);

    // Fill email
    await page.getByPlaceholder('Enter email').fill(process.env.SUPER_ADMIN_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Fill password
    await page.getByPlaceholder('Enter your password').fill(process.env.SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(/.*\/route-me/);

    // Wait for spinner to disappear
    await usersTablePage.waitForSpinnerToDisappear();
  });

  test.skip('Verify Super Admin Dashboard and Institution Dropdown Access @[114439] @super-admin @functional', async ({ page }) => {
    await expect(page.getByText('Select institution')).toBeVisible();
    await expect(page.locator('.sc-fsONnU').first()).toBeVisible();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();
    await expect(page.getByTestId('custom-dropdown')).toBeVisible();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByTestId('tabs')).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Institution' })).toBeVisible();
  });

  // one way door
  test.skip('Verify Visibility and Functionality of "New Institution" Button for Super Admin @[114440]', async ({ page }) => {
    // await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    // await expect(page.getByTestId('tabs')).toBeVisible();
    // await expect(page.locator('h1')).toBeVisible();
    // await expect(page.getByRole('button', { name: 'New Institution' })).toBeVisible();
    // // click New Institution button to create a 'New Institution'
    // await page.getByRole('button', { name: 'New Institution' }).click();
    // await expect(page.locator('div').filter({ hasText: /^Select institutionNew InstitutionAG$/ }).getByTestId('custom-select-item-wrapper')).toBeVisible();
    // await expect(page.getByRole('textbox', { name: 'Example Name' })).toHaveValue('New Institution');
  });

  test.skip('Verify Default Values on Profile Tab After Creating a New Institution @[114441] @super-admin @functional', async ({
    page,
  }) => {
    // goto institution settings
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByTestId('tabs')).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Institution' })).toBeVisible();

    // click on previously created 'New Institution'
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').first().click();

    // VERIFY FIELDS ARE EMPTY OR HAVE DEFAULT VALUES
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByRole('textbox', { name: 'Example Name' })).toHaveValue('New Institution');
    await expect(page.getByRole('button', { name: 'Copy link' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link' }).nth(1)).toBeVisible();
    await expect(page.locator('input[name="phone.number"]')).toBeEmpty();
    await expect(page.locator('input[name="address1"]')).toBeEmpty();
    await expect(page.locator('input[name="address2"]')).toBeEmpty();
    await expect(page.locator('input[name="zip"]')).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'John Doe' })).toBeEmpty();
    await expect(page.locator('input[name="pocSettings.street"]')).toBeEmpty();
  });

  test.skip('[Negative] Verify Save is Not Allowed Without Required Fields POC Fields in New Institution @[114444] @super-admin @functional', async ({
    page,
  }) => {
    // goto institution settings
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByTestId('tabs')).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Institution' })).toBeVisible();

    // click on previously created 'New Institution'
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').first().click();

    // VERIFY FIELDS ARE EMPTY OR HAVE DEFAULT VALUES
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByRole('textbox', { name: 'Example Name' })).toHaveValue('New Institution');
    await expect(page.getByRole('button', { name: 'Copy link' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link' }).nth(1)).toBeVisible();
    await expect(page.locator('input[name="phone.number"]')).toBeEmpty();
    await expect(page.locator('input[name="address1"]')).toBeEmpty();
    await expect(page.locator('input[name="address2"]')).toBeEmpty();
    await expect(page.locator('input[name="zip"]')).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'John Doe' })).toBeEmpty();
    await expect(page.locator('input[name="pocSettings.street"]')).toBeEmpty();

    // verify Save Changes is disabled
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });
});
