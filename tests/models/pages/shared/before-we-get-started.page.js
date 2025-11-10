import { BasePage } from '../../base-page.js';

export class BeforeWeGetStartedPage extends BasePage {
  constructor(page) {
    super(page);

    // Common Elements
    this.pageTitle = this.page.getByRole('heading', { name: 'Before we get started' });
    this.descriptionText = this.page.getByText('eNOW needs to know a little');
    this.getStartedButton = this.page.getByRole('button', { name: 'Get started' });

    // Name Fields (Common)
    this.firstNameLabel = this.page.getByText('First name*');
    this.firstNameInput = this.page.getByRole('textbox', { name: 'Enter your first name' });
    this.lastNameLabel = this.page.getByText('Last name*');
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Enter your last name' });

    // Validation Messages
    this.firstNameRequiredError = this.page.getByText('First name is required');
    this.firstNameValidationError = this.page.getByText('First name must contain at');
    this.lastNameRequiredError = this.page.getByText('Last name is required');
    this.lastNameValidationError = this.page.getByText('Last name must contain at');

    // Patient-Specific Elements
    this.dobLabel = this.page.getByText('DOB');
    this.dobInput = this.page.getByRole('textbox', { name: 'MM/DD/YYYY' });
    this.sexAssignedAtBirthLabel = this.page.getByText('Sex assigned at birth');

    // Patient Insurance Fields
    this.insuranceInfoHeading = this.page.getByRole('heading', { name: 'Insurance information' });
    this.taxIdLabel = this.page.getByText('Tax ID');
    this.taxIdInput = this.page.getByRole('textbox', { name: 'Tax ID' });
    this.insurancePolicyNumberLabel = this.page.getByText('Insurance policy number');
    this.insurancePolicyNumberInput = this.page.getByRole('textbox', { name: 'Insurance policy number' });
    this.insuranceLabel = this.page.getByText('Insurance', { exact: true });
    this.insuranceInput = this.page.getByRole('textbox', { name: 'Insurance', exact: true });

    // Provider-Specific Elements
    this.languagesSpokenHeading = this.page.getByRole('heading', { name: 'Languages spoken' });
    this.englishLanguageOption = this.page.getByRole('paragraph').filter({ hasText: 'English' });
    this.languageDropdown = this.page.getByTestId('custom-dropdown');
    this.medicalSpecialtyLabel = this.page.getByText('Medical speciality');
    this.licensesToPracticeHeading = this.page.getByRole('heading', { name: 'Licenses to practice' });

    // License Management Elements
    this.addLicenseButton = this.page.getByRole('link', { name: 'Plus Add license' });
    this.removeLicenseButton = this.page.getByRole('link', { name: 'Remove License' });
    this.license2Text = this.page.getByText('License 2');
    this.selectCountryDropdown = this.page.locator('div').filter({ hasText: /^Select country$/ });
    this.selectStateDropdown = this.page.locator('div').filter({ hasText: /^Select state$/ });
    this.afghanistanOption = this.page.getByTestId('custom-dropdown-item-Afghanistan');
    this.badakhshanOption = this.page.getByText('Badakhshan');

    // Device ID-Specific Elements
    this.profileDetailsHeading = this.page.getByRole('heading', { name: 'Profile details' });
    this.nameLabel = this.page.getByText('Name*'); // Device ID uses single name field
    this.deviceIdLabel = this.page.getByText('Device ID*');
    this.deviceIdInput = this.page.getByRole('textbox', { name: '123' });
    this.nameRequiredError = this.page.getByText('Name is required');
    this.deviceIdRequiredError = this.page.getByText('Device ID is required');

    // Timezone Elements
    this.timezoneHeading = this.page.getByRole('heading', { name: 'Time zone' });
    this.changeTimezoneLink = this.page.getByRole('link', { name: 'Change time zone' });
    this.noTimezoneSelectedText = this.page.getByText('No timezone selected');

    // Spanish Elements
    this.spanishPageTitle = this.page.getByRole('heading', { name: 'Antes de empezar' });
  }

  async navigateToOnboarding() {
    await this.goto('https://xj9.sandbox-encounterservices.com/first-login/participant-form');
    // await this.pageTitle.waitFor({ state: 'visible' });
  }

  // Common form actions
  async fillFirstName(firstName) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  async clearFirstName() {
    await this.firstNameInput.clear();
  }

  async clearLastName() {
    await this.lastNameInput.clear();
  }

  async submitForm() {
    await this.getStartedButton.click();
  }

  // Patient-specific actions
  async fillPatientForm(firstName, lastName, dob = null) {
    if (firstName) await this.fillFirstName(firstName);
    if (lastName) await this.fillLastName(lastName);
    if (dob) await this.dobInput.fill(dob);
  }

  async fillPatientInsuranceInfo(taxId, policyNumber, insurance) {
    if (taxId) await this.taxIdInput.fill(taxId);
    if (policyNumber) await this.insurancePolicyNumberInput.fill(policyNumber);
    if (insurance) await this.insuranceInput.fill(insurance);
  }

  // Provider-specific actions
  async selectLanguage() {
    await this.englishLanguageOption.click();
  }

  async addLicense() {
    await this.addLicenseButton.click();
  }

  async removeLicense() {
    await this.removeLicenseButton.click();
  }

  async selectCountryAndState(projectName) {
    if (projectName === 'auth-chrome') {
      // Desktop flow
      await this.addLicenseButton.click();
      await this.selectCountryDropdown.nth(1).click();
      await this.afghanistanOption.click();
      await this.page.getByText('Afghanistan').click();
      await this.selectStateDropdown.first().click();
      await this.badakhshanOption.click();
    } else if (projectName === 'auth-chrome-mobile' || projectName === 'auth-safari-mobile') {
      // Mobile flow
      await this.addLicenseButton.click();
      await this.selectCountryDropdown.nth(1).click();
      await this.page
        .locator('div')
        .filter({ hasText: /^Afghanistan$/ })
        .click();
      await this.page.locator('div:nth-child(2) > .sc-cnQhix > .sc-kGRgbs').first().click();
      await this.page
        .locator('div')
        .filter({ hasText: /^Badakhshan$/ })
        .click();
    }
  }

  // Device ID-specific actions
  async fillDeviceIdForm(name, deviceId) {
    if (name) await this.firstNameInput.fill(name);
    if (deviceId) await this.deviceIdInput.fill(deviceId);
  }

  async clearDeviceIdName() {
    await this.firstNameInput.fill('');
  }

  async clearDeviceId() {
    await this.deviceIdInput.fill('');
  }

  // Form validation actions
  async validateFirstNameField(validName, invalidName) {
    // Test required field
    await this.firstNameInput.click();
    await this.clearFirstName();

    // Test invalid characters
    await this.fillFirstName(invalidName);

    // Test valid input
    await this.clearFirstName();
  }

  async validateLastNameField(validName, invalidName) {
    // Test required field
    await this.lastNameInput.click();
    await this.clearLastName();

    // Test invalid characters
    await this.fillLastName(invalidName);

    // Test valid input
    await this.clearLastName();
  }

  async ensurePageIsEnglish() {
    await this.page.waitForTimeout(1000); // wait for 1 second to ensure page is loaded
    if (await this.pageTitle.isVisible()) {
      // Do nothing if English page is already visible
      return;
    } else {
      await this.page.locator('._trigger_16dmk_15 > div > svg').click();
      await this.page.getByTestId('custom-dropdown-item-Inglés').click();
      await this.page.locator('._trigger_16dmk_15 > div > svg').click();
    }
  }

  async ensurePageIsSpanish() {
    if (await this.spanishPageTitle.isVisible()) {
      // Do nothing if Spanish page is already visible
      return;
    } else {
      await this.page.locator('._trigger_16dmk_15 > div > svg').click();
      await this.page.getByTestId('custom-dropdown-item-Spanish').click();
      await this.page.locator('._trigger_16dmk_15 > div > svg').click();
    }
  }
}
