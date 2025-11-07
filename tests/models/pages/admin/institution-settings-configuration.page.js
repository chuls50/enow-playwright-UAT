import { BasePage } from '../../base-page.js';

export class InstitutionSettingsConfigurationPage extends BasePage {
  constructor(page) {
    super(page);

    // Settings Navigation
    this.institutionSettingsTab = page.locator('a').filter({ hasText: 'Institution Settings' });
    this.configurationSection = page.getByRole('button', { name: 'Configuration' });
    this.insurancePaymentsSection = page.getByRole('button', { name: 'Insurance & Payments' });

    // Configuration Page Elements
    this.heading = page.getByRole('heading', { name: 'Product Configuration' });

    // Enforce Country / State Licensing Toggle
    this.enforceCountryText = page.getByText('Enforce Country / State Licensing on Provider Lists Enabled');
    this.enforceCountryToggle = page
      .locator('label')
      .filter({
        hasText: 'Enforce Country / State Licensing on Provider Lists Enabled',
      })
      .getByTestId('switch-div');

    // Waiting Room toggle
    this.waitingRoomOptionText = page.getByText('Waiting Room Option');
    this.waitingRoomOptionToggle = page.locator('label').filter({ hasText: 'Waiting Room Option' }).getByTestId('switch-div');
    this.waitingRoomOptionDescription = page.getByText('When this value is set, users joining an appointment will be in a waiting room');

    // Dispatcher Option toggle
    this.dispatcherOptionText = page.getByText('Dispatcher Option');
    this.dispatcherOptionToggle = page.locator('label').filter({ hasText: 'Dispatcher Option' }).getByTestId('switch-div');

    // Enable Chat Appointments toggle
    this.enableChatAppointmentsText = page.getByText('Enable Chat Appointment Types');
    this.enableChatAppointmentsToggle = page
      .locator('label')
      .filter({ hasText: 'Enable Chat Appointment Types' })
      .getByTestId('switch-div');
    this.enableChatAppointmentsDescription = page.getByText('When this value is set, users will be able to');

    // Input Fields
    this.numberOfTimesToContactText = page.getByText('Number of Times to Contact Available Providers', { exact: true });
    this.numberOfTimesToContactInput = page.getByRole('textbox', { name: 'Number of Times to Contact' });

    this.numberOfMinutesText = page.getByText('Number of Minutes Before Re-');
    this.numberOfMinutesInput = page.getByRole('textbox', { name: 'Number of Minutes Before Re-' });

    // Buttons
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    // Error Messages
    this.formErrorMessage = page.getByText('Please fix the errors in the form.');
    this.zeroValueErrorMessage = page.getByText('The number cannot be less than or equal to zero');
  }

  // Navigation Methods
  async gotoInstitutionSettingsConfiguration() {
    await this.page.goto(`${process.env.UAT_URL}/institution-settings`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    await this.institutionSettingsTab.click();
    await this.configurationSection.click();
    await this.page.waitForLoadState('networkidle');
    await this.heading.waitFor({ state: 'visible' });
  }

  // Helper Methods - Only for complex multi-step operations
  async getToggleStates() {
    return {
      enforceCountry: await this.enforceCountryToggle.isChecked(),
      waitingRoom: await this.waitingRoomOptionToggle.isChecked(),
      dispatcher: await this.dispatcherOptionToggle.isChecked(),
      chatAppointments: await this.enableChatAppointmentsToggle.isChecked(),
    };
  }

  async getInputValues() {
    return {
      timesToContact: await this.numberOfTimesToContactInput.inputValue(),
      minutes: await this.numberOfMinutesInput.inputValue(),
    };
  }

  // Complex business logic method for setting up test state
  async ensureWaitingRoomIsOn() {
    const isCurrentlyOn = await this.waitingRoomOptionToggle.isChecked();
    if (!isCurrentlyOn) {
      await this.waitingRoomOptionToggle.click();
    }
    if (await this.saveChangesButton.isEnabled()) {
      await this.saveChangesButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async ensureChatAppointmentsAreOn() {
    const isCurrentlyOn = await this.enableChatAppointmentsToggle.isChecked();
    if (!isCurrentlyOn) {
      await this.enableChatAppointmentsToggle.click();
    }
    if (await this.saveChangesButton.isEnabled()) {
      await this.saveChangesButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  // Complex validation workflow - justifies being in POM due to multiple steps
  async performZeroValidationFlow() {
    await this.numberOfTimesToContactInput.fill('0');
    await this.numberOfMinutesInput.fill('0');
    await this.page.waitForTimeout(500); // Wait for input to process
    await this.saveChangesButton.click();
    await this.page.waitForTimeout(1000); // Wait for validation to appear
  }
}
