import { test, expect } from '@playwright/test';
import { InstitutionSettingsInsurancePage } from '../../../models/pages/admin/institution-settings-insurance.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Define Insurance - Total Tests 8 (including 1 skipped test)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let institutionSettingsInsurancePage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsInsurancePage = new InstitutionSettingsInsurancePage(page);
    await institutionSettingsInsurancePage.gotoInsuranceSettings();
  });

  test('Verify Insurance Section Display @[112187] @admin @ui', async () => {
    await expect(institutionSettingsInsurancePage.heading).toBeVisible();
    await expect(institutionSettingsInsurancePage.insuranceSection).toBeVisible();
    await expect(institutionSettingsInsurancePage.premiumPackageLabel).toBeVisible();
    await expect(institutionSettingsInsurancePage.premiumPackageToggle).toBeVisible();
    await expect(institutionSettingsInsurancePage.premiumPackageToggle).toBeEnabled();
    await expect(institutionSettingsInsurancePage.premiumPackageNameLabel).toBeVisible();
    await expect(institutionSettingsInsurancePage.premiumPackageNameInput).toBeVisible();
    await expect(institutionSettingsInsurancePage.premiumPackageNameInput).toBeEnabled();
    await expect(institutionSettingsInsurancePage.insuranceTitle).toBeVisible();
    await expect(institutionSettingsInsurancePage.copayAmount).toBeVisible();
    await expect(institutionSettingsInsurancePage.deleteButton).toBeVisible();
    await expect(institutionSettingsInsurancePage.addInsuranceButton).toBeVisible();
    await expect(institutionSettingsInsurancePage.addInsuranceButton).toBeDisabled();
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeVisible();
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeDisabled();
    await expect(institutionSettingsInsurancePage.cancelButton).toBeVisible();
  });

  test('Verify Premium Package Toggle Functionality @[112188] @admin @functional', async () => {
    await institutionSettingsInsurancePage.premiumPackageToggle.click();
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Premium Package Name Input @[112189] @admin @functional', async () => {
    await institutionSettingsInsurancePage.enablePremiumPackageIfNeeded();
    await expect(institutionSettingsInsurancePage.premiumPackageNameInput).toBeVisible();
    await expect(institutionSettingsInsurancePage.premiumPackageNameInput).toBeEnabled();
    await institutionSettingsInsurancePage.premiumPackageNameInput.fill('Premium Insured Package');
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Self Payment Toggle Functionality @[112190] @admin @functional', async () => {
    await institutionSettingsInsurancePage.selfPaymentToggleSwitch.click();
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Adding a New Insurance Entry @[112193] @admin @functional', async () => {
    await institutionSettingsInsurancePage.enablePremiumPackageIfNeeded();
    await institutionSettingsInsurancePage.addInsuranceEntry();
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeEnabled();

    // Add more explicit assertions for the added insurance
    // For new insurance entry, we'll verify it by checking that the full text pattern exists
    const insuranceRow = institutionSettingsInsurancePage.page.locator('div').filter({ hasText: /^Test Insurance20Delete$/ });

    await expect(insuranceRow).toBeVisible();

    // Verify the delete button for the new insurance is visible
    const deleteButton = institutionSettingsInsurancePage.page
      .locator('div')
      .filter({ hasText: /^Test Insurance20Delete$/ })
      .getByRole('button')
      .first();
    await expect(deleteButton).toBeVisible();
  });

  // want to mock API here
  test.skip('Verify Insurance Edit Functionality @[112191] @admin @functional', async () => {});

  test('Verify Insurance Deletion Functionality @[112192] @admin @functional', async () => {
    await institutionSettingsInsurancePage.enablePremiumPackageIfNeeded();

    // Add insurance using the helper method
    await institutionSettingsInsurancePage.addInsuranceEntry();

    // Click the delete button for the added insurance using a more stable selector
    const deleteButton = institutionSettingsInsurancePage.page
      .locator('div')
      .filter({ hasText: /^Test Insurance20Delete$/ })
      .getByRole('button')
      .first();

    await deleteButton.click();
    await institutionSettingsInsurancePage.page.waitForLoadState('networkidle');
    await institutionSettingsInsurancePage.page.waitForSelector('div:has-text("Test Insurance")', { state: 'detached' });
    await expect(institutionSettingsInsurancePage.addInsuranceButton).toBeDisabled();
  });

  test('[Negative] Verify Navigation Away Without Saving Changes @[112194] @admin @functional', async () => {
    await institutionSettingsInsurancePage.enablePremiumPackageIfNeeded();
    await institutionSettingsInsurancePage.addInsuranceEntry();
    await institutionSettingsInsurancePage.gotoInsuranceSettings();
    await expect(institutionSettingsInsurancePage.saveChangesButton).toBeDisabled();
  });
});
