import { BasePage } from '../../base-page.js';

export class InstitutionSettingsProfilePage extends BasePage {
    constructor(page) {
        super(page);

        // Main Navigation
        this.usersTab = page.locator('a').filter({ hasText: 'Users' });

        // Institution Settings
        this.institutionSettingsText = page.locator('h2').filter({ hasText: 'Institution settings' });
        this.nameField = page.getByText('Institution name*');
        this.nameInput = page.getByRole('textbox', { name: 'Example Name' });
        this.registrationLinkText = page.getByText('Patient Registration Link');
        this.registrationLink = page.getByRole('link', { name: 'https://portal.encounterservices.com/signup/INSLT885R9TQMF8T68OU75M' });
        this.registrationLinkCopyButton = page.getByRole('button', { name: 'Copy link' }).first();
        this.registrationLinkCopiedMessage = page.getByText('Link successfully copied');
        this.deviceIDAccessLinkText = page.getByText('Device ID Access Link');
        this.deviceIDAccessLink = page.getByRole('link', { name: 'https://portal.encounterservices.com/login/device' });
        this.deviceIDAccessLinkCopyButton = page.getByRole('button', { name: 'Copy link' }).nth(1);
        this.deviceIDAccessLinkCopiedMessage = page.getByText('Link successfully copied');
        this.phoneNumberText = page.getByText('Phone number').first();
        this.phoneNumberInput = page.locator('input[name="phone\\.number"]');
        this.phoneNumberDropdown = page.locator('.sc-dMpJUC').first();

        // Institution Address
        this.institutionAddressText = page.getByRole('heading', { name: 'Institution Address' });
        this.institutionAddressInput = page.locator('input[name="address1"]');
        this.institutionAptSuiteEtcText = page.getByText('Apt, Suite, Etc').first();
        this.institutionAptSuiteEtcInput = page.locator('input[name="address2"]');
        this.institutionAddressZipCodeText = page.getByText('ZIP code').first();
        this.institutionAddressZipCodeInput = page.locator('input[name="zip"]');
        this.institutionAddressCityText = page.getByText('City').first();
        this.institutionAddressCityInput = page.locator('input[name="city"]');
        this.institutionAddressCountryText = page.getByText('Country').first();
        this.institutionAddressCountryDropdown = page.getByTestId('custom-select-item-wrapper').first();
        this.institutionAddressStateText = page.getByText('State').first();
        this.institutionAddressStateDropdown = page.getByTestId('custom-select-item-wrapper').nth(1);
        
        // Institution Address Dropdown Selections (working locators)
        this.countryDropdownAfghanistan = page.locator('div').filter({ hasText: /^CountryAfghanistan$/ }).getByTestId('custom-select-item-wrapper');
        this.countryDropdownAlbania = page.locator('div').filter({ hasText: /^CountryAlbania$/ }).getByTestId('custom-select-item-wrapper');
        this.stateDropdownAfterCountrySelection = page.getByTestId('custom-select-item-wrapper').nth(2);
        this.afghanistanCountryOption = page.getByTestId('custom-dropdown-item-Afghanistan');
        this.albaniaCountryOption = page.getByTestId('custom-dropdown-item-Albania');
        this.badakhshanStateOption = page.getByTestId('custom-dropdown-item-Badakhshan');
        this.beratStateOption = page.getByTestId('custom-dropdown-item-Berat');
        this.diberStateOption = page.getByTestId('custom-dropdown-item-Diber');

        // POC Details
        this.pocDetailsText = page.getByRole('heading', { name: 'POC Details' });
        this.pocNameText = page.getByText('Name', { exact: true });
        this.pocNameInput = page.getByRole('textbox', { name: 'John Doe' });
        this.pocTitleText = page.getByText('Title');
        this.pocTitleInput = page.getByRole('textbox', { name: 'Title example' });
        this.pocPhoneNumberText = page.getByText('Phone number*');
        this.pocPhoneNumberInput = page.locator('input[name="pocSettings\\.phone\\.number"]');
        this.pocPhoneNumberDropdown = page.getByText('US (+1)').nth(1);
        this.pocEmailText = page.getByText('Email*');
        this.pocEmailInput = page.getByRole('textbox', { name: 'example@mail.com' });

        // POC Address
        this.pocAddressText = page.getByRole('heading', { name: 'POC Address' });
        this.pocAddressInput = page.locator('input[name="pocSettings\\.street"]');
        this.pocAptSuiteEtcText = page.getByText('Apt, Suite, Etc').nth(1);
        this.pocAptSuiteEtcInput = page.locator('input[name="pocSettings\\.address"]')
        this.pocZipCodeText = page.getByText('ZIP code').nth(1);
        this.pocZipCodeInput = page.locator('input[name="pocSettings\\.zip"]');
        this.pocCityText = page.getByText('City').nth(1);
        this.pocCityInput = page.locator('input[name="pocSettings\\.city"]');
        this.pocCountryText = page.getByText('Country').nth(1);
        this.pocCountryDropdown = page.locator('div').filter({ hasText: /^CountryUnited States of America$/ }).getByTestId('custom-select-item-wrapper');
        this.pocCountryDropdownSelection = page.getByTestId('custom-dropdown-item-United States of America').getByText('United States of America');
        this.pocStateText = page.getByText('State').nth(2);
        this.pocStateDropdown = page.getByTestId('custom-select-item-wrapper').nth(4);
        this.pocStateDropdownSelection = page.getByTestId('custom-dropdown-item-Arizona');

        // Buttons
        this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });

        // Success and Error Messages
        this.successMessage = page.getByText('Info updated successfully');
        this.errorMessage = page.getByText('Please fix the errors in the form');
        this.requiredFieldError = page.getByText('This field is required');
        this.invalidEmailError = page.getByText('Email fields can only include alphanumeric characters');
        this.invalidTextFieldError = page.getByText('Text fields can include alphanumeric characters');
    }

    async gotoInstitutionSettingsProfile() {
        await this.page.goto(`${process.env.PROD_URL}/institution-settings`);
        await this.waitForSpinnerToDisappear();
        await this.page.waitForLoadState('networkidle');
        await this.institutionSettingsText.waitFor({ state: 'visible' });
    }

    // Helper methods for multi-step actions
    async fillPOCDetails(details) {
        await this.pocNameInput.fill(details.name);
        await this.pocTitleInput.fill(details.title);
        await this.pocEmailInput.fill(details.email);
        await this.pocPhoneNumberInput.fill(details.phone);
        await this.pocAddressInput.fill(details.address);
        await this.pocZipCodeInput.fill(details.zip);
        await this.pocCityInput.fill(details.city);
    }

    async selectPOCCountryAndState() {
        await this.pocCountryDropdown.click();
        await this.pocCountryDropdownSelection.click();
        await this.pocStateDropdown.click();
        await this.pocStateDropdownSelection.click();
    }

    async clearPOCDetails() {
        await this.pocNameInput.fill('');
        await this.pocTitleInput.fill('');
        await this.pocEmailInput.fill('');
        await this.pocPhoneNumberInput.fill('');
        await this.pocAddressInput.fill('');
        await this.pocZipCodeInput.fill('');
        await this.pocCityInput.fill('');
    }
}
