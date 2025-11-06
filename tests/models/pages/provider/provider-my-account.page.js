import { BasePage } from '../../base-page.js';
import fs from 'fs';

// Provider My Account Page Object Model
export class MyAccountPage extends BasePage {
  constructor(page) {
    super(page);

    // Page Elements
    this.header = page.getByRole('heading', { name: 'Account settings' });
    this.navigationBar = page.getByText('My accountCalendarNotifications');

    // My Account Section
    this.myAccountLabel = page.getByRole('paragraph').filter({ hasText: 'My account' });
    this.myAccountText = page.getByText('Update and manage your account');
    this.profileIcon = page.getByTestId('avatar').locator('div').nth(1);
    this.profileName = page.getByText('CODY TEST').first();
    this.profileEmail = page.getByText('chuls+providerprod@globalmed.com');
    this.uploadPhotoButton = page.getByRole('button', {
      name: 'Download Upload photo',
    });
    this.deletePhotoButton = page.getByRole('button', {
      name: 'Trash Delete photo',
    }); //Profile Details Section
    this.profileDetailsSection = page.getByText('Profile details');
    this.profileDetailsFirstName = page.getByText('First name');
    this.profileDetailsLastName = page.getByText('Last name');
    this.profileDetailsMedicalSpecialty = page.getByText('Medical specialty');
    this.profileLanguagesSpoken = page.getByText('Languages spoken');
    this.profileCountry = page.getByText('Country');
    this.profileState = page.getByText('State');
    this.profilePhoneNumber = page.getByText('Phone number');
    this.profileDetailsEditButton = page
      .locator('div')
      .filter({ hasText: /^Profile detailsEdit$/ })
      .getByRole('button');

    // License to practice section
    this.licenseToPracticeSection = page.getByText('License to practice');
    this.licenseToPracticeButton = page
      .locator('div')
      .filter({ hasText: /^License to practiceEdit$/ })
      .getByRole('button');

    // Application language section
    this.applicationLanguageSection = page.getByText('Application language');
    this.changeLanguageButton = page.getByRole('link', {
      name: 'Change language',
    });

    // Time zone section
    this.timeZoneSection = page.getByText('Time zone', { exact: true });
    this.changeTimeZoneButton = page.getByRole('link', {
      name: 'Change time zone',
    });

    // Account Deletion Section
    this.accountDeletionSection = page.getByText('Account', { exact: true });
    this.accountDeletionButton = page.getByText('Delete account', {
      exact: true,
    });
    this.accountDeletionModal = page.getByTestId('modal');
    this.accountDeletionHeader = page.getByText('Delete account?');
    this.accountDeleteText = page.getByText('Deleting your account will');
    this.accountDeletionModalXCloseButton = page.getByRole('button', {
      name: 'XClose',
    });
    this.accountDeletionNoCancelButton = page.getByRole('button', {
      name: 'No, cancel',
    });
    this.accountDeletionConfirmButton = page.getByRole('button', {
      name: 'Yes, delete',
    });

    // Edit Profile Modal Elements
    this.editProfileDetailsSlideOut = page.locator('div').filter({ hasText: /^Edit profile details$/ });
    this.editProfileDetailsFirstName = page.getByText('First name*');
    this.editProfileDetailsFirstNameInput = page.getByPlaceholder('First name');
    this.editProfileDetailsLastName = page.getByText('Last name*');
    this.editProfileDetailsLastNameInput = page.getByPlaceholder('Last name');
    this.editProfileDetailsMedicalSpecialty = page.getByText('Medical specialties');
    this.editProfileDetailsLanguagesSpoken = page.getByText('Languages spoken').nth(1);
    this.editProfileDetailsCountry = page.getByText('Country').nth(1);
    this.editProfileDetailsState = page.getByText('State').nth(1);
    this.editProfileDetailsPhoneNumber = page.getByText('Phone number').first();
    this.editProfileDetailsPhoneNumberInput = page.getByRole('textbox', {
      name: '(555) 000-',
    });
    this.editProfileDetailsPhoneNumberExtensionDropdown = page
      .getByTestId('popover-trigger')
      .getByTestId('icon-ChevronDown');
    this.editProfileDetailsPhoneNumberExtensionDropdownOptions = page.getByTestId('items-wrapper');
    this.editProfileSaveButton = page.getByRole('button', {
      name: 'Save changes',
    });
    this.editProfileCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.editProfileSuccessMessage = page.getByText('Profile updated successfully!');

    // Error messages for required fields
    this.editProfileFirstNameRequiredError = page.getByText('First name is required');
    this.editProfileLastNameRequiredError = page.getByText('Last name is required');
    this.editProfileMedicalSpecialtyRequiredError = page.getByText('At least one medical');
    this.editProfileLanguageRequiredError = page.getByText('At least one language is');

    // Medical specialty selection elements
    this.editProfileMedicalSpecialtyDropdownButton = page
      .locator('div')
      .filter({ hasText: /^Allergologist$/ })
      .getByRole('button');
    this.editProfileMedicalSpecialtyDropdownMenu = page
      .locator('div')
      .filter({ hasText: /^Medical specialtiesAngiologist$/ })
      .getByRole('button');
    this.editProfileMedicalSpecialtyCloseTag = page.getByTestId('tag').getByRole('button', { name: 'XClose' });

    // Edit License Modal Elements
    this.editLicenseModal = page.locator('div').filter({ hasText: /^Edit license$/ });
    this.editLicenseModalLicense1 = page.getByText('License 1');
    this.editLicenseModalLicense1Country = page.getByText('Country').nth(1);
    this.editLicenseModalLicense1CountryDropdown = page
      .locator('div')
      .filter({ hasText: /^CountryAfghanistan$/ })
      .getByTestId('custom-select-item-wrapper');
    this.editLicenseModalLicense1CountryDropdownOptions = page.getByTestId('custom-dropdown');
    this.editLicenseModalLicense1State = page.getByText('State').nth(1);
    this.editLicenseModalLicense1StateDropdown = page
      .locator('div')
      .filter({ hasText: /^StateSelect state$/ })
      .getByTestId('custom-select-item-wrapper');
    this.editLicenseModalLicense1StateDropdownOptions = page.getByTestId('custom-dropdown');
    this.editLicenseModalLicense1StateDropdownSelection = page.getByTestId('custom-dropdown-item-Badakhshan');
    this.deleteLicenseButton = page.getByRole('link', {
      name: 'Remove License',
    });
    this.editLicenseAddLicenseButton = page.getByRole('link', {
      name: 'Plus Add license',
    });
    this.editLicenseCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.editLicenseSaveButton = page.getByRole('button', {
      name: 'Save changes',
    });
    this.editLicenseErrorMessageStateRequired = page.getByText('State is required');
  }

  async gotoProviderMyAccount() {
    await this.page.goto(`${process.env.UAT_URL}/account-settings/my-account`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    // Wait for Provider account settings page to load
    await this.header.waitFor({ state: 'visible' });
  }

  // Helper method to open edit license modal
  async openEditLicenseToPracticeModal() {
    try {
      // Try to click the primary button first
      if (await this.licenseToPracticeButton.isVisible()) {
        await this.licenseToPracticeButton.click();
      } else {
        // If primary button isn't visible, try the fallback approach
        const fallbackButton = this.page
          .locator('div')
          .filter({ hasText: /^License to practice$/ })
          .getByRole('button');
        await fallbackButton.waitFor({ state: 'visible', timeout: 5000 });
        await fallbackButton.click();
      }

      // Wait for the modal to be visible
      await this.editLicenseModal.waitFor({ state: 'visible', timeout: 5000 });

      // Check and remove License 3 if it exists
      const removeLicense3Button = this.page.getByRole('link', {
        name: 'Remove License 3',
      });
      if (await removeLicense3Button.isVisible()) {
        await removeLicense3Button.click();
        await this.editLicenseSaveButton.click();

        // Re-open the modal after saving changes
        await this.licenseToPracticeButton.waitFor({
          state: 'visible',
          timeout: 5000,
        });
        await this.licenseToPracticeButton.click();
      }
    } catch (error) {
      console.error('Error opening edit license modal:', error);
      throw new Error(`Failed to open license modal: ${error.message}`);
    }
  }

  // Helper method to open edit profile modal
  async openEditProfileSlideOut() {
    try {
      // Try to click the primary button first
      if (await this.profileDetailsEditButton.isVisible()) {
        await this.profileDetailsEditButton.click();
      } else {
        // If primary button isn't visible, try the fallback approach
        const fallbackButton = this.page
          .locator('div')
          .filter({ hasText: /^Profile details$/ })
          .getByRole('button');
        await fallbackButton.waitFor({ state: 'visible', timeout: 5000 });
        await fallbackButton.click();
      }
    } catch (error) {
      console.error('Error opening edit profile modal:', error);
      throw new Error(`Failed to open edit profile modal: ${error.message}`);
    }
  }

  // Helper method to upload file for avatar
  async uploadFileForAvatar(filePath) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadPhotoButton.click();
    const fileChooser = await fileChooserPromise;

    // Verify the file exists before attempting upload
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at: ${filePath}`);
    }

    await fileChooser.setFiles(filePath);
    await this.page.waitForTimeout(1000); // Allow time for upload process
  }

  // Helper method to select country in edit license modal
  async selectCountryInEditLicense(country) {
    await this.editLicenseModalLicense1CountryDropdown.click();
    await this.page.getByTestId(`custom-dropdown-item-${country}`).click();
  }

  // Helper method to select state in edit license modal
  async selectStateInEditLicense(state) {
    await this.editLicenseModalLicense1StateDropdown.click();
    await this.page.getByTestId(`custom-dropdown-item-${state}`).click();
  }

  // Helper method to fill phone number in edit profile
  async fillPhoneNumberInEditProfile(phoneNumber) {
    await this.editProfileDetailsPhoneNumberInput.clear();
    await this.editProfileDetailsPhoneNumberInput.type(phoneNumber);
  }

  // Helper method to select medical specialty in edit profile
  async selectMedicalSpecialtyInEditProfile(specialty) {
    const medicalSpecialtyDropdown = this.page.getByRole('textbox', {
      name: 'Select medical specialities',
    });
    await medicalSpecialtyDropdown.click();
    await this.page.getByTestId(`custom-dropdown-item-${specialty}`).click();
  }

  // Helper method to select language in edit profile
  async selectLanguageInEditProfile(language) {
    const languagesSpokenDropdown = this.page.getByRole('textbox', {
      name: 'Languages spoken',
    });
    await languagesSpokenDropdown.click();
    await this.page.getByTestId(`custom-dropdown-item-${language}`).click();
  }

  // Helper method to open delete account modal
  async openDeleteAccountModal() {
    await this.accountDeletionButton.click();
  }

  // Helper method to clear all required fields in edit profile
  async clearAllRequiredFieldsInEditProfile() {
    // Clear first name
    await this.editProfileDetailsFirstNameInput.click();
    await this.editProfileDetailsFirstNameInput.fill('');

    // Clear last name
    await this.editProfileDetailsLastNameInput.click();
    await this.editProfileDetailsLastNameInput.fill('');

    // Remove medical specialty selection
    await this.editProfileMedicalSpecialtyDropdownButton.click();
    await this.editProfileMedicalSpecialtyDropdownMenu.click();
    await this.editProfileMedicalSpecialtyCloseTag.click();

    // Attempt to save to trigger validation errors
    await this.editProfileSaveButton.click();
  }
}
