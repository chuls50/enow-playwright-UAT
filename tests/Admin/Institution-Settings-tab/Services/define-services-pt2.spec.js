import { test, expect } from '@playwright/test';
import { InstitutionSettingsServicesPage } from '../../../models/pages/admin/institution-settings-services.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Define Services pt2 - Total tests 3

test.describe('Define Services pt2 @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let institutionSettingsServicesPage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsServicesPage = new InstitutionSettingsServicesPage(page);
    await institutionSettingsServicesPage.gotoServiceSettings();
  });

  test('Verify "Duration" dropdown functionality @[118058] @admin @functional', async ({ page }) => {
    await institutionSettingsServicesPage.resetState();

    // click duration dropdown and select multiple options
    await institutionSettingsServicesPage.durationDropdown.first().click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-45 minutes').click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-60 minutes').click();

    // save changes
    await institutionSettingsServicesPage.page.getByRole('button', { name: 'Save changes' }).click();
    await institutionSettingsServicesPage.page.getByText('SuccessInfo updated').waitFor({ state: 'visible' });
    await expect(institutionSettingsServicesPage.page.getByText('SuccessInfo updated')).toBeVisible();

    // remove selections
    await institutionSettingsServicesPage.page
      .locator('div')
      .filter({ hasText: /^45 minutes$/ })
      .getByRole('button')
      .click();
    await institutionSettingsServicesPage.page
      .locator('div')
      .filter({ hasText: /^60 minutes$/ })
      .getByRole('button')
      .click();

    // save changes
    await institutionSettingsServicesPage.page.getByRole('button', { name: 'Save changes' }).click();
    await expect(institutionSettingsServicesPage.page.getByText('SuccessInfo updated').first()).toBeVisible();
  });

  test('Verify error message for missing "Duration" selection @[118064] @admin @functional', async () => {
    await institutionSettingsServicesPage.resetState();

    // remove the only selected duration option
    await institutionSettingsServicesPage.page.getByRole('button', { name: 'XClose' }).first().click();

    // verify error message appears
    await expect(institutionSettingsServicesPage.page.getByText('This field is required -')).toBeVisible();

    // reset state just in case
    await institutionSettingsServicesPage.page.getByTestId('custom-select-item-wrapper').first().click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-30 minutes').click();
  });

  test('Verify selecting more than one time for the "Duration" dropdown @[118065] @admin @functional', async () => {
    await institutionSettingsServicesPage.resetState();

    // select multiple dropdowns at once
    await institutionSettingsServicesPage.durationDropdown.first().click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-45 minutes').click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-60 minutes').click();

    // save changes
    await institutionSettingsServicesPage.page.getByRole('button', { name: 'Save changes' }).click();
    await institutionSettingsServicesPage.page.getByText('SuccessInfo updated').waitFor({ state: 'visible' });
    await expect(institutionSettingsServicesPage.page.getByText('SuccessInfo updated')).toBeVisible();

    // remove selections
    await institutionSettingsServicesPage.page
      .locator('div')
      .filter({ hasText: /^45 minutes$/ })
      .getByRole('button')
      .click();
    await institutionSettingsServicesPage.page
      .locator('div')
      .filter({ hasText: /^60 minutes$/ })
      .getByRole('button')
      .click();

    // save changes
    await institutionSettingsServicesPage.page.getByRole('button', { name: 'Save changes' }).click();
    await expect(institutionSettingsServicesPage.page.getByText('SuccessInfo updated').first()).toBeVisible();
  });
});
