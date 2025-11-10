import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/patient/patient-my-account.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patient My Account - Total tests 9

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let patientMyAccountPage;

  test.beforeEach(async ({ page }) => {
    patientMyAccountPage = new MyAccountPage(page);
    await patientMyAccountPage.gotoAccountSettings();
  });

  test('Verify Patient View and Content Display on Account Settings Page @[111245] @patient @ui', async () => {
    // Verify main page content
    await expect(patientMyAccountPage.header).toBeVisible();
    await expect(patientMyAccountPage.myAccountText).toBeVisible();
    await expect(patientMyAccountPage.profileIconUploadButton).toBeVisible();
    await expect(patientMyAccountPage.profileIconDeleteButton).toBeVisible();
    await expect(patientMyAccountPage.editProfileButton).toBeVisible();

    // Verify profile fields are displayed
    await expect(patientMyAccountPage.firstNameText).toBeVisible();
    await expect(patientMyAccountPage.lastNameText).toBeVisible();
    await expect(patientMyAccountPage.dobText).toBeVisible();
    await expect(patientMyAccountPage.genderText).toBeVisible();
    await expect(patientMyAccountPage.phoneNumberText).toBeVisible();

    // Verify additional sections
    await expect(patientMyAccountPage.applicationLanguageSection).toBeVisible();
    await expect(patientMyAccountPage.changeLanguageButton).toBeVisible();
    await expect(patientMyAccountPage.timeZoneSection).toBeVisible();
    await expect(patientMyAccountPage.timeZoneChangeButton).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionSection).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionButton).toBeVisible();
  });

  test('Verify Upload Photo Functionality @[111246] @patient @functional', async () => {
    // Test data
    const testImagePath = path.join(__dirname, '../../../images/profile-icon.jpg');

    // Upload photo and verify functionality
    await patientMyAccountPage.uploadPhoto(testImagePath);
  });

  test('Verify Delete Photo Functionality @[111247] @patient @functional', async ({ page }) => {
    // Verify delete button is visible and clickable
    await expect(patientMyAccountPage.profileIconDeleteButton).toBeVisible();
    await patientMyAccountPage.profileIconDeleteButton.click();

    // Verify success message
    await patientMyAccountPage.deleteProfilePictureSuccessMessage.waitFor({ state: 'visible' });
    await expect(patientMyAccountPage.deleteProfilePictureSuccessMessage).toBeVisible();
  });

  test('Verify Edit Button Functionality for Profile Details @[111248] @patient @functional', async () => {
    // Open edit profile modal
    await patientMyAccountPage.openEditProfileModal();

    // Verify modal is open with required elements
    await expect(patientMyAccountPage.editProfileDetailsModal).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalHeader).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalFirstNameInput).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalLastNameInput).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalDOBInput).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalCancelButton).toBeVisible();
  });

  test('Verify Change Language Link Functionality @[111249] @patient @functional', async () => {
    // Open change language modal
    await patientMyAccountPage.openChangeLanguageModal();

    // Verify modal opens
    await expect(patientMyAccountPage.changeLanguageModal).toBeVisible();
  });

  test('Verify Change Time Zone Link Functionality @[111250] @patient @functional', async () => {
    // Click change time zone link
    await patientMyAccountPage.timeZoneChangeButton.click();

    //click on automatic time zone
    await patientMyAccountPage.timeZoneAutomaticToggle.click();
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();
  });

  test('Verify Delete Account Link Functionality @[111251] @patient @functional', async () => {
    // Open delete account modal
    await patientMyAccountPage.openDeleteAccountModal();

    // Verify modal is open with required elements
    await expect(patientMyAccountPage.accountDeletionModal).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionHeader).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionNoCancelButton).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionConfirmButton).toBeVisible();
  });

  test('Verify No, Cancel Button Functionality on Delete Account Screen @[111252] @patient @functional', async () => {
    // Open delete account modal
    await patientMyAccountPage.openDeleteAccountModal();

    // Click No, cancel button
    await patientMyAccountPage.accountDeletionNoCancelButton.click();

    // Verify modal closes
    await expect(patientMyAccountPage.accountDeletionModal).not.toBeVisible();
  });

  test.skip('Verify Yes, Delete Button Functionality (Delete Account) @[111253] @patient @functional', async () => {});
});
