import { test, expect } from '@playwright/test';
import { InstitutionSettingsWhiteLabelPage } from '../../../../models/pages/admin/institution-settings-white-label.page.js';
import { useRole, ROLES } from '../../../../utils/auth-helpers.js';

// Admin Configuration White Label - Total tests 25 (including 2 skipped)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let institutionSettingsWhiteLabelPage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsWhiteLabelPage = new InstitutionSettingsWhiteLabelPage(page);
    await institutionSettingsWhiteLabelPage.gotoInstitutionSettingsWhiteLabel();
  });

  test('Verify "White Label Configuration" Page Display @[112119] @admin @ui', async () => {
    // Verify white label configuration section elements
    await expect(institutionSettingsWhiteLabelPage.whiteLabelEnabledText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.whiteLabelEnabledToggle).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.whiteLabelDescription).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.whiteLabelHeader).toBeVisible();

    // Verify basic configuration input fields
    await expect(institutionSettingsWhiteLabelPage.organizationNameLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.organizationNameInput).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.productNameLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.productNameInput).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.subdomainLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.subdomainInput).toBeVisible();

    // Verify organization logo section elements
    await expect(institutionSettingsWhiteLabelPage.organizationLogoHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.organizationLogoAvatar).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.uploadPhotoButtonOrganizationLogo).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.uploadPhotoDescription).toBeVisible();

    // Verify favicon section elements
    await expect(institutionSettingsWhiteLabelPage.faviconHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.faviconAvatar).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.uploadPhotoButtonFavicon).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.uploadPhotoDescriptionFavicon).toBeVisible();

    // Verify cover image section elements
    await expect(institutionSettingsWhiteLabelPage.coverImageHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.coverImageAvatar).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.uploadPhotoButtonCoverImage).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.resetPhotoButtonCoverImage).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.uploadPhotoDescriptionCoverImage).toBeVisible();

    // Verify branding customization section elements
    await expect(institutionSettingsWhiteLabelPage.brandingHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.primaryBrandColorLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.mainButtonTextColorLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.resetToDefaultBrandingButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.brandingCard).toBeVisible();

    // Verify patient booking customization elements
    await expect(institutionSettingsWhiteLabelPage.patientBookingHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.patientBookingDescription).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.scheduleAppointmentText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.scheduleAppointmentCard).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.seeProviderNowText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.seeProviderNowCard).toBeVisible();

    // Verify action buttons are visible and properly disabled
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeDisabled();
    await expect(institutionSettingsWhiteLabelPage.cancelButton).toBeVisible();
  });

  test('Verify label and placeholder text on "White Label Configuration" Page @[111333] @admin @ui', async () => {
    // Verify white label toggle and description elements
    await expect(institutionSettingsWhiteLabelPage.whiteLabelEnabledText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.whiteLabelEnabledToggle).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.whiteLabelDescription).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.whiteLabelHeader).toBeVisible();

    // Verify configuration input labels and fields
    await expect(institutionSettingsWhiteLabelPage.organizationNameLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.organizationNameInput).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.productNameLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.productNameInput).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.subdomainLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.subdomainInput).toBeVisible();
  });

  test('Verify "Organization Name" Field Functionality @[112121] @admin @functional', async () => {
    // Fill organization name field and verify save button activates
    await institutionSettingsWhiteLabelPage.organizationNameInput.fill('GlobalMed Day Spa');
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeEnabled();
  });

  test('Verify "Product Name" Field Functionality @[112122] @admin @functional', async () => {
    // Fill product name field and verify save button activates
    await institutionSettingsWhiteLabelPage.productNameInput.fill('GlobalMed Product');
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeEnabled();
  });

  test('Verify "Subdomain" Field Functionality @[115381] @admin @functional', async () => {
    // Fill subdomain field and verify save button activates
    await institutionSettingsWhiteLabelPage.subdomainInput.fill('mysubdomain');
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeEnabled();
  });

  test('Verify Image Upload for "Organization logo" on White Label Tab Screen @[111334] @admin @functional', async () => {
    // Upload organization logo image and save changes
    await institutionSettingsWhiteLabelPage.uploadOrganizationLogo(institutionSettingsWhiteLabelPage.getOrganizationLogoPath());
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
  });

  test('Verify Image Upload for "Favicon" on White Label Tab Screen @[115385] @admin @functional', async () => {
    // Upload favicon image and save changes
    await institutionSettingsWhiteLabelPage.uploadFavicon(institutionSettingsWhiteLabelPage.getFaviconPath());
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
  });

  test('Verify Image Upload for "Cover Image" on White Label Tab Screen @[115386] @admin @functional', async () => {
    // Upload cover image and save changes
    await institutionSettingsWhiteLabelPage.uploadCoverImage(institutionSettingsWhiteLabelPage.getCoverImagePath());
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
  });

  test('Verify "Branding" customization Functionality @[115390] @admin @functional', async () => {
    // Verify branding section elements are visible
    await expect(institutionSettingsWhiteLabelPage.brandingHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.primaryBrandColorLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.mainButtonTextColorLabel).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.resetToDefaultBrandingButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.brandingCard).toBeVisible();

    // Open primary color picker and verify modal elements
    await institutionSettingsWhiteLabelPage.primaryColorButton.click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.modalCancelButton.click();

    // Open text color picker and verify modal elements
    await institutionSettingsWhiteLabelPage.mainButtonTextColorButton.click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.modalCancelButton.click();
  });

  test('Verify "Schedule an Appointment" customization Functionality @[115388] @admin @functional', async () => {
    await expect(institutionSettingsWhiteLabelPage.patientBookingHeader).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.patientBookingDescription).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.scheduleAppointmentText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.scheduleAppointmentCard).toBeVisible();

    await institutionSettingsWhiteLabelPage.solidButton.first().click();
    await institutionSettingsWhiteLabelPage.defaultButton.first().click();

    // Background color
    await institutionSettingsWhiteLabelPage.scheduleAppointmentColorPickers.first().click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    // Text color
    await institutionSettingsWhiteLabelPage.scheduleAppointmentColorPickers.nth(1).click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    // Highlight 1
    await institutionSettingsWhiteLabelPage.scheduleAppointmentColorPickers.nth(2).click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    // Highlight 2
    await institutionSettingsWhiteLabelPage.scheduleAppointmentColorPickers.nth(2).click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    await expect(institutionSettingsWhiteLabelPage.resetToDefaultPatientBooking).toBeVisible();
  });

  test('Verify "See a Provider Now" customization Functionality @[115389] @admin @functional', async () => {
    await expect(institutionSettingsWhiteLabelPage.seeProviderNowText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.seeProviderNowCard).toBeVisible();

    await institutionSettingsWhiteLabelPage.solidButton.nth(1).click();
    await institutionSettingsWhiteLabelPage.defaultButton.nth(1).click();

    // Background color
    await institutionSettingsWhiteLabelPage.seeProviderNowColorPickers.first().click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    // Text color
    await institutionSettingsWhiteLabelPage.seeProviderNowColorPickers.nth(1).click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    // Highlight 1
    await institutionSettingsWhiteLabelPage.seeProviderNowColorPickers.nth(2).click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    // Highlight 2
    await institutionSettingsWhiteLabelPage.seeProviderNowColorPickers.nth(2).click();
    await expect(institutionSettingsWhiteLabelPage.colorModalText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hueSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.colorSlider).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.hexInputText).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalCancelButton).toBeVisible();
    await expect(institutionSettingsWhiteLabelPage.modalSelectButton).toBeVisible();
    await institutionSettingsWhiteLabelPage.tooltipCancelButton.click();

    await expect(institutionSettingsWhiteLabelPage.resetToDefaultSeeProviderNow).toBeVisible();
  });

  test('Verify "Save Changes" button @[112124] @admin @functional', async () => {
    // Upload cover image to trigger changes and verify save button
    await institutionSettingsWhiteLabelPage.uploadCoverImage(institutionSettingsWhiteLabelPage.getCoverImagePath());
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeEnabled();
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
  });

  test('Verify "Cancel" button @[115387] @admin @functional', async () => {
    // Make changes and click cancel button
    await institutionSettingsWhiteLabelPage.organizationNameInput.fill('GlobalMed Day Spa');
    await institutionSettingsWhiteLabelPage.cancelButton.click();

    // Refresh page and verify changes were not saved
    await institutionSettingsWhiteLabelPage.gotoInstitutionSettingsWhiteLabel();
    await expect(institutionSettingsWhiteLabelPage.organizationNameInput).not.toHaveValue('GlobalMed Day Spa');
  });

  test('[Negative] Verify "White Label Configuration" @[112123] @admin @functional', async () => {
    // Test invalid organization name with special characters
    await institutionSettingsWhiteLabelPage.organizationNameInput.fill('!@#$%^&*()');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();

    // Test invalid product name with special characters
    await institutionSettingsWhiteLabelPage.productNameInput.fill('!@#$%^&*()');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();

    // Test invalid subdomain with special characters
    await institutionSettingsWhiteLabelPage.subdomainInput.fill('!@#$%^&*()');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();

    // Clear all input fields to test empty value validation
    await institutionSettingsWhiteLabelPage.organizationNameInput.fill('');
    await institutionSettingsWhiteLabelPage.productNameInput.fill('');
    await institutionSettingsWhiteLabelPage.subdomainInput.fill('');

    // Test invalid file type upload for organization logo
    await institutionSettingsWhiteLabelPage.uploadOrganizationLogo(institutionSettingsWhiteLabelPage.getInvalidImagePath());
    await expect(institutionSettingsWhiteLabelPage.invalidImageErrorMessage).toBeVisible();

    // Test invalid file type upload for favicon
    await institutionSettingsWhiteLabelPage.uploadFavicon(institutionSettingsWhiteLabelPage.getInvalidImagePath());
    await expect(institutionSettingsWhiteLabelPage.invalidImageErrorMessage).toBeVisible();

    // Test invalid file type upload for cover image
    await institutionSettingsWhiteLabelPage.uploadCoverImage(institutionSettingsWhiteLabelPage.getInvalidImagePath());
    await expect(institutionSettingsWhiteLabelPage.invalidImageErrorMessage).toBeVisible();
  });

  test('[Negative] Verify Clicking "Save Changes" without any modifications @[112125] @admin @functional', async () => {
    // Verify save button remains disabled without any changes
    await expect(institutionSettingsWhiteLabelPage.saveChangesButton).toBeDisabled();
  });

  test('[Negative] Verify Invalid Image Upload for Institution Logo on White Label Tab Screen @[112425] @admin @functional', async () => {
    // Upload invalid image file and verify error message appears
    await institutionSettingsWhiteLabelPage.uploadOrganizationLogo(institutionSettingsWhiteLabelPage.getInvalidImagePath());
    await expect(institutionSettingsWhiteLabelPage.invalidImageErrorMessage).toBeVisible();
  });

  test.skip('Verify Reset to Default Button for Branding Colors @[116877]', async () => {
    await institutionSettingsWhiteLabelPage.clickPrimaryColorButton();
    await institutionSettingsWhiteLabelPage.hueSlider.locator('div').first().click();
    await institutionSettingsWhiteLabelPage.colorSlider.click();
    await institutionSettingsWhiteLabelPage.modalSelectButton.click();
    await expect(institutionSettingsWhiteLabelPage.primaryColorHex).toBeVisible();
    await institutionSettingsWhiteLabelPage.resetToDefaultBrandingButton.click();
    await expect(institutionSettingsWhiteLabelPage.defaultColorHex).toBeVisible();
  });

  test('[Negative] Verify Invalid Favicon File Format Upload @[116878] @admin @functional', async () => {
    // Upload invalid favicon file and verify error message appears
    await institutionSettingsWhiteLabelPage.uploadFavicon(institutionSettingsWhiteLabelPage.getInvalidImagePath());
    await expect(institutionSettingsWhiteLabelPage.invalidImageErrorMessage).toBeVisible();
  });

  test('Verify Field Validation for Organization Name @[116879] @admin @functional', async () => {
    // Ensure White Label is enabled before testing organization name validation
    await institutionSettingsWhiteLabelPage.ensureWhiteLabelIsOn();

    // Test organization name with invalid characters and verify error
    await institutionSettingsWhiteLabelPage.organizationNameInput.fill('!@#$%^&*()');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await expect(institutionSettingsWhiteLabelPage.alphanumericValidationError).toBeVisible();

    // Test empty organization name and verify required field error
    await institutionSettingsWhiteLabelPage.organizationNameInput.fill('');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await expect(institutionSettingsWhiteLabelPage.organizationNameRequiredError).toBeVisible();
  });

  test('Verify Field Validation for Subdomain @[116880] @admin @functional', async () => {
    // Ensure White Label is enabled before testing subdomain validation
    await institutionSettingsWhiteLabelPage.ensureWhiteLabelIsOn();

    // Test subdomain with invalid characters and enable white label
    await institutionSettingsWhiteLabelPage.subdomainInput.fill('!@#$%^&*()');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await expect(institutionSettingsWhiteLabelPage.subdomainValidationError).toBeVisible();

    // Test empty subdomain and verify required field error
    await institutionSettingsWhiteLabelPage.subdomainInput.fill('');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await expect(institutionSettingsWhiteLabelPage.subdomainRequiredError).toBeVisible();
  });

  test('Verify Field Validation for Product Name @[116881] @admin @functional', async () => {
    // Ensure White Label is enabled before testing product name validation
    await institutionSettingsWhiteLabelPage.ensureWhiteLabelIsOn();

    // Test product name with invalid characters and enable white label
    await institutionSettingsWhiteLabelPage.productNameInput.fill('!@#$%^&*()');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await expect(institutionSettingsWhiteLabelPage.alphanumericValidationError).toBeVisible();

    // Test empty product name and verify required field error
    await institutionSettingsWhiteLabelPage.productNameInput.fill('');
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await expect(institutionSettingsWhiteLabelPage.productNameRequiredError).toBeVisible();
  });

  test('Verify Reset to Default for Cover Image @[116882] @admin @functional', async ({ page }) => {
    // Upload cover image then reset to default
    await institutionSettingsWhiteLabelPage.uploadCoverImage(institutionSettingsWhiteLabelPage.getCoverImagePath());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Wait for upload to process
    await institutionSettingsWhiteLabelPage.resetPhotoButtonCoverImage.click();
    await institutionSettingsWhiteLabelPage.saveChangesButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Wait for upload to process

    // Verify cover image src attribute is reset to default
    await expect(institutionSettingsWhiteLabelPage.coverImageElement).toHaveAttribute('src', '/images/auth_bg.png');
  });

  test('[Negative] Verify Large File for Cover Image Upload @[116883] @admin @functional', async () => {
    // Upload large/invalid cover image file and verify error message
    await institutionSettingsWhiteLabelPage.uploadCoverImage(institutionSettingsWhiteLabelPage.getLargeImagePath());
    await expect(institutionSettingsWhiteLabelPage.coverImageSizeError).toBeVisible();
  });

  test('[Negative] Verify Large File for Favicon Upload @[116884] @admin @functional', async () => {
    // Upload large/invalid favicon file and verify error message
    await institutionSettingsWhiteLabelPage.uploadFavicon(institutionSettingsWhiteLabelPage.getLargeImagePath());
    await expect(institutionSettingsWhiteLabelPage.faviconSizeError).toBeVisible();
  });

  test('Verify "White Label Enabled" Toggle @[112115] @admin @functional', async () => {
    // Turn on White Label
    await institutionSettingsWhiteLabelPage.ensureWhiteLabelIsOn();
    await institutionSettingsWhiteLabelPage.gotoInstitutionSettingsWhiteLabel();

    // expect URL to contain 'portal'
    await expect(institutionSettingsWhiteLabelPage.page).toHaveURL(/.*xj9/);
  });
});
