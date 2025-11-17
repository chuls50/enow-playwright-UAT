import { test, expect } from '@playwright/test';
import { InstitutionSettingsProfilePage } from '../../../models/pages/admin/institution-settings-profile.page.js';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

test.describe('Super Admin @regression', () => {
  let institutionSettingsProfilePage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsProfilePage = new InstitutionSettingsProfilePage(page);

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
    await institutionSettingsProfilePage.waitForSpinnerToDisappear();
  });

  test.skip('Verify Institution Language selection dropdown functionality @[118727] @super-admin @functional', async ({ page }) => {
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').nth(1).click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByRole('textbox', { name: 'Example Name' })).toBeVisible();
    await page
      .locator('div')
      .filter({ hasText: /^Institution languageEnglish$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-Spanish').click();
    // verify save changes button is enabled
    await expect(institutionSettingsProfilePage.saveChangesButton).toBeEnabled();
  });

  test.skip('Verify that default Institution Language is set to English for New Institutions @[118728] @super-admin @functional', async ({
    page,
  }) => {
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').first().click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByRole('textbox', { name: 'Example Name' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Institution languageEnglish$/ })).toBeVisible();
  });

  test.skip('Verify that Language Selection fields is Mandatory @[118729] @super-admin @functional', async ({ page }) => {
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').nth(1).click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByRole('textbox', { name: 'Example Name' })).toBeVisible();
    await expect(page.getByText('Institution language')).toBeVisible();
  });

  // mailanator account
  test.skip('Verify that Invitation Link is sent in Institution Language @[118730] @multi-user @functional', async ({ page }) => {});

  // mailanator account
  test.skip('Verify that Reset Password email is sent in Institution Language @[118731] @multi-user @functional', async ({ page }) => {});
});
