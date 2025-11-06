import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/admin/admin-my-account.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Admin My Account - Total tests 10 (including 1 skipped)

test.describe('Admin My Account @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoMyAccount();
  });

  test('Verify UI elements of the "My account" screen @[117690] @admin @ui', async () => {
    // Verify main page structure
    await expect(myAccountPage.header).toBeVisible();
    await expect(myAccountPage.header).toHaveText('Account settings');
    await expect(myAccountPage.navigationBar).toBeVisible();

    // Verify My Account section
    await expect(myAccountPage.myAccountLabel).toBeVisible();
    await expect(myAccountPage.myAccountText).toBeVisible();
    await expect(myAccountPage.profileIcon).toBeVisible();
    await expect(myAccountPage.profileName).toBeVisible();
    await expect(myAccountPage.profileEmail).toBeVisible();
    await expect(myAccountPage.uploadPhotoButton).toBeVisible();
    await expect(myAccountPage.deletePhotoButton).toBeVisible();

    // Verify Profile Details section
    await expect(myAccountPage.profileDetailsSection).toBeVisible();
    await expect(myAccountPage.profileDetailsFirstName).toBeVisible();
    await expect(myAccountPage.profileDetailsLastName).toBeVisible();
    await expect(myAccountPage.profileLanguagesSpoken).toBeVisible();
    await expect(myAccountPage.profileCountry).toBeVisible();
    await expect(myAccountPage.profileState).toBeVisible();
    await expect(myAccountPage.profilePhoneNumber).toBeVisible();
    await expect(myAccountPage.profileDetailsEditButton).toBeVisible();

    // Verify other sections
    await expect(myAccountPage.applicationLanguageSection).toBeVisible();
    await expect(myAccountPage.changeLanguageButton).toBeVisible();
    await expect(myAccountPage.timeZoneSection).toBeVisible();
    await expect(myAccountPage.changeTimeZoneButton).toBeVisible();
    await expect(myAccountPage.accountDeletionSection).toBeVisible();
    await expect(myAccountPage.accountDeletionButton).toBeVisible();
  });

  test('Verify uploading a valid profile photo @[117691] @admin @functional', async () => {
    // Upload a valid image file
    const imagePath = await myAccountPage.getTestImagePath();
    await myAccountPage.uploadFile(imagePath);
    await myAccountPage.waitForUploadToComplete();

    // Verify upload was successful by checking delete button is still available
    await expect(myAccountPage.deletePhotoButton).toBeVisible();

    // Clean up - delete the uploaded photo
    await myAccountPage.deletePhotoButton.click();
  });

  test('[Negative] Verify upload of an unsupported or large file fails @[117692] @admin @functional', async () => {
    // Test invalid file type
    await myAccountPage.uploadFile(myAccountPage.getInvalidFilePath());
    await expect(myAccountPage.invalidImageErrorMessage).toBeVisible();

    // Test large file size
    await myAccountPage.uploadFile(myAccountPage.getLargeImagePath());
    await expect(myAccountPage.fileSizeExceededMessage).toBeVisible();
  });

  test('Verify deleting the uploaded photo @[117693] @admin @functional', async () => {
    // First upload a photo
    await myAccountPage.uploadFile(myAccountPage.getTestImagePath());
    await myAccountPage.waitForUploadToComplete();

    // Delete the photo
    await myAccountPage.deletePhotoButton.click();

    // Expect Profile picture deleted successfully message
    await expect(myAccountPage.profilePictureDeletedMessage).toBeVisible();
  });

  test('Verify navigation to the Edit Profile screen @[117694] @admin @functional', async () => {
    // Click edit profile button
    await myAccountPage.profileDetailsEditButton.click();

    // Verify edit profile modal opens - explicit assertions
    await expect(myAccountPage.editProfileModal).toBeVisible();
    await expect(myAccountPage.editProfileHeader).toBeVisible();
  });

  test('Verify navigation to the Change Language screen @[117695] @admin @functional', async () => {
    // Click change language button
    await myAccountPage.changeLanguageButton.click();

    // Verify change language modal opens - explicit assertion using POM locator
    await expect(myAccountPage.changeLanguageModal).toBeVisible();
  });

  test('Verify navigation to Change time zone screen @[118488] @admin @functional', async () => {
    // Click change time zone button
    await myAccountPage.changeTimeZoneButton.click();

    // Verify change time zone modal opens - explicit assertion using POM locator
    await expect(myAccountPage.changeTimeZoneModal).toBeVisible();
  });

  test('Verify the Delete Account confirmation dialog @[117697] @admin @ui', async () => {
    // Open delete account modal - simple action
    await myAccountPage.accountDeletionButton.click();

    // Verify modal content - explicit assertions
    await expect(myAccountPage.accountDeletionModal).toBeVisible();
    await expect(myAccountPage.accountDeletionHeader).toBeVisible();
    await expect(myAccountPage.accountDeleteText).toBeVisible();

    // Close modal using X button - simple action
    await myAccountPage.accountDeletionModalXCloseButton.click();

    // Verify modal is closed - explicit assertion
    await expect(myAccountPage.accountDeletionModal).not.toBeVisible();
  });

  test('Verify canceling account deletion @[117698] @admin @functional', async () => {
    // Open delete account modal - simple action
    await myAccountPage.accountDeletionButton.click();

    // Verify modal is open - explicit assertions
    await expect(myAccountPage.accountDeletionModal).toBeVisible();
    await expect(myAccountPage.accountDeletionHeader).toBeVisible();
    await expect(myAccountPage.accountDeleteText).toBeVisible();

    // Cancel deletion - simple action
    await myAccountPage.accountDeletionNoCancelButton.click();

    // Verify modal is closed - explicit assertion
    await expect(myAccountPage.accountDeletionModal).not.toBeVisible();
  });

  // multi-user test
  test.skip('Verify confirming account deletion @[117699] @multi-user @functional', async () => {});
});
