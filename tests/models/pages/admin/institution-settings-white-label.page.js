import { BasePage } from '../../base-page.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class InstitutionSettingsWhiteLabelPage extends BasePage {
  constructor(page) {
    super(page);

    // Main Navigation (used in gotoInstitutionSettingsWhiteLabel)
    this.institutionSettingsTab = page.locator('a').filter({ hasText: 'Institution Settings' });

    // Settings Navigation (used in gotoInstitutionSettingsWhiteLabel)
    this.whiteLabelSection = page.getByRole('button', { name: 'White label' });

    // White Label Configuration
    this.whiteLabelEnabledText = page.getByText('White Label Enabled');
    this.whiteLabelEnabledToggle = page
      .locator('label')
      .filter({ hasText: 'White Label Enabled' })
      .getByTestId('switch-div');
    this.whiteLabelDescription = page.getByText('Enabling White Label will');

    this.whiteLabelHeader = page.getByRole('heading', { name: 'White label' });
    this.organizationNameLabel = page.getByText('Organization name');
    this.organizationNameInput = page.getByRole('textbox', {
      name: 'Organization example',
    });
    this.productNameLabel = page.getByText('Product name').nth(1);
    this.productNameInput = page.getByRole('textbox', { name: 'Name example' });
    this.subdomainLabel = page.getByText('Subdomain');
    this.subdomainInput = page.getByRole('textbox', {
      name: 'Subdomain example',
    });

    // Organization Logo
    this.organizationLogoHeader = page.getByText('Organization logo');
    this.organizationLogoAvatar = page
      .locator('div')
      .filter({ hasText: /^Upload logo$/ })
      .getByTestId('avatar')
      .locator('div')
      .nth(1);
    this.uploadPhotoButtonOrganizationLogo = page.getByRole('link', {
      name: 'Upload Upload logo',
    });
    this.uploadPhotoDescription = page.getByText('You can upload your logo in');

    // Favicon
    this.faviconHeader = page.getByText('Favicon').first();
    this.faviconAvatar = page
      .locator('div')
      .filter({ hasText: /^Upload favicon$/ })
      .getByTestId('avatar')
      .locator('div')
      .nth(1);
    this.uploadPhotoButtonFavicon = page.getByRole('link', {
      name: 'Upload Upload favicon',
    });
    this.uploadPhotoDescriptionFavicon = page.getByText('We suggest using a 32x32');

    // Cover image
    this.coverImageHeader = page.getByText('Cover image').first();
    this.coverImageAvatar = page.locator('div').filter({ hasText: /^Cover image preview$/ });
    this.uploadPhotoButtonCoverImage = page.getByRole('link', {
      name: 'Upload Upload cover image',
    });
    this.resetPhotoButtonCoverImage = page.getByRole('link', { name: 'DeferredPayment Reset to' }).first();
    this.uploadPhotoDescriptionCoverImage = page.getByText('Upload a new cover image to');

    // Branding
    this.brandingHeader = page.getByText('Branding').first();
    this.primaryBrandColorLabel = page.getByText('Primary brand color');
    this.mainButtonTextColorLabel = page.getByText('Main button text color');
    this.resetToDefaultBrandingButton = page.getByRole('link', { name: 'Reset to default' }).nth(1);
    this.brandingCard = page.getByTestId('card').nth(1);

    this.primaryColorButton = page.locator('input[name="whitelabel\\.primaryColor"]');
    this.colorModalText = page.getByText('Select color');
    this.hueSlider = page.getByRole('slider', { name: 'Hue' });
    this.colorSlider = page.getByRole('slider', { name: 'Color' });
    this.hexInputText = page.getByText('Hex');
    this.modalCancelButton = page.getByRole('button', { name: 'Cancel' }).first();
    this.modalSelectButton = page.getByRole('button', { name: 'Select' }).first();

    this.mainButtonTextColorButton = page.locator('input[name="whitelabel\\.buttonTextColor"]');

    // Patient Booking
    this.patientBookingHeader = page.getByText('Patient booking').first();
    this.patientBookingDescription = page.getByText('Set design for patient');
    this.scheduleAppointmentText = page.getByRole('paragraph').filter({ hasText: 'Schedule an appointment' });
    this.scheduleAppointmentCard = page.getByTestId('card').nth(2);
    this.seeProviderNowText = page.getByRole('paragraph').filter({ hasText: 'See a provider now' });
    this.seeProviderNowCard = page.getByTestId('card').nth(3);

    // Buttons
    this.saveChangesButton = page.getByRole('button', { name: 'Save changes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // Success and Error Messages
    this.successMessage = page.getByText('Info updated successfully');
    this.invalidImageErrorMessage = page.getByText('Please upload a valid image file (JPEG, PNG, SVG).').first();
    this.organizationNameRequiredError = page.getByText('Organization name is required');
    this.productNameRequiredError = page.getByText('Product name is required');
    this.subdomainRequiredError = page.getByText(
      'A valid subdomain value must be defined prior to turning on White Labeling'
    );
    this.alphanumericValidationError = page.getByText('Text fields can include alphanumeric characters');
    this.subdomainValidationError = page.getByText('A subdomain can only contain letters, numbers, or hyphens');
    this.fileSizeExceedsError = page.getByText('File size exceeds the maximum limit of 5MB').first();

    // Additional locators for elements accessed directly in tests
    this.solidButton = page.getByRole('button', { name: 'Solid' });
    this.defaultButton = page.getByRole('button', { name: 'Default' });
    this.scheduleAppointmentColorPickers = this.scheduleAppointmentCard.getByTestId('color-picker');
    this.seeProviderNowColorPickers = this.seeProviderNowCard.getByTestId('color-picker');
    this.resetToDefaultPatientBooking = page.getByRole('link', { name: 'DeferredPayment Reset to' }).nth(2);
    this.resetToDefaultSeeProviderNow = page.getByRole('link', { name: 'DeferredPayment Reset to' }).nth(3);
    this.tooltipCancelButton = page.getByRole('tooltip').getByRole('button', { name: 'Cancel' });
    this.coverImageElement = page.getByRole('img', { name: 'cover' });
    this.primaryColorHex = page.getByText('#405B80');
    this.defaultColorHex = page.getByText('#3476D8').first();
  }

  async gotoInstitutionSettingsWhiteLabel() {
    await this.page.goto(`${process.env.UAT_URL}/institution-settings`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    await this.institutionSettingsTab.click();
    await this.whiteLabelSection.click();
    await this.page.waitForLoadState('networkidle');
    await this.whiteLabelHeader.waitFor({ state: 'visible' });
  }

  // Simple helper methods for common actions
  async uploadOrganizationLogo(filePath) {
    await this.uploadFile(this.uploadPhotoButtonOrganizationLogo, filePath);
  }

  async uploadFavicon(filePath) {
    await this.uploadFile(this.uploadPhotoButtonFavicon, filePath);
  }

  async uploadCoverImage(filePath) {
    await this.uploadFile(this.uploadPhotoButtonCoverImage, filePath);
  }

  // Helper methods for file paths
  getOrganizationLogoPath() {
    return path.join(__dirname, '../../../images/organization-logo.jpg');
  }

  getFaviconPath() {
    return path.join(__dirname, '../../../images/favicon-default.png');
  }

  getCoverImagePath() {
    return path.join(__dirname, '../../../images/cover-image-greg.jpg');
  }

  getInvalidImagePath() {
    return path.join(__dirname, '../../../images/invalid-image.txt');
  }

  getLargeImagePath() {
    return path.join(__dirname, '../../../images/large-image.jpg');
  }

  // Helper methods for toggle operations
  async turnWhiteLabelOn() {
    const isCurrentlyOn = await this.whiteLabelEnabledToggle.isChecked();
    if (!isCurrentlyOn) {
      await this.whiteLabelEnabledToggle.click();
    }
  }

  async turnWhiteLabelOff() {
    const isCurrentlyOn = await this.whiteLabelEnabledToggle.isChecked();
    if (isCurrentlyOn) {
      await this.whiteLabelEnabledToggle.click();
    }
  }

  async ensureWhiteLabelIsOn() {
    await this.turnWhiteLabelOn();
    if (await this.saveChangesButton.isEnabled()) {
      await this.saveChangesButton.click();
    }
  }

  async ensureWhiteLabelIsOff() {
    await this.turnWhiteLabelOff();
    if (await this.saveChangesButton.isEnabled()) {
      await this.saveChangesButton.click();
    }
  }
}
