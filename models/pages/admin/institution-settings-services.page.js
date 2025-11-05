import { BasePage } from '../../base-page.js';

export class InstitutionSettingsServicesPage extends BasePage {
  constructor(page) {
    super(page);

    // Page Elements
    this.pageHeading = page.getByRole('heading', { name: 'Services Settings' });
    this.servicesTab = page.getByRole('button', { name: 'Services' });

    // Add Service Section
    this.addServiceButton = page.getByRole('button', { name: 'Add Service' });
    this.addNewServiceSection = page.getByText(
      'Service name*DescriptionSpecialtyFee enabledFee priceAllow Encounter nowService'
    );
    this.serviceNameInput = page.getByText('Service name*').first();

    // Form Fields
    this.serviceNameField = (index = 0) => page.locator(`input[name="services\\.${index}\\.name"]`);
    this.descriptionField = (index = 0) => page.locator(`input[name="services\\.${index}\\.description"]`);
    this.specialtyDropdown = page.getByTestId('dropdown-field').first();

    // Toggles
    this.feeEnabledSwitch = page.getByText('Fee enabled').first();
    this.serviceEnabledSwitch = page.getByText('Service Enabled').nth(4);
    this.allowEncounterNowSwitch = page.getByText("Allow 'See a provider now'").nth(4);

    // Buttons
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.providerListButton = page.getByRole('button', { name: 'Provider List' }).first();
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });

    // Provider List Section
    this.providerListHeading = page.getByRole('heading', {
      name: 'Manage Providers',
    });
    this.manageProvidersModal = page.getByText('Manage Providers');
    this.searchProviderInput = page.getByRole('textbox', {
      name: 'Search by name',
    });
    this.selectProviderInput = page.getByRole('textbox', {
      name: 'Select Provider',
    });
    this.providerDropdownInModal = page.getByTestId('modal').getByTestId('dropdown-field');
    this.addProviderButton = page.getByRole('button', { name: 'Add Provider' });
    this.closeModalButton = page.getByRole('button', { name: 'XClose' });
    this.trashButton = page.getByRole('button', { name: 'Trash' });
    this.itemsWrapper = page.getByTestId('items-wrapper');

    // Fee Price Field
    this.feePriceField = page.getByRole('textbox', { name: 'Fee price' }).first();

    // Duration Dropdown
    this.durationDropdown = page.getByTestId('custom-select-item-wrapper');
    this.customDropdown = page.getByTestId('custom-dropdown');

    // Provider Table Elements
    this.userNameColumn = page.getByRole('cell', { name: 'User Name' });
    this.emailColumn = page.getByRole('cell', { name: 'Email' });
    this.removeColumn = page.getByRole('cell', { name: 'Remove' });
    this.searchProviderText = page.getByText('Search Provider');
    this.selectProviderText = page.getByText('Select Provider');

    // Specific provider elements that appear in tests
    this.ashleyFloresItem = page.getByTestId('item Ashley Flores');
    this.johnDoeItem = page.getByTestId('item John Doe');
    this.johnDoeRemoveButton = page.getByTestId('cell-0-remove').getByRole('button', { name: 'Trash' });

    // Messages
    this.successMessage = page.getByText('Info updated successfully');
    this.validationErrorMessage = page.getByText('Text fields can include');
    this.errorMessage = page.getByText('Please fix the errors in the');
    this.errorToast = page.getByText('Please fix the errors in the');
    this.requiredFieldError = page.getByText('This field is required - please provide a value');
    this.feeErrorMessage = page.getByText('Fee must be greater than 0 when enabled');
    this.ashleyFloresRemovedMessage = page.getByText('Ashley Flores removed from');
    this.ashleyFloresAddedMessage = page.getByText('Ashley Flores added to service');
    this.johnDoeRemovedMessage = page.getByText('John Doe removed from service');
    this.johnDoeAddedMessage = page.getByText('John Doe added to service');

    // Dynamic elements that appear in specific tests
    this.addNewServiceText = page.getByText('Service name*DescriptionSpecialtySpecialty requiredDuration30 minutesFee');
    this.johndoeproviderEmail = page.getByText('chuls+johndoeprovider@');
  }

  // Navigation Methods
  async gotoServiceSettings() {
    // const currentUrl = this.page.url();
    // const baseUrl = currentUrl.replace(/(\/[^\/?#]*)?([?#].*)?$/, '');
    // await this.page.goto(`${baseUrl}/institution-settings`);

    await this.page.goto(`${process.env.UAT_URL}/institution-settings`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    await this.servicesTab.click();
    await this.page.waitForLoadState('networkidle');
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  async fillServiceName(serviceName, index = 1, addTimestamp = false) {
    const finalName = addTimestamp ? `${serviceName} ${Date.now()}` : serviceName;
    await this.serviceNameField(index).click();
    await this.serviceNameField(index).fill(finalName);
    return finalName;
  }

  async fillDescription(description, index = 0) {
    await this.descriptionField(index).click();
    await this.descriptionField(index).fill(description);
  }

  async clearField(fieldType, index = 0) {
    const field = fieldType === 'name' ? this.serviceNameField(index) : this.descriptionField(index);
    await field.clear();
  }

  async selectSpecialty(specialtyName) {
    await this.specialtyDropdown.click();
    await this.page.getByTestId('items-wrapper').getByTestId(`item ${specialtyName}`).click();
  }

  async openAddServiceSection() {
    await this.addServiceButton.click();
    await this.saveChangesButton.waitFor({ state: 'visible', timeout: 60000 });
  }

  async cancelAddService() {
    await this.cancelButton.click();
  }

  async openProviderListModal() {
    await this.providerListButton.click();
    await this.page.waitForTimeout(1000);
    await this.manageProvidersModal.waitFor({ state: 'visible' });
  }

  async searchProvider(providerName) {
    await this.selectProviderInput.click();
    await this.selectProviderInput.fill(providerName);
  }

  async resetState() {
    // If 45 minutes duration is visible, click the X to remove it
    if (
      await this.page
        .locator('div')
        .filter({ hasText: /^45 minutes$/ })
        .isVisible()
    ) {
      await this.page
        .locator('div')
        .filter({ hasText: /^45 minutes$/ })
        .getByRole('button')
        .click();
    }

    // If 60 minutes duration is visible, click the X to remove it
    if (
      await this.page
        .locator('div')
        .filter({ hasText: /^60 minutes$/ })
        .isVisible()
    ) {
      await this.page
        .locator('div')
        .filter({ hasText: /^60 minutes$/ })
        .getByRole('button')
        .click();
      await this.saveChangesButton.click();
      await this.page.waitForTimeout(1000); // wait for 1 second
    }
  }
}
