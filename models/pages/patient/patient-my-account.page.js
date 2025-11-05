import { BasePage } from '../../base-page.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MyAccountPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Main page elements
        this.header = page.getByRole('heading', { name: 'Account settings' });
        this.myAccountButton = page.getByRole('button', { name: 'My account' });
        this.notificationsButton = page.getByRole('button', { name: 'Notifications' });
        this.myAccountText = page.getByText('Update and manage your account');
        
        // Profile section
        this.profileIcon = page.getByTestId('avatar');
        this.profileIconUploadButton = page.getByRole('button', { name: 'Download Upload photo' });
        this.profileIconDeleteButton = page.getByRole('button', { name: 'Trash Delete photo' });
        this.profileIconSuccessMessage = page.getByText('Photo picture uploaded successfully.');
        this.deleteProfilePictureSuccessMessage = page.getByText('Profile picture deleted successfully.');
        this.editProfileButton = page.getByRole('button', { name: 'Edit Edit' });
        this.profileUpdatedSuccessMessage = page.getByText('Profile updated').first();
        
        // Profile information labels
        this.firstNameText = page.getByText('First name');
        this.lastNameText = page.getByText('Last name');
        this.dobText = page.getByText('DOB');
        this.genderText = page.getByText('Sex assigned at birth');
        this.phoneNumberText = page.getByText('Phone number');
        
        // Edit profile modal elements
        this.editProfileDetailsModal = page.getByRole('dialog');
        this.editProfileDetailsModalXCloseButton = page.getByRole('button', { name: 'XClose' });
        this.editProfileDetailsModalHeader = page.getByText('Edit profile details');
        this.editProfileDetailsModalFirstNameInput = page.getByRole('textbox', { name: 'First name' });
        this.editProfileDetailsModalLastNameInput = page.getByRole('textbox', { name: 'Last name' });
        this.editProfileDetailsModalDOBInput = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
        this.editProfileDetailsModalGenderSelect = page.getByTestId('custom-select-item-wrapper').first();
        this.editProfileDetailsModalSaveButton = page.getByRole('button', { name: 'Save changes' });
        this.editProfileDetailsModalCancelButton = page.getByRole('button', { name: 'Cancel' });
        
        // Taxes
        this.taxIdText = page.getByText('Tax ID');
        this.taxIdInput = page.getByRole('textbox', { name: 'Tax ID' });
        this.taxIdFieldError = page.getByText('Field must contain only');

        // Insurance
        this.insuranceText = page.getByText('Insurance', { exact: true });
        this.insuranceInput = page.getByRole('textbox', { name: 'Insurance' });
        this.insuranceFieldError = page.locator('div').filter({ hasText: /^InsuranceField must contain only numbers and letters$/ }).getByRole('paragraph');

        this.insurancePolicyNumberText = page.getByText('Insurance policy number');
        this.insurancePolicyNumberInput = page.getByRole('textbox', { name: 'Insurance policy number' });
        this.insurancePolicyNumberFieldError = page.getByText('Field must contain only numbers, letters and symbols \'-\' and \'/\'');

        // Language section
        this.applicationLanguageSection = page.getByText('Application language');
        this.changeLanguageButton = page.getByRole('link', { name: 'Change language' });
        this.changeLanguageModal = page.getByTestId('modal');
        
        // Time zone section
        this.timeZoneSection = page.getByText('Time zone', { exact: true });
        this.timeZoneChangeButton = page.getByRole('link', { name: 'Change time zone' });
        
        // Account deletion section
        this.accountDeletionSection = page.getByText('Account', { exact: true });
        this.accountDeletionButton = page.getByText('Delete account');
        this.accountDeletionModal = page.getByTestId('modal');
        this.accountDeletionHeader = page.getByText('Delete account?');
        this.accountDeletionNoCancelButton = page.getByRole('button', { name: 'No, cancel' });
        this.accountDeletionConfirmButton = page.getByRole('button', { name: 'Yes, delete' });
    }

    // Navigation method
    async gotoAccountSettings() {
        await this.page.goto(`${process.env.PROD_URL}/account-settings/my-account`);
        await this.waitForSpinnerToDisappear();
        await this.header.waitFor({ state: 'visible' });
    }

    // Multi-step action methods that warrant POM inclusion
    async openEditProfileModal() {
        await this.editProfileButton.click();
        await this.editProfileDetailsModal.waitFor({ state: 'visible' });
    }

    async uploadPhoto(filePath) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.profileIconUploadButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
        // Wait for upload to complete
        await this.page.waitForSelector('button:has-text("Uploading...")', { state: 'detached', timeout: 10000 });
    }

    async openDeleteAccountModal() {
        await this.accountDeletionButton.click();
        await this.accountDeletionModal.waitFor({ state: 'visible' });
    }

    async openChangeLanguageModal() {
        await this.changeLanguageButton.click();
        await this.changeLanguageModal.waitFor({ state: 'visible' });
    }

    async fillEditProfileForm(firstName, lastName, dob) {
        if (firstName) await this.editProfileDetailsModalFirstNameInput.fill(firstName);
        if (lastName) await this.editProfileDetailsModalLastNameInput.fill(lastName);
        if (dob) await this.editProfileDetailsModalDOBInput.fill(dob);
    }

    async saveEditProfileChanges() {
        await this.editProfileDetailsModalSaveButton.click();
        await this.editProfileDetailsModal.waitFor({ state: 'hidden' });
    }

    async cancelEditProfileChanges() {
        await this.editProfileDetailsModalCancelButton.click();
        await this.editProfileDetailsModal.waitFor({ state: 'hidden' });
    }

    async fillInsurancePolicyNumber(policyNumber) {
        await this.insurancePolicyNumberInput.click();
        await this.insurancePolicyNumberInput.fill(policyNumber);
    }

    async fillInsurance(insurance) {
        await this.insuranceInput.nth(1).click();
        await this.insuranceInput.nth(1).fill(insurance);
    }

    async fillTaxId(taxId) {
        await this.taxIdInput.click();
        await this.taxIdInput.fill(taxId);
    }
}
