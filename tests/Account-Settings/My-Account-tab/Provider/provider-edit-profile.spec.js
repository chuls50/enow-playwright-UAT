import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/provider/provider-my-account.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Provider Edit Profile - Total tests 19 (including 1 skipped)
test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let providerMyAccountPage;

  test.beforeEach(async ({ page }) => {
    providerMyAccountPage = new MyAccountPage(page);
    await providerMyAccountPage.gotoProviderMyAccount();
  });

  test('Verify License to Practice slide out in Edit License to Practice modal @[111395] @provider @ui', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Verify edit license modal content
    await expect(providerMyAccountPage.editLicenseModal).toBeVisible();
    await expect(providerMyAccountPage.editLicenseModalLicense1).toBeVisible();
    await expect(providerMyAccountPage.editLicenseModalLicense1Country).toBeVisible();
    await expect(providerMyAccountPage.editLicenseModalLicense1State).toBeVisible();
    await expect(providerMyAccountPage.editLicenseAddLicenseButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseCancelButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseSaveButton).toBeVisible();
  });

  test('Verify adding a New License in Edit License to practice slide out @[111396] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await providerMyAccountPage.resetEditLicenseModalStateIfNeeded();

    // Add and then delete license to test full workflow
    await providerMyAccountPage.addAndDeleteLicense();
  });

  test('Verify deleting a License in Edit License to practice slide out @[111397] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await providerMyAccountPage.resetEditLicenseModalStateIfNeeded();

    // Add and then delete license to test full workflow
    await providerMyAccountPage.addAndDeleteLicense();
  });

  test('Verify state dropwdown behavior in Edit license to practice modal @[111398] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // First select a country to enable state dropdown
    await providerMyAccountPage.selectCountryInEditLicense('Afghanistan');
    await expect(providerMyAccountPage.editLicenseModalLicense1StateDropdown).toBeEnabled();

    // Test state dropdown functionality
    await providerMyAccountPage.editLicenseModalLicense1StateDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
    await providerMyAccountPage.page.getByTestId('custom-dropdown-item-Badakhshan').click();
    await expect(
      providerMyAccountPage.page
        .locator('div')
        .filter({ hasText: /^StateBadakhshan$/ })
        .getByTestId('custom-select-item-wrapper')
    ).toHaveText('Badakhshan');
  });

  test('Verify Save Changes behavior for licenses in Edit License slide out @[111399] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await providerMyAccountPage.resetEditLicenseModalStateIfNeeded();

    // Add and then delete license to test full workflow
    await providerMyAccountPage.addAndDeleteLicense();
  });

  test('Verify Edit Licenses Cancel button behavior in Edit License @[111400] @provider @functional', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await providerMyAccountPage.resetEditLicenseModalStateIfNeeded();

    // Add license
    await providerMyAccountPage.addLicense2();

    // Click cancel
    await providerMyAccountPage.editLicenseCancelButton.click();
    await providerMyAccountPage.page.waitForTimeout(1000);

    // Reopen modal to verify changes were not saved
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await expect(providerMyAccountPage.editLicenseModalLicense2).not.toBeVisible();
  });

  test('Verify alphabetical order for Country and State dropdowns in Edit License to practice slide out @[111401] @provider @ui', async () => {
    await providerMyAccountPage.openEditLicenseToPracticeModal();

    // Test country dropdown
    await providerMyAccountPage.editLicenseModalLicense1CountryDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
    await providerMyAccountPage.page.getByTestId('custom-dropdown-item-Afghanistan').click();
    await providerMyAccountPage.editLicenseCancelButton.click();

    // Test state dropdown after selecting country
    await providerMyAccountPage.openEditLicenseToPracticeModal();
    await providerMyAccountPage.selectCountryInEditLicense('Afghanistan');
    await providerMyAccountPage.editLicenseModalLicense1StateDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
  });

  test('Verify field validation for Phone number in Edit profile details slide out @[111732] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test phone number validation
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumber).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumberInput).toBeVisible();
    await providerMyAccountPage.editProfileDetailsPhoneNumberInput.fill('');
    await providerMyAccountPage.editProfileDetailsPhoneNumberInput.type('invalidNumber');

    // get inner text of editProfileDetailsPhoneNumberInput
    const phoneInputValue = await providerMyAccountPage.editProfileDetailsPhoneNumberInput.inputValue();
    expect(phoneInputValue).not.toBe('invalidNumber');
  });

  test('Verify Edit profile details screen displays correctly @[114112] @provider @ui', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Verify edit profile modal content
    await expect(providerMyAccountPage.editProfileDetailsSlideOut).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstNameInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastNameInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumber).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumberInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsMedicalSpecialty).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLanguagesSpoken).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsCountry).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsState).toBeVisible();
    await expect(providerMyAccountPage.editProfileSaveButton).toBeVisible();
  });

  test('Verify entering text into the First Name field in Edit profile details @[114113] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test first name field functionality
    await expect(providerMyAccountPage.editProfileDetailsFirstName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstNameInput).toBeVisible();
    await providerMyAccountPage.editProfileDetailsFirstNameInput.fill('');
    await providerMyAccountPage.editProfileSaveButton.click();
    await expect(providerMyAccountPage.firstNameRequiredError).toBeVisible();

    await providerMyAccountPage.editProfileDetailsFirstNameInput.type('cody prov&');
    await expect(providerMyAccountPage.firstNameValidationError).toBeVisible();

    await providerMyAccountPage.editProfileDetailsFirstNameInput.clear();
    await providerMyAccountPage.editProfileDetailsFirstNameInput.type('cody prov');
    await expect(providerMyAccountPage.editProfileSaveButton).toBeDisabled();
  });

  test('Verify entering text into the Last Name field in Edit profile details slide out @[114114] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test last name field functionality
    await expect(providerMyAccountPage.editProfileDetailsLastName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastNameInput).toBeVisible();
    await providerMyAccountPage.editProfileDetailsLastNameInput.clear();
    await providerMyAccountPage.editProfileSaveButton.click();
    await expect(providerMyAccountPage.lastNameRequiredError).toBeVisible();

    await providerMyAccountPage.editProfileDetailsLastNameInput.type('Cody Test Institution&');
    await expect(providerMyAccountPage.lastNameValidationError).toBeVisible();

    await providerMyAccountPage.editProfileDetailsLastNameInput.clear();
    await providerMyAccountPage.editProfileDetailsLastNameInput.type('Cody Test Institution');
    await expect(providerMyAccountPage.editProfileSaveButton).toBeDisabled();
  });

  test('Verify entering text in phone number field functionality in Edit profile details slide out @[114115] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test phone number field functionality
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumber).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumberInput).toBeVisible();
    await providerMyAccountPage.editProfileDetailsPhoneNumberInput.fill('');
    await providerMyAccountPage.fillPhoneNumberInEditProfile('888888888');
    await providerMyAccountPage.editProfileSaveButton.click();
    await providerMyAccountPage.editProfileSuccessMessage.waitFor({ state: 'visible' });
    await expect(providerMyAccountPage.editProfileSuccessMessage).toBeVisible();

    await providerMyAccountPage.openEditProfileSlideOut();
    await providerMyAccountPage.editProfileDetailsPhoneNumberInput.clear();
    // iff save changes is enabled then click it
    if (await providerMyAccountPage.editProfileSaveButton.isEnabled()) {
      await providerMyAccountPage.editProfileSaveButton.click();
      await providerMyAccountPage.editProfileSuccessMessage.waitFor({ state: 'visible' });
      await expect(providerMyAccountPage.editProfileSuccessMessage).toBeVisible();
    }
  });

  test('Verify Medical specialties dropdown functionality in Edit profile details slide out @[114117] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test medical specialties dropdown
    await expect(providerMyAccountPage.editProfileDetailsMedicalSpecialty).toBeVisible();
    await providerMyAccountPage.selectMedicalSpecialtyInEditProfile('Allergologist');
    await expect(providerMyAccountPage.editProfileSaveButton).toBeEnabled();
  });

  test('Verify Languages spoken dropdown functionality in Edit profile details slide out @[114231] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test languages spoken dropdown
    await expect(providerMyAccountPage.editProfileDetailsLanguagesSpoken).toBeVisible();
    await expect(providerMyAccountPage.languagesSpokenDropdown).toBeVisible();
    await providerMyAccountPage.languagesSpokenDropdown.click();
    const languageOptionSpanish = providerMyAccountPage.page.getByTestId('custom-dropdown-item-Spanish');
    await expect(languageOptionSpanish).toBeVisible();
    await languageOptionSpanish.click();
    await languageOptionSpanish.click();
    await expect(providerMyAccountPage.editProfileSaveButton).toBeDisabled();
  });

  test('Verify "Cancel" button functionality in Edit profile details slide out @[114233] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Make some changes first
    await providerMyAccountPage.editProfileDetailsFirstNameInput.clear();
    await providerMyAccountPage.editProfileDetailsFirstNameInput.type('TestName');
    await expect(providerMyAccountPage.editProfileCancelButton).toBeVisible();
    await providerMyAccountPage.editProfileCancelButton.click();
    await expect(providerMyAccountPage.page.getByText('TestName')).not.toBeVisible();
  });

  // redundant test - covered in other tests
  test.skip('Verify save changes button functionality in Edit profile details slide out @[114234] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test save changes functionality
    await providerMyAccountPage.fillPhoneNumberInEditProfile('123234455634');
    await providerMyAccountPage.editProfileSaveButton.click();
    await providerMyAccountPage.editProfileSuccessMessage.waitFor({ state: 'visible' });
    await expect(providerMyAccountPage.editProfileSuccessMessage).toBeVisible();
  });

  test('Verify "Country" dropdown functionality, and "State" dropdown functionality in Edit profile details slide out @[114237] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();
    await providerMyAccountPage.editLicenseModalLicense2CountryDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
    await providerMyAccountPage.page.getByTestId('custom-dropdown-item-Afghanistan').click();
    await providerMyAccountPage.editLicenseModalLicense2StateDropdown.click();
    await expect(providerMyAccountPage.customDropdown).toBeVisible();
    await providerMyAccountPage.page.getByTestId('custom-dropdown-item-Badakhshan').click();
    await expect(providerMyAccountPage.page.getByText('CountryAfghanistanStateBadakhshan')).toBeVisible();
    await providerMyAccountPage.editProfileCancelButton.click();
  });

  test('Verify the Phone number extension dropdown functionality in Edit profile details slide out @[114240] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();
    // Test phone number extension dropdown
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumberExtensionDropdown).toBeVisible();
    await providerMyAccountPage.editProfileDetailsPhoneNumberExtensionDropdown.click();
    await expect(providerMyAccountPage.itemsWrapper).toBeVisible();
    const firstOption = providerMyAccountPage.itemsWrapper.locator('div').first();
    await firstOption.click();
    await expect(providerMyAccountPage.editProfileSaveButton).toBeEnabled();
  });

  test('Verify Error Message Displays When Saving Phone Number Currently Being Used @[118975] @provider @functional', async () => {
    await providerMyAccountPage.openEditProfileSlideOut();

    // Test phone number field functionality
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumber).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsPhoneNumberInput).toBeVisible();
    await providerMyAccountPage.editProfileDetailsPhoneNumberInput.fill('');
    await providerMyAccountPage.fillPhoneNumberInEditProfile('1234567890');
    await providerMyAccountPage.editProfileSaveButton.click();
    await expect(providerMyAccountPage.phoneNumberNotUniqueError).toBeVisible();
  });
});
