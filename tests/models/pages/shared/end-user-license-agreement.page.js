import { BasePage } from '../../base-page.js';

export class EndUserLicenseAgreementPage extends BasePage {
  constructor(page) {
    super(page);

    // EULA Page Elements
    this.pageTitle = this.page.getByRole('heading', { name: 'End user license agreement' });
    this.chevronDownIcon = this.page.getByTestId('icon-ChevronDown');
    this.acceptButton = this.page.getByRole('button', { name: 'Accept' });
    this.declineButton = this.page.getByRole('button', { name: 'Decline' });

    // Decline Modal Elements
    this.declineModal = this.page.getByTestId('modal');
    this.declineModalTitle = this.page.getByText('Decline user license');
    this.cancelButton = this.page.getByRole('button', { name: 'No, cancel' });
    this.confirmDeclineButton = this.page.getByRole('button', { name: 'Yes, decline' });
    this.confirmDeclineButtonSpanish = this.page.getByRole('button', { name: 'Sí, rechazar' });

    // Spanish EULA Elements
    this.spanishPageTitle = this.page.getByRole('heading', { name: 'Acuerdo de licencia de usuario final' });
    this.spanishAcceptButton = this.page.getByRole('button', { name: 'Aceptar' });
    this.spanishDeclineButton = this.page.getByRole('button', { name: 'Rechazar' });

    // Language Dropdown Elements
    this.spanishLanguageOption = this.page.getByTestId('custom-dropdown-item-Spanish');
    this.englishLanguageOptionSpanish = this.page.getByTestId('custom-dropdown-item-Inglés');
    this.englishLanguageOption = this.page.getByTestId('custom-dropdown-item-English');

    // Dashboard Elements (for verification in tests)
    this.upcomingAppointmentsHeading = this.page.getByRole('heading', { name: 'Upcoming appointments' });
    this.upcomingAppointmentsHeadingSpanish = this.page.getByRole('heading', { name: 'Próximas citas' });

    // Device User Profile Elements (for device ID tests only)
    this.deviceProfileIcon = this.page
      .getByTestId('popover-trigger')
      .getByTestId('avatar')
      .locator('div')
      .filter({ hasText: 'H' })
      .locator('div');
    this.logoutButton = this.page.getByRole('button', { name: 'LogOut Log out' });
    this.logoutButtonSpanish = this.page.getByRole('button', { name: 'LogOut Cerrar sesión' });

    // Device ID Elements (for device ID tests only)
    this.deviceIdInput = this.page.getByRole('textbox', { name: '1234' });
    this.verifyDeviceIdButton = this.page.getByRole('button', { name: 'Verify Device ID' });
    this.verifyDeviceIdButtonSpanish = this.page.getByRole('button', { name: 'Verificar id. de dispositivo' });
  }

  async navigateToEula() {
    await this.goto('https://xj9.sandbox-encounterservices.com/first-login');
  }

  async acceptEula() {
    await this.acceptButton.waitFor({ state: 'visible' });
    await this.acceptButton.click();
  }

  async declineEula() {
    await this.declineButton.waitFor({ state: 'visible' });
    await this.declineButton.click();
    await this.declineModal.waitFor({ state: 'visible' });
    await this.confirmDeclineButton.click();
  }

  async cancelDeclineEula() {
    await this.declineButton.waitFor({ state: 'visible' });
    await this.declineButton.click();
    await this.declineModal.waitFor({ state: 'visible' });
    await this.cancelButton.click();
  }

  async acceptSpanishEula() {
    await this.spanishAcceptButton.waitFor({ state: 'visible' });
    await this.spanishAcceptButton.click();
  }

  async declineSpanishEula() {
    await this.spanishDeclineButton.waitFor({ state: 'visible' });
    await this.spanishDeclineButton.click();
    await this.declineModal.waitFor({ state: 'visible' });
    await this.confirmDeclineButtonSpanish.click();
  }

  async changeLanguageToSpanish() {
    // If Acuerdo de licencia de usuario final is visible
    if (await this.spanishPageTitle.isVisible()) {
      // Do nothing
    } else {
      await this.chevronDownIcon.click();
      await this.spanishLanguageOption.click();
      await this.chevronDownIcon.click();
      await this.acceptSpanishEula();
      await this.page.waitForTimeout(1000);
      await this.navigateToEula();
    }
  }

  async changeLanguageToEnglish() {
    // If Upcoming appointments is visible
    if (await this.pageTitle.isVisible()) {
      // Do nothing
    } else {
      await this.chevronDownIcon.click();
      await this.englishLanguageOption.click();
      await this.chevronDownIcon.click();
      await this.acceptEula();
      await this.page.waitForTimeout(1000);
      await this.navigateToEula();
    }
  }

  async changeLanguageToEnglishFromSpanish() {
    await this.chevronDownIcon.click();
    await this.englishLanguageOptionSpanish.click();
    await this.page.waitForTimeout(1000);
  }

  // Multi-step device ID actions (3+ steps)
  async performDeviceIdLogin(deviceId) {
    await this.deviceIdInput.click();
    await this.deviceIdInput.fill(deviceId);
    await this.verifyDeviceIdButton.click();
  }

  async performDeviceIdLoginSpanish(deviceId) {
    await this.deviceIdInput.click();
    await this.deviceIdInput.fill(deviceId);
    await this.verifyDeviceIdButtonSpanish.click();
  }

  async logoutDevice() {
    await this.deviceProfileIcon.click();
    await this.logoutButton.click();
  }

  async logoutDeviceSpanish() {
    await this.deviceProfileIcon.click();
    await this.logoutButtonSpanish.click();
  }
}
