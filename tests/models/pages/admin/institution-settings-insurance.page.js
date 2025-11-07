import { BasePage } from '../../base-page.js';

export class InstitutionSettingsInsurancePage extends BasePage {
  constructor(page) {
    super(page);

    // Define locators directly as properties for clarity and easier usage
    this.insurancePaymentsTab = page.getByRole('button', { name: 'Insurance & Payments' });
    this.heading = page.getByRole('heading', { name: 'Institution Settings' });
    this.insuranceSection = page.getByRole('heading', { name: 'Insurance Setup' });
    this.servicesTab = page.getByRole('button', { name: 'Services' });

    // Premium Package section
    this.premiumPackageLabel = page.getByText('Premium Package').first();
    this.premiumPackageToggle = page
      .locator('label')
      .filter({ hasText: /^Premium package$/ })
      .getByTestId('switch-div');
    this.premiumPackageNameLabel = page.getByText('Premium package name');
    this.premiumPackageNameInput = page.locator('input[name="insurance\\.premiumPackageName"]');

    // Insurance setup
    this.insuranceTitle = page.getByText('Insurance title');
    this.insuranceInput = page.locator('div').filter({ hasText: /^Add$/ }).getByPlaceholder('Example');
    this.copayAmount = page.getByText('Co-pay amount');
    this.copayInput = page.getByRole('textbox', { name: '0' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.addInsuranceButton = page.getByRole('button', { name: 'Plus Add' });

    // Payment setup
    this.paymentSetupSection = page.getByRole('heading', { name: 'Payments Setup' });
    this.selfPaymentLabel = page.getByText('Self Payment');
    this.selfPaymentToggleSwitch = page.locator('label').filter({ hasText: 'Self Payment' }).getByTestId('switch-div');
    this.selfPaymentCheckbox = page.locator('label').filter({ hasText: 'Self Payment' }).getByTestId('switch-div');
    this.selectPaymentProcessorLabel = page.getByText('Select a payment processor');
    this.selectPaymentProcessorDropdown = page
      .locator('div')
      .filter({ hasText: /^Select a payment processor/ })
      .getByTestId('dropdown-field');

    // Payment processor items
    this.itemsWrapper = page.getByTestId('items-wrapper');
    this.azulProcessorItem = page.getByTestId('item Azul');
    this.stripeProcessorItem = page.getByTestId('item Stripe');

    this.currencyLabel = page.getByText('Currency');
    this.currencyDropdown = page.locator('div').getByTestId('icon-ChevronDown').nth(2);
    this.usdCurrencyItem = page.getByTestId('item USD - United States dollar');
    this.dopCurrencyItem = page.getByTestId('item DOP - Dominican peso');

    this.merchantIdLabel = page.getByText('Merchant ID*');
    this.merchantIdInput = page.getByRole('textbox', { name: '123-XXX-XXX' });
    this.merchantNameLabel = page.getByText('Merchant Name*');
    this.merchantNameInput = page.getByRole('textbox', { name: 'Merchant name example' });

    this.authorizationKeyLabel = page.getByText('Authorization key*');
    this.authorizationKeyInput = page.getByRole('textbox', { name: 'XX-XXX-XXX' });

    this.editAccountButton = page.getByRole('button', { name: 'Edit account' });
    this.paymentReportingButton = page.getByRole('button', { name: 'Payment reporting' });

    // Patient payment reminders
    this.patientPaymentRemindersLabel = page.getByText('Patient payment reminders');
    this.patientPaymentRemindersToggle = page.locator('label').filter({ hasText: 'Patient payment reminders' }).getByTestId('switch-div');
    this.serviceRemindersLabel = page.getByText('Service reminder');
    this.serviceReminderDropdown = page.getByTestId('dropdown-field').nth(2);
    this.serviceReminderDropdownSelection = page.getByTestId('item 48 hours before appointment');
    this.intervalsLabel = page.getByText('Intervals');
    this.intervalsDropdown = page.getByTestId('dropdown-field').nth(3);
    this.intervalsDropdownSelection = page.getByTestId('item Every 8 hours');

    // Action buttons
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // Success messages
    this.successMessage = page.getByText('SuccessInfo updated');

    // Error messages
    this.errorMessage = page.getByText('This field is required - please provide a value').first();
    this.errorMessageToast = page.getByText('Please fix the errors in the form.').first();

    // Success messages
    this.successMessage = page.getByText('SuccessInfo updated');
  }

  async gotoInsuranceSettings() {
    await this.page.goto(`${process.env.UAT_URL}/institution-settings`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    await this.insurancePaymentsTab.click();
    await this.insuranceSection.waitFor({ state: 'visible' });
  }

  async enableSelfPaymentIfNeeded() {
    await this.selfPaymentLabel.waitFor({ state: 'visible' });
    const isSelfPaymentOn = await this.selfPaymentCheckbox.isChecked();
    if (!isSelfPaymentOn) {
      await this.selfPaymentToggleSwitch.click();
      await this.page.waitForLoadState('networkidle');
      await this.saveChangesButton.waitFor({ state: 'visible' });
      return true;
    }
    return false;
  }

  async selectPaymentProcessor(processor) {
    await this.selectPaymentProcessorDropdown.click();
    await this.itemsWrapper.waitFor({ state: 'visible' });

    if (processor === 'Azul') {
      await this.azulProcessorItem.click();
    }

    if (processor === 'Stripe') {
      await this.stripeProcessorItem.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async selectCurrency(currency) {
    await this.currencyDropdown.click();
    await this.itemsWrapper.waitFor({ state: 'visible' });

    if (currency === 'USD') {
      await this.usdCurrencyItem.click();
    } else if (currency === 'DOP') {
      await this.dopCurrencyItem.click();
    }
  }

  async toggleSelfPaymentAndSave() {
    await this.selfPaymentToggleSwitch.click();
    await this.saveChangesButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async enablePremiumPackageIfNeeded() {
    await this.premiumPackageToggle.waitFor({ state: 'visible' });
    const isToggleEnabled = await this.premiumPackageToggle.isEnabled();
    if (!isToggleEnabled) {
      throw new Error('Premium package toggle is not enabled');
    }
    const isPremiumPackageOn = await this.premiumPackageToggle.isChecked();
    if (!isPremiumPackageOn) {
      await this.premiumPackageToggle.click();
      await this.page.waitForLoadState('networkidle');
      await this.saveChangesButton.waitFor({ state: 'visible' });
    }
  }

  async addInsuranceEntry(name = 'Test Insurance', copay = '20') {
    await this.insuranceInput.fill(name);
    await this.copayInput.type(copay);
    await this.addInsuranceButton.click();
    await this.page.waitForSelector(`div:has-text("${name}${copay}Delete")`, {
      state: 'visible',
    });
  }

  async enablePatientPaymentRemindersIfNeeded() {
    const isRemindersEnabled = (await this.patientPaymentRemindersToggle.getAttribute('aria-checked')) === 'true';
    if (!isRemindersEnabled) {
      await this.patientPaymentRemindersToggle.click();
      await this.page.waitForLoadState('networkidle');
      return true;
    }
    return false;
  }

  async disableSelfPaymentIfNeeded() {
    const isSelfPaymentOn = await this.selfPaymentCheckbox.isChecked();
    if (isSelfPaymentOn) {
      await this.selfPaymentToggleSwitch.click();
      await this.page.waitForLoadState('networkidle');
      const isEnabled = await this.saveChangesButton.isEnabled();
      if (isEnabled) {
        await this.saveChangesButton.click();
      }
      await this.page.waitForLoadState('networkidle');
      return true;
    }
    return false;
  }
}
