import { expect } from '@playwright/test';
import { BasePage } from '../../base-page.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MyAccountPage extends BasePage {
  constructor(page) {
    super(page);

    this.header = page.getByRole('heading', { name: 'Account settings' });
    this.navigationBar = page.getByText('My accountNotifications');

    // My Account Section
    this.myAccountLabel = page
      .getByRole('paragraph')
      .filter({ hasText: 'My account' });
    this.myAccountText = page.getByText('Update and manage your account');
    this.profileIcon = page.getByTestId('avatar').locator('div').nth(1);
    this.profileName = page.getByText('CODY TEST USER ADMIN');
    this.profileEmail = page.getByText('chuls+adminprod@globalmed.com');
    this.uploadPhotoButton = page.getByRole('button', {
      name: 'Download Upload photo',
    });
    this.deletePhotoButton = page.getByRole('button', {
      name: 'Trash Delete photo',
    });

    // Profile Details Section
    this.profileDetailsSection = page.getByText('Profile details');
    this.profileDetailsFirstName = page.getByText('First name');
    this.profileDetailsLastName = page.getByText('Last name');
    this.profileLanguagesSpoken = page.getByText('Languages spoken');
    this.profileCountry = page.getByText('Country');
    this.profileState = page.getByText('State');
    this.profilePhoneNumber = page.getByText('Phone number');
    this.profileDetailsEditButton = page
      .locator('div')
      .filter({ hasText: /^Profile detailsEdit$/ })
      .getByRole('button');

    // Application language section
    this.applicationLanguageSection = page.getByText('Application language');
    this.changeLanguageButton = page.getByRole('link', {
      name: 'Change language',
    });
    this.changeLanguageModal = page
      .getByTestId('modal')
      .getByText('Change language');

    // Time zone section
    this.timeZoneSection = page.getByText('Time zone', { exact: true });
    this.changeTimeZoneButton = page.getByRole('link', {
      name: 'Change time zone',
    });
    this.changeTimeZoneModal = page
      .getByTestId('modal')
      .getByText('Change time zone');

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

    // Edit Profile Modal
    this.editProfileModal = page.getByText('Edit profile detailsFirst');
    this.editProfileHeader = page.getByText('Edit profile details');

    // Error Messages
    this.invalidImageErrorMessage = page.getByText(
      'Please upload an image file.'
    );
    this.fileSizeExceededMessage = page.getByText(
      'File size should not exceed 5 MB'
    );
    this.profilePictureDeletedMessage = page.getByText(
      'Profile picture deleted successfully.'
    );
  }

  async gotoMyAccount() {
    await this.page.goto(`${process.env.UAT_URL}/account-settings/my-account`);
    await this.waitForSpinnerToDisappear();
    await this.navigationBar.waitFor({ state: 'visible' });
  }

  async uploadFile(filePath) {
    // If filePath is a Promise (result of calling getTestImagePath without await), resolve it first
    if (filePath instanceof Promise) {
      filePath = await filePath;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found at: ${filePath}`);
    }

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadPhotoButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    // Wait for upload to complete
    await this.page.getByText('Uploading...').waitFor({ state: 'hidden' });
  }

  async waitForUploadToComplete() {
    await expect(this.page.getByText('Uploading...')).not.toBeVisible();
  }

  async getTestImagePath() {
    return path.join(__dirname, '../../../images/profile-icon.jpg');
  }

  async getInvalidFilePath() {
    return path.join(__dirname, '../../../images/invalid-image.txt');
  }

  async getLargeImagePath() {
    return path.join(__dirname, '../../../images/large-image.jpg');
  }
}
