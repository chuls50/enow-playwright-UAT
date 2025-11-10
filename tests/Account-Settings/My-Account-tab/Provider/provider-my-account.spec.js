import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/provider/provider-my-account.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DATA = {
  editProfile: {
    firstName: 'TestName',
    lastName: 'TestLastName',
    medicalSpecialty: 'Allergologist',
    language: 'Spanish',
  },
  invalidAvatarFile: '../../../images/invalid-image.txt',
  largeAvatarFile: '../../../images/large-image.jpg',
};

// Provider My Account - Total tests 12 (including 1 skipped)

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let providerMyAccountPage;

  test.beforeEach(async ({ page }) => {
    providerMyAccountPage = new MyAccountPage(page);
    await providerMyAccountPage.gotoProviderMyAccount();
  });

  test('Verify Edit Button Functionality for Profile Selection on Account Settings Page @[111224] @provider @functional', async ({}) => {
    // Open edit profile slide out
    await providerMyAccountPage.profileDetailsEditButton.click();

    // Verify UI elements in edit profile slide out
    await expect(providerMyAccountPage.editProfileDetailsSlideOut).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstNameInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastNameInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileSaveButton).toBeVisible();
  });

  test('Verify Edit Button Functionality for License to Practice Section on Account Settings @[111225] @provider @functional', async ({}) => {
    // Open edit license modal
    await providerMyAccountPage.licenseToPracticeButton.click();

    // Verify UI elements in edit license modal
    await expect(providerMyAccountPage.editLicenseModal).toBeVisible();
    await expect(providerMyAccountPage.editLicenseModalLicense1).toBeVisible();
    await expect(providerMyAccountPage.editLicenseModalLicense1Country).toBeVisible();
    await expect(providerMyAccountPage.editLicenseModalLicense1State).toBeVisible();
    await expect(providerMyAccountPage.editLicenseAddLicenseButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseCancelButton).toBeVisible();
    await expect(providerMyAccountPage.editLicenseSaveButton).toBeVisible();
  });

  test('Verify Delete Account Button Functionality on Account Settings Page @[111227] @provider @functional', async ({ page }) => {
    // Open delete account modal
    await providerMyAccountPage.openDeleteAccountModal();

    // Verify UI elements in delete account modal
    await expect(providerMyAccountPage.accountDeletionModal).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionHeader).toHaveText('Delete account?');
    await expect(providerMyAccountPage.accountDeleteText).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionModalXCloseButton).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionNoCancelButton).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionConfirmButton).toBeVisible();
  });

  test('Verify No Cancel Button Functionality on Delete Account Screen @[111228] @provider @functional', async ({}) => {
    // Open delete account modal
    await providerMyAccountPage.openDeleteAccountModal();

    // Verify UI elements in delete account modal
    await expect(providerMyAccountPage.accountDeletionModal).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionHeader).toHaveText('Delete account?');
    await expect(providerMyAccountPage.accountDeleteText).toBeVisible();
    await expect(providerMyAccountPage.accountDeletionNoCancelButton).toBeVisible();

    // Click No, cancel button
    await providerMyAccountPage.accountDeletionNoCancelButton.click();

    // Verify modal closes
    await expect(providerMyAccountPage.accountDeletionModal).not.toBeVisible();
  });

  test.skip('Verify "Yes, Delete" Button Functionality on Delete Account Screen @[111229]', async () => {});

  test('Verify Profile Details slide out in Edit Profile details @[111390] @provider @ui', async ({}) => {
    // Open edit profile slide out
    await providerMyAccountPage.profileDetailsEditButton.click();

    // Verify UI elements in edit profile slide out
    await expect(providerMyAccountPage.editProfileDetailsSlideOut).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsFirstNameInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastName).toBeVisible();
    await expect(providerMyAccountPage.editProfileDetailsLastNameInput).toBeVisible();
    await expect(providerMyAccountPage.editProfileSaveButton).toBeVisible();
  });

  test('Verify required fields for Profile Details in Edit Profile details @[111391] @provider @functional', async ({}) => {
    // Open edit profile slide out
    await providerMyAccountPage.profileDetailsEditButton.click();

    // Clear all required fields
    await providerMyAccountPage.clearAllRequiredFieldsInEditProfile();

    // Verify all required field validation messages are visible
    await expect(providerMyAccountPage.firstNameRequiredError).toBeVisible();
    await expect(providerMyAccountPage.lastNameRequiredError).toBeVisible();
    await expect(providerMyAccountPage.medicalSpecialtyRequiredError).toBeVisible();
    await expect(providerMyAccountPage.languageRequiredError).toBeVisible();

    // Close the edit profile slide out
    await providerMyAccountPage.editProfileCancelButton.click();
  });

  test('Verify Medical specialty field in Edit Profile details @[111392] @provider @functional', async ({}) => {
    // Open edit profile slide out
    await providerMyAccountPage.profileDetailsEditButton.click();

    // Select medical specialty
    await providerMyAccountPage.selectMedicalSpecialtyInEditProfile(TEST_DATA.editProfile.medicalSpecialty);

    // Verify save button is enabled
    await expect(providerMyAccountPage.editProfileSaveButton).toBeEnabled();
  });

  test('Verify languages spoken field in Edit profile details @[111393] @provider @functional', async ({}) => {
    // Open edit profile slide out
    await providerMyAccountPage.profileDetailsEditButton.click();

    // Select language spoken
    await providerMyAccountPage.selectLanguageInEditProfile(TEST_DATA.editProfile.language);

    // Verify save button is enabled
    await expect(providerMyAccountPage.editProfileSaveButton).toBeEnabled();
  });

  test('Verify Cancel button behavior in Edit Profile details @[111394] @provider @functional', async ({ page }) => {
    // Open edit profile slide out
    await providerMyAccountPage.profileDetailsEditButton.click();

    // Make changes to first name field
    await providerMyAccountPage.editProfileDetailsFirstNameInput.clear();
    await providerMyAccountPage.editProfileDetailsFirstNameInput.type(TEST_DATA.editProfile.firstName);

    // Close the edit profile slide out
    await providerMyAccountPage.editProfileCancelButton.click();

    // Verify slide out is closed
    await expect(providerMyAccountPage.editProfileDetailsSlideOut).not.toBeVisible();
  });

  test('[Negative] Verify Invalid File Upload for Avatar @[112290] @provider @functional', async ({ page }) => {
    const invalidFilePath = path.join(__dirname, TEST_DATA.invalidAvatarFile);

    // Upload invalid file
    await providerMyAccountPage.uploadFileForAvatar(invalidFilePath);

    // Verify error message
    await expect(providerMyAccountPage.page.getByText('Please upload an image file.')).toBeVisible();
  });

  test('[Negative] Verify Large Image Upload for Avatar @[112291] @provider @functional', async ({ page }) => {
    const largeImagePath = path.join(__dirname, TEST_DATA.largeAvatarFile);

    // Upload large image
    await providerMyAccountPage.uploadFileForAvatar(largeImagePath);

    // Verify error message
    await expect(providerMyAccountPage.page.getByText('File size should not exceed 5 MB')).toBeVisible();
  });
});
