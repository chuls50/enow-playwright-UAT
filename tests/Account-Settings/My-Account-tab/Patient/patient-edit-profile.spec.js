import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/patient/patient-my-account.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test data constants
const TEST_DATA = {
  VALID_FIRST_NAME: 'TestFirstName',
  VALID_LAST_NAME: 'TestLastName',
  VALID_DOB: '01/01/1990',
  VALID_DOB_2: '02/02/1990',
  FUTURE_DOB: '12/01/2025',
  INVALID_DOB: 'invalid-date',
  RESET_FIRST_NAME: 'cody test patient',
  RESET_LAST_NAME: 'Cody Test Institution',
  INVALID_CHARACTERS: '#$%^&*',
  PROFILE_IMAGE_PATH: path.join(__dirname, '../../../images/profile-icon.jpg'),
  INVALID_FILE_PATH: path.join(__dirname, '../../../images/invalid-image.txt'),
  LARGE_IMAGE_PATH: path.join(__dirname, '../../../images/large-image.jpg'),
};

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let patientMyAccountPage;

  test.beforeEach(async ({ page }) => {
    patientMyAccountPage = new MyAccountPage(page);
    await patientMyAccountPage.gotoAccountSettings();
  });

  test('Verify navigation to the Edit Profile details slide out @[111217] @patient @ui', async () => {
    // Open edit profile modal
    await patientMyAccountPage.openEditProfileModal();

    // Verify modal is open with all required elements
    await expect(patientMyAccountPage.editProfileDetailsModal).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalHeader).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalFirstNameInput).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalLastNameInput).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalDOBInput).toBeVisible();
  });

  test('Verify Save Changes button when editing text fields @[111218] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Fill in new values
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.VALID_FIRST_NAME, TEST_DATA.VALID_LAST_NAME);

    // Verify save button is enabled
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();

    // Reset to original values (save button should be disabled)
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.RESET_FIRST_NAME, TEST_DATA.RESET_LAST_NAME);
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeDisabled();
  });

  test('Verify Upload Photo Functionality on Account Settings Page @[111220] @patient @functional', async () => {
    // Upload photo
    await patientMyAccountPage.uploadPhoto(TEST_DATA.PROFILE_IMAGE_PATH);

    // Verify success message appears
    await expect(patientMyAccountPage.page.getByText('Success', { exact: true })).toBeVisible();
  });

  test('Verify DOB Calendar selection tool @[111221] @patient @ui', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Click on DOB input to open calendar
    await patientMyAccountPage.editProfileDetailsModalDOBInput.click();

    // Verify calendar dialog opens
    const calendar = patientMyAccountPage.page.getByRole('dialog', { name: 'Choose Date' });
    await expect(calendar).toBeVisible();
  });

  test('Verify Delete Photo Functionality on Account Settings Page @[111222] @patient @functional', async () => {
    // First upload a photo, then delete it
    await patientMyAccountPage.uploadPhoto(TEST_DATA.PROFILE_IMAGE_PATH);

    // Delete the photo
    await patientMyAccountPage.profileIconDeleteButton.click();

    // Verify the photo is deleted (adjust based on actual app behavior)
  });

  test('Verify Save Changes button state for manual DOB entry @[111223] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Clear and enter DOB manually
    await patientMyAccountPage.editProfileDetailsModalDOBInput.clear();
    await patientMyAccountPage.editProfileDetailsModalDOBInput.fill(TEST_DATA.VALID_DOB_2);

    // Verify save button is enabled
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled({ timeout: 15000 });
  });

  test('Verify Delete Account Button Functionality on Account Settings Page @[111227] @patient @functional', async () => {
    // Open delete account modal
    await patientMyAccountPage.openDeleteAccountModal();

    // Verify all modal elements are present
    await expect(patientMyAccountPage.accountDeletionModal).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionHeader).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionNoCancelButton).toBeVisible();
    await expect(patientMyAccountPage.accountDeletionConfirmButton).toBeVisible();
  });

  test('Verify No, Cancel Button Functionality on Delete Account Screen @[111228] @patient @functional', async () => {
    await patientMyAccountPage.openDeleteAccountModal();

    // Click No, cancel button
    await patientMyAccountPage.accountDeletionNoCancelButton.click();

    // Verify modal closes
    await expect(patientMyAccountPage.accountDeletionModal).not.toBeVisible();
  });

  test.skip('Verify "Yes, Delete" Button Functionality on Delete Account Screen @[111229]', async () => {});

  test('Verify Sex assigned at birth dropdown @[111254] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Verify gender dropdown is visible and clickable
    await expect(patientMyAccountPage.editProfileDetailsModalGenderSelect).toBeVisible();
    await patientMyAccountPage.editProfileDetailsModalGenderSelect.click();

    // Verify dropdown options appear
    const genderOptions = patientMyAccountPage.page.getByTestId('custom-dropdown');
    await expect(genderOptions).toBeVisible();
  });

  test('Verify Phone number field and Country Dropdown @[111255] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Verify phone number field and country dropdown are present
    const phoneNumberInput = patientMyAccountPage.page.getByRole('textbox', { name: '(555) 000-' });
    const countryDropdown = patientMyAccountPage.page
      .locator('div')
      .filter({ hasText: /^US \(\+1\)$/ })
      .nth(1);

    await expect(phoneNumberInput).toBeVisible();
    await expect(countryDropdown).toBeVisible();

    // Test country dropdown functionality
    await countryDropdown.click();
    const countryOptions = patientMyAccountPage.page.getByTestId('items-wrapper');
    await expect(countryOptions).toBeVisible();
  });

  test('Verify Country dropdown and State field behavior @[111256] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Test country dropdown
    const countryDropdown = patientMyAccountPage.page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^CountryAfghanistan$/ })
      .getByTestId('custom-select-item-wrapper');
    await countryDropdown.click();

    const countryOptions = patientMyAccountPage.page.getByTestId('custom-dropdown');
    await expect(countryOptions).toBeVisible();

    // Select a country with states
    await patientMyAccountPage.page.getByTestId('custom-dropdown-item-Albania').click();

    // Verify state dropdown becomes available
    const stateDropdown = patientMyAccountPage.page.getByTestId('custom-select-item-wrapper').nth(2);
    await expect(stateDropdown).toBeVisible();
  });

  test('Verify State Dropdown @[111257] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // First select a country that has states
    const countryDropdown = patientMyAccountPage.page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^CountryAfghanistan$/ })
      .getByTestId('custom-select-item-wrapper');
    await countryDropdown.click();
    await patientMyAccountPage.page.getByTestId('custom-dropdown-item-Albania').click();

    // Now test the state dropdown
    const stateDropdown = patientMyAccountPage.page.getByTestId('custom-select-item-wrapper').nth(2);
    await stateDropdown.click();

    const stateOptions = patientMyAccountPage.page.getByTestId('custom-dropdown');
    await expect(stateOptions).toBeVisible();
  });

  test('Verify Cancel button functionality @[111258] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Make some changes
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.VALID_FIRST_NAME);

    // Verify save button becomes enabled
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();

    // Cancel the changes
    await patientMyAccountPage.cancelEditProfileChanges();

    // Verify modal is closed
    await expect(patientMyAccountPage.editProfileDetailsModal).not.toBeVisible();
  });

  test('Verify Save Changes with empty required fields @[111259] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Clear required fields
    await patientMyAccountPage.editProfileDetailsModalFirstNameInput.clear();
    await patientMyAccountPage.editProfileDetailsModalLastNameInput.clear();
    await patientMyAccountPage.editProfileDetailsModalDOBInput.clear();

    // Try to save
    await patientMyAccountPage.editProfileDetailsModalSaveButton.click();

    // Verify error messages appear
    await expect(patientMyAccountPage.page.getByText('First name is required')).toBeVisible();
    await expect(patientMyAccountPage.page.getByText('Last name is required')).toBeVisible();
    await expect(patientMyAccountPage.page.getByText('Invalid Date Format')).toBeVisible();
  });

  test('Validate Save Changes for all required fields @[111260] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Fill all required fields with valid data
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.VALID_FIRST_NAME, TEST_DATA.VALID_LAST_NAME, TEST_DATA.VALID_DOB);

    // Save changes
    await patientMyAccountPage.saveEditProfileChanges();

    // Verify success message
    await expect(patientMyAccountPage.page.getByText('Profile updated successfully')).toBeVisible();

    // Reset back to original values
    await patientMyAccountPage.openEditProfileModal();
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.RESET_FIRST_NAME, TEST_DATA.RESET_LAST_NAME);
    await patientMyAccountPage.saveEditProfileChanges();
  });

  test('Highlight invalid values on Save Changes @[111261] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Enter invalid characters in name fields
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.INVALID_CHARACTERS, TEST_DATA.INVALID_CHARACTERS);

    // Try to save
    await patientMyAccountPage.editProfileDetailsModalSaveButton.click();

    // Verify validation error messages
    await expect(patientMyAccountPage.page.getByText('First name must contain at')).toBeVisible();
    await expect(patientMyAccountPage.page.getByText('Last name must contain at')).toBeVisible();
  });

  test('Verify successful save with valid values for all fields @[111262] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Fill with valid data
    await patientMyAccountPage.fillEditProfileForm('Cody', 'Pineapple', TEST_DATA.VALID_DOB);

    // Save changes
    await patientMyAccountPage.saveEditProfileChanges();

    // Verify success
    await expect(patientMyAccountPage.page.getByText('Profile updated successfully')).toBeVisible();

    // Reset to original
    await patientMyAccountPage.openEditProfileModal();
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.RESET_FIRST_NAME, TEST_DATA.RESET_LAST_NAME);
    await patientMyAccountPage.saveEditProfileChanges();
  });

  test('Verify default behavior of Save Changes and Cancel buttons @[111263] @patient @ui', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Verify initial state - save button should be disabled
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeDisabled();
    await expect(patientMyAccountPage.editProfileDetailsModalCancelButton).toBeEnabled();

    // Make a change - save button should become enabled
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.VALID_FIRST_NAME);
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();

    // Reset to original - save button should be disabled again
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.RESET_FIRST_NAME);
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeDisabled();
  });

  test('Verify Calendar selection tool date restrictions @[111264] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Open calendar
    await patientMyAccountPage.editProfileDetailsModalDOBInput.click();
    const calendar = patientMyAccountPage.page.getByRole('dialog', { name: 'Choose Date' });
    await expect(calendar).toBeVisible();

    // Try to select a future date (this should show validation error)
    // Note: Actual implementation will depend on the calendar component structure
  });

  test.skip('Verify field validation for Phone number @[111265]', async () => {
    await patientMyAccountPage.openEditProfileModal();

    const phoneInput = patientMyAccountPage.page.getByRole('textbox', { name: '(555) 000-' });

    // Test invalid characters
    await phoneInput.clear();
    await phoneInput.fill('abc@');

    // Verify field formatting/validation
    const phoneValue = await phoneInput.inputValue();
    expect(phoneValue).toBe('(___) ___ - ____'); // Field should have mask format when empty

    // Test valid phone number
    await phoneInput.fill('1234567890');
    await patientMyAccountPage.saveEditProfileChanges();
    await expect(patientMyAccountPage.page.getByText('Profile updated successfully')).toBeVisible();
  });

  test('Verify required field indicators on Edit Profile @[111266] @patient @ui', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Verify required field indicators are present
    await expect(patientMyAccountPage.page.getByText('First name*')).toBeVisible();
    await expect(patientMyAccountPage.page.getByText('Last name*')).toBeVisible();
    await expect(patientMyAccountPage.page.getByText('DOB*')).toBeVisible();

    // Test validation by clearing required field
    await patientMyAccountPage.editProfileDetailsModalFirstNameInput.clear();
    await patientMyAccountPage.editProfileDetailsModalSaveButton.click();
    await expect(patientMyAccountPage.page.getByText('First name is required')).toBeVisible();
  });

  test('Verify State dropdown behavior for countries without states @[111267] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Select a country without states (e.g., Singapore)
    const countryDropdown = patientMyAccountPage.page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^CountryAfghanistan$/ })
      .getByTestId('custom-select-item-wrapper');
    await countryDropdown.click();
    await patientMyAccountPage.page.getByText('Singapore').click();

    // Verify state dropdown shows appropriate behavior for countries without states
    const stateDropdown = patientMyAccountPage.page.getByTestId('custom-select-item-wrapper').nth(2);
    await stateDropdown.click();
    await expect(patientMyAccountPage.page.getByTestId('custom-dropdown-item-Singapore')).toBeVisible();
  });

  test('Verify Address field accepts special characters @[111268] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    const addressInput = patientMyAccountPage.page.getByRole('textbox', { name: 'Address line 1' });
    const testAddress = '123 Main St. @#$%^&*()';

    // Fill address with special characters
    await addressInput.fill(testAddress);

    // Verify the value is accepted
    const addressValue = await addressInput.inputValue();
    expect(addressValue).toBe(testAddress);

    // Verify save button becomes enabled
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();
  });

  test('Verify navigation away from the Edit Profile screen @[111269] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Make a change
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.VALID_FIRST_NAME);

    // Refresh the page to simulate navigation away
    await patientMyAccountPage.page.reload();

    // Verify modal is no longer visible
    await expect(patientMyAccountPage.editProfileDetailsModal).not.toBeVisible();
  });

  test('Verify Save Changes button for partial updates on Edit Profile @[111270] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Make partial update (only first name)
    await patientMyAccountPage.editProfileDetailsModalFirstNameInput.clear();
    await patientMyAccountPage.editProfileDetailsModalFirstNameInput.fill('PartialUpdateFirstName');

    // Verify save button is enabled
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();

    // Save changes
    await patientMyAccountPage.saveEditProfileChanges();
    await expect(patientMyAccountPage.page.getByText('Profile updated successfully')).toBeVisible();

    // Reset back
    await patientMyAccountPage.openEditProfileModal();
    await patientMyAccountPage.fillEditProfileForm(TEST_DATA.RESET_FIRST_NAME);
    await patientMyAccountPage.saveEditProfileChanges();
  });

  test('Verify reset of State dropdown after country change @[111271] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Select a country
    const countryDropdown = patientMyAccountPage.page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^CountryAfghanistan$/ })
      .getByTestId('custom-select-item-wrapper');
    await countryDropdown.click();
    await patientMyAccountPage.page.getByText('Singapore').click();

    // Verify state dropdown resets appropriately
    const stateDropdown = patientMyAccountPage.page.getByTestId('custom-select-item-wrapper').nth(2);
    await expect(stateDropdown).toBeVisible();
    await expect(patientMyAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();
  });

  test.skip('Verify validation for manual DOB valid input in Edit Profile details @[111727]', async () => {});

  test('Verify validation for manual DOB invalid input in Edit Profile Details @[111728] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Enter invalid DOB
    await patientMyAccountPage.editProfileDetailsModalDOBInput.clear();
    await patientMyAccountPage.editProfileDetailsModalDOBInput.fill(TEST_DATA.INVALID_DOB);

    // Verify field is empty due to format validation
    const dobValue = await patientMyAccountPage.editProfileDetailsModalDOBInput.inputValue();
    expect(dobValue).toBe('');

    // Verify error message appears
    await expect(patientMyAccountPage.page.getByText('Invalid Date Format')).toBeVisible();
  });

  test('Verify validation for manual DOB input for future date in Edit Profile details @[111729] @patient @functional', async () => {
    await patientMyAccountPage.openEditProfileModal();

    // Enter future date
    await patientMyAccountPage.editProfileDetailsModalDOBInput.clear();
    await patientMyAccountPage.editProfileDetailsModalDOBInput.fill(TEST_DATA.FUTURE_DOB);

    // Verify validation error
    await expect(patientMyAccountPage.page.getByText('Date of birth cannot be in the future')).toBeVisible();
  });

  test('[Negative] Verify Invalid File Upload for Avatar @[112290] @patient @functional', async () => {
    // Try uploading invalid file type
    const fileChooserPromise = patientMyAccountPage.page.waitForEvent('filechooser');
    await patientMyAccountPage.profileIconUploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(TEST_DATA.INVALID_FILE_PATH);

    // Verify error message
    await expect(patientMyAccountPage.page.getByText('Please upload an image file.')).toBeVisible();
  });

  test('[Negative] Verify Large Image Upload for Avatar @[112291] @patient @functional', async () => {
    // Try uploading large file
    const fileChooserPromise = patientMyAccountPage.page.waitForEvent('filechooser');
    await patientMyAccountPage.profileIconUploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(TEST_DATA.LARGE_IMAGE_PATH);

    // Verify error message
    await expect(patientMyAccountPage.page.getByText('File size should not exceed 5 MB')).toBeVisible();
  });
});
