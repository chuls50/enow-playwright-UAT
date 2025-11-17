import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../../models/pages/provider/provider-my-account.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Provider Edit License To Practice - Total tests 9

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let providerMyAccountPage;

  test.beforeEach(async ({ page }) => {
    providerMyAccountPage = new MyAccountPage(page);
    await providerMyAccountPage.gotoProviderMyAccount();
  });

  test('Verify content on Edit License to Practice modal @[111209] @provider @ui', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    await expect(providerMyAccountPage.editLicenseModalLicense1State).toBeVisible();
    await expect(providerMyAccountPage.editLicenseAddLicenseButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseCancelButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseCancelButton).toBeEnabled();
    await expect(providerMyAccountPage.editLicenseSaveButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseSaveButton).toBeDisabled();
  });

  test('Verify Country dropdown functionality in Edit License to Practice modal @[111210] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Desktop Chrome test logic
    await providerMyAccountPage.editLicenseModalLicense1CountryDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
    await providerMyAccountPage.page.getByTestId('custom-dropdown-item-Afghanistan').click();
    await expect(
      providerMyAccountPage.page
        .locator('div')
        .filter({ hasText: /^CountryAfghanistan$/ })
        .getByTestId('custom-select-item-wrapper')
    ).toHaveText('Afghanistan');
    await expect(providerMyAccountPage.editLicenseModalLicense1StateDropdown).toBeEnabled();
  });

  test('Verify State dropdown functionality in Edit License to Practice modal @[111211] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // First select a country to enable state dropdown
    await providerMyAccountPage.selectCountryInEditLicense('Afghanistan');
    await expect(
      providerMyAccountPage.page
        .locator('div')
        .filter({ hasText: /^CountryAfghanistan$/ })
        .getByTestId('custom-select-item-wrapper')
    ).toHaveText('Afghanistan');
    await expect(providerMyAccountPage.editLicenseModalLicense1StateDropdown).toBeEnabled();

    // Test state dropdown functionality
    await providerMyAccountPage.editLicenseModalLicense1StateDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
    await providerMyAccountPage.page.getByTestId('custom-dropdown-item-Badakhshan').click();
    await expect(
      providerMyAccountPage.page
        .locator('div')
        .filter({ hasText: /^StateBadakhshan$/ })
        .getByTestId('custom-select-item-wrapper')
    ).toHaveText('Badakhshan');
  });

  test('Verify Delete License Functionality on Edit License to Practice modal @[111212] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Add license
    await providerMyAccountPage.addLicense2();
    await providerMyAccountPage.editLicenseSaveButton.click();
    await expect(providerMyAccountPage.successMessage).toBeVisible();

    // Now delete the added license
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await providerMyAccountPage.deleteLicenseButton.click();
    await expect(providerMyAccountPage.editLicenseModalLicense2).not.toBeVisible();

    // Save changes after deletion
    await providerMyAccountPage.editLicenseSaveButton.click();
    await expect(providerMyAccountPage.successMessage).toBeVisible();
  });

  test('Verify Add License Functionality on Edit License to Practice modal @[111213] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Add and then delete license to test full workflow
    await providerMyAccountPage.addAndDeleteLicense();
  });

  test('Verify Cancel Button functionality on Edit License to Practice modal @[111214] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Add license
    await providerMyAccountPage.addLicense2();

    // Click cancel
    await providerMyAccountPage.editLicenseCancelButton.click();
    await providerMyAccountPage.page.waitForTimeout(1000);

    // Reopen modal to verify changes were not saved
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await expect(providerMyAccountPage.editLicenseModalLicense2).not.toBeVisible();
  });

  test('Verify Save Changes Validation for Empty Fields on Edit License to Practice @[111215] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Select country but leave state empty to test validation
    await providerMyAccountPage.selectCountryInEditLicense('Afghanistan');
    await expect(
      providerMyAccountPage.page
        .locator('div')
        .filter({ hasText: /^CountryAfghanistan$/ })
        .getByTestId('custom-select-item-wrapper')
    ).toHaveText('Afghanistan');
    await expect(providerMyAccountPage.editLicenseModalLicense1StateDropdown).toBeEnabled();
    await expect(providerMyAccountPage.editLicenseSaveButton).toBeDisabled();
  });

  test('Verify Save Changes Functionality with All Fields Populated on Edit License @[111216] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Add and then delete license to test full workflow
    await providerMyAccountPage.addAndDeleteLicense();
  });

  test('Verify Content on Account Settings Page @[111219] @provider @ui', async () => {
    // Verify the header and main sections are visible
    await expect(providerMyAccountPage.header).toBeVisible();
    await expect(providerMyAccountPage.myAccountText).toBeVisible();
    await expect(providerMyAccountPage.profileIcon).toBeVisible();
    await expect(providerMyAccountPage.profileName).toBeVisible();
    await expect(providerMyAccountPage.profileEmail).toBeVisible();
    await expect(providerMyAccountPage.profileDetailsSection).toBeVisible();
    await expect(providerMyAccountPage.licenseToPracticeSection).toBeVisible();
    await expect(providerMyAccountPage.applicationLanguageSection).toBeVisible();
    await expect(providerMyAccountPage.changeLanguageButton).toBeVisible();
    await expect(providerMyAccountPage.timeZoneSection).toBeVisible();
    await expect(providerMyAccountPage.changeTimeZoneButton).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionSection).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionButton).toBeVisible();
  });
});
