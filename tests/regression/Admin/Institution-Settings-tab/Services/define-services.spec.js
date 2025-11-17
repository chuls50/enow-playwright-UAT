import { test, expect } from '@playwright/test';
import { InstitutionSettingsServicesPage } from '../../../../models/pages/admin/institution-settings-services.page.js';
import { useRole, ROLES } from '../../../../utils/auth-helpers.js';

// Define Services - Total tests: 23 (including 3 skipped tests)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let institutionSettingsServicesPage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsServicesPage = new InstitutionSettingsServicesPage(page);
    await institutionSettingsServicesPage.gotoServiceSettings();
  });

  test('Verify Services & Payments page displays correctly @[112159] @admin @ui', async () => {
    // Verify UI elements of Services & Payments page
    await expect(institutionSettingsServicesPage.pageHeading).toBeVisible();
    await expect(institutionSettingsServicesPage.addServiceButton).toBeVisible();
  });

  test('Verify toggling "Fee Enabled" switch @[111373] @admin @functional', async () => {
    // Toggle fee enabled and verify save button state
    await institutionSettingsServicesPage.feeEnabledSwitch.click();
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
    await institutionSettingsServicesPage.feeEnabledSwitch.click();
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeDisabled();
  });

  test('Verify the add service tab displays correctly @[112160] @admin @ui', async () => {
    // open add service tab
    await institutionSettingsServicesPage.openAddServiceSection();
    await expect(institutionSettingsServicesPage.specialtyDropdownRequiredText).toBeVisible();

    // close add service tab
    await institutionSettingsServicesPage.cancelAddService();
    await expect(institutionSettingsServicesPage.specialtyDropdownRequiredText).not.toBeVisible();
  });

  test('Verify entering text in Service Name field @[112162] @admin @functional', async () => {
    await institutionSettingsServicesPage.fillServiceName('$%^&*()_+', 3);
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.errorMessage).toBeVisible();
    await expect(institutionSettingsServicesPage.validationErrorMessage).toBeVisible();

    await institutionSettingsServicesPage.clearField('name', 3);
    await expect(institutionSettingsServicesPage.requiredFieldError).toBeVisible();

    // Fill service name with timestamp and save
    await institutionSettingsServicesPage.fillServiceName('General Dietician', 3, true);
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.successMessage).toBeVisible();

    // Clear and fill with regular name
    await institutionSettingsServicesPage.clearField('name', 3);
    await institutionSettingsServicesPage.fillServiceName('General Dietician', 3);
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.successMessage).toBeVisible();
  });

  test('Verify entering text in Description field @[112163] @admin @functional', async () => {
    // Test invalid characters
    await institutionSettingsServicesPage.fillDescription('@#$%^&*', 3);
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.errorToast).toBeVisible();
    await expect(institutionSettingsServicesPage.validationErrorMessage).toBeVisible();

    // Clear field and verify save button is disabled
    await institutionSettingsServicesPage.clearField('description', 3);
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeDisabled();
  });

  test('Verify specialty dropdown functionality @[112164] @admin @functional', async ({ page }) => {
    // Select first specialty dropdown, verify selection closes dropdown
    await institutionSettingsServicesPage.specialtyDropdown.click();
    await expect(institutionSettingsServicesPage.specialtyDropdownItemsWrapper).toBeVisible();
    await institutionSettingsServicesPage.specialtyGeneralPractitionerItem.click();
    await expect(institutionSettingsServicesPage.specialtyDropdownItemsWrapper).not.toBeVisible();
  });

  test('Verify toggling Service Enabled switch @[112165] @admin @functional', async () => {
    // Toggle service enabled and verify save button state
    await institutionSettingsServicesPage.serviceEnabledSwitch.click();
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
    await institutionSettingsServicesPage.serviceEnabledSwitch.click();
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeDisabled();
  });

  test('Verify toggling Allow Encounter Now switch @[114080] @admin @functional', async () => {
    // Toggle allow encounter now and verify save button state
    await institutionSettingsServicesPage.allowEncounterNowSwitch.click();
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
    await institutionSettingsServicesPage.allowEncounterNowSwitch.click();
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeDisabled();
  });

  // flaky
  test.skip('Validate "Manage Providers" @[112166] @admin @functional', async ({ page }) => {
    await institutionSettingsServicesPage.resetState();

    await page.getByRole('button', { name: 'Provider List' }).first().click();
    await page.getByTestId('modal').getByTestId('dropdown-field').click();
    await page.getByTestId('item cody all roles two Cody Test Institution').click();
    await page.getByRole('button', { name: 'Add Provider' }).click();
    await expect(page.getByTestId('toast').getByText('cody all roles two Cody Test')).toBeVisible();
    await page.getByTestId('cell-1-remove').getByRole('button', { name: 'Trash' }).click();
    await expect(page.getByText('cody all roles two Cody Test')).toBeVisible();
    await page.getByRole('button', { name: 'XClose' }).click();
  });

  // one way door
  test.skip('Verify complete "Add service" creation workflow @[112167] @admin @functional', async () => {});

  test('[Negative] Test entering invalid Service Name @[112168] @admin @functional', async () => {
    // Test invalid characters in service name
    await institutionSettingsServicesPage.fillServiceName('$%^&*()_+', 3);
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.errorMessage).toBeVisible();
    await expect(institutionSettingsServicesPage.validationErrorMessage).toBeVisible();

    // Test empty field
    await institutionSettingsServicesPage.clearField('name', 3);
    await expect(institutionSettingsServicesPage.requiredFieldError).toBeVisible();
  });

  // flaky
  test.skip('[Negative] Test entering invalid "Fee price" @[112169] @admin @functional', async () => {});

  test('[Negative] Verify Duplicate Provider Selection @[112170] @admin @functional', async ({ page }) => {
    // Open manage providers modal
    await institutionSettingsServicesPage.providerListButton.click();

    // Verify existing provider is not selectable again
    await expect(page.getByTestId('cell-0-name')).toBeVisible();
    const providerName = await page.getByTestId('cell-0-name').innerText();
    await institutionSettingsServicesPage.providerDropdownInModal.click();
    const providerItems = institutionSettingsServicesPage.itemsWrapper.getByText(providerName);
    await expect(providerItems).toHaveCount(0);
  });

  // too long, multi-user test
  test.skip('[Negative] Check Disabling Service with Assigned Providers @[112171]', async () => {});

  test('Verify Editing an Existing Service @[112172] @admin @functional', async () => {
    await institutionSettingsServicesPage.fillServiceName('$%^&*()_+', 3);
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.errorMessage).toBeVisible();
    await expect(institutionSettingsServicesPage.validationErrorMessage).toBeVisible();

    await institutionSettingsServicesPage.clearField('name', 3);
    await expect(institutionSettingsServicesPage.requiredFieldError).toBeVisible();

    // Fill service name with timestamp and save
    await institutionSettingsServicesPage.fillServiceName('General Dietician', 3, true);
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.successMessage).toBeVisible();

    // Clear and fill with regular name
    await institutionSettingsServicesPage.clearField('name', 3);
    await institutionSettingsServicesPage.fillServiceName('General Dietician', 3);
    await institutionSettingsServicesPage.saveChangesButton.click();
    await expect(institutionSettingsServicesPage.successMessage).toBeVisible();
  });

  test('Verify Canceling Service Addition @[112173] @admin @functional', async () => {
    // Open add service section
    await institutionSettingsServicesPage.addServiceButton.click();
    await expect(institutionSettingsServicesPage.addNewServiceText).toBeVisible();

    // Cancel and verify section closes
    await institutionSettingsServicesPage.cancelAddService();
    await expect(institutionSettingsServicesPage.addNewServiceText).not.toBeVisible();
  });

  //flaky
  test.skip('Verify entering number in "Fee price" field @[114085] @admin @functional', async () => {});

  test('Verify Providers button functionality @[114086] @admin @functional', async () => {
    // Open provider list modal
    await institutionSettingsServicesPage.openProviderListModal();

    // Verify all modal elements are visible - explicit assertions in test
    await expect(institutionSettingsServicesPage.manageProvidersModal).toBeVisible();
    await expect(institutionSettingsServicesPage.searchProviderText).toBeVisible();
    await expect(institutionSettingsServicesPage.searchProviderInput).toBeVisible();
    await expect(institutionSettingsServicesPage.userNameColumn).toBeVisible();
    await expect(institutionSettingsServicesPage.emailColumn).toBeVisible();
    await expect(institutionSettingsServicesPage.removeColumn).toBeVisible();
    await expect(institutionSettingsServicesPage.selectProviderText).toBeVisible();
    await expect(institutionSettingsServicesPage.providerDropdownInModal).toBeVisible();
  });

  test('Verify (manage providers) provider search functionality @[114088] @admin @functional', async ({ page }) => {
    // Open provider list modal
    await institutionSettingsServicesPage.openProviderListModal();
    await expect(page.getByText('Providers for this service not found')).not.toBeVisible();

    // Search for a provider
    await institutionSettingsServicesPage.searchProvider('john');
    await expect(page.getByText('No items')).toBeVisible();
  });

  test('Verify (manage providers) removing a provider from service @[114089] @admin @functional', async ({ page }) => {
    // Open provider list modal
    await institutionSettingsServicesPage.openProviderListModal2();

    // Remove a provider
    await page.getByRole('button', { name: 'Trash' }).first().click();

    // Verify error message
    await page.getByText('cody test provider Cody Test').waitFor({ state: 'visible' });
    await expect(page.getByText('cody test provider Cody Test')).toBeVisible();

    // Reset state
    await page.getByRole('textbox', { name: 'Select Provider' }).click();
    await page.getByTestId('item cody test provider Cody Test Institution').click();
    await page.getByRole('button', { name: 'Add Provider' }).click();
    await expect(page.getByTestId('toast').getByText('cody test provider Cody Test')).toBeVisible();
    await expect(page.getByTestId('cell-0-name').getByText('cody test provider Cody Test')).toBeVisible();
  });

  test('Verify (manage providers) adding a provider from service @[114090] @admin @functional', async ({ page }) => {
    // Open provider list modal
    await institutionSettingsServicesPage.openProviderListModal2();

    // Remove a provider
    await page.getByRole('button', { name: 'Trash' }).click();

    // Verify error message
    await page.getByText('cody test provider Cody Test').waitFor({ state: 'visible' });
    await expect(page.getByText('cody test provider Cody Test')).toBeVisible();

    // Reset state
    await page.getByRole('textbox', { name: 'Select Provider' }).click();
    await page.getByTestId('item cody test provider Cody Test Institution').click();
    await page.getByRole('button', { name: 'Add Provider' }).click();
    await expect(page.getByTestId('toast').getByText('cody test provider Cody Test')).toBeVisible();
    await expect(page.getByTestId('cell-0-name').getByText('cody test provider Cody Test')).toBeVisible();
  });

  test('Verify (manage providers) Select provider dropdown @[114094] @admin @functional', async ({ page }) => {
    // Open provider list modal
    await institutionSettingsServicesPage.openProviderListModal2();

    // Remove a provider
    await page.getByRole('button', { name: 'Trash' }).click();

    // Verify error message
    await page.getByText('cody test provider Cody Test').waitFor({ state: 'visible' });
    await expect(page.getByText('cody test provider Cody Test')).toBeVisible();

    // Reset state
    await page.getByRole('textbox', { name: 'Select Provider' }).click();
    await page.getByTestId('item cody test provider Cody Test Institution').click();
    await page.getByRole('button', { name: 'Add Provider' }).click();
    await expect(page.getByTestId('toast').getByText('cody test provider Cody Test')).toBeVisible();
    await expect(page.getByTestId('cell-0-name').getByText('cody test provider Cody Test')).toBeVisible();
  });

  test('Verify that Institution Administrator can configure multi-select Duration Options in Services tab @[118053] @admin @functional', async () => {
    await institutionSettingsServicesPage.resetState();

    // select multiple dropdowns at once
    await institutionSettingsServicesPage.durationDropdown.first().click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-45 minutes').click();
    await institutionSettingsServicesPage.page.getByTestId('custom-dropdown-item-60 minutes').click();

    // save changes
    await institutionSettingsServicesPage.page.getByRole('button', { name: 'Save changes' }).click();
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
