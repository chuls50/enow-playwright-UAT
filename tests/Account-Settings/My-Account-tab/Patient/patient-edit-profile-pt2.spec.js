import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/patient/patient-my-account.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Patient Edit Profile - Total tests

const TEST_DATA = {
  // Insurance and Tax ID test data
  VALID_INSURANCE_POLICY: '1234/abcd-efgh',
  VALID_INSURANCE_POLICY_2: '1111',
  VALID_INSURANCE: '1234abcdefgh',
  VALID_INSURANCE_2: '2222',
  VALID_TAX_ID: '12345qwerty',
  VALID_TAX_ID_2: '0000',
  INVALID_SPECIAL_CHARS: '!@#$%^&*(',
};

// total tests 6/6
test.describe('Patient Edit Profile pt2 @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoAccountSettings();
  });

  // bug here!! tax ID displays as N/A after saving valid input
  test('Verify validation for Tax ID valid input in Edit Profile Details @[118043] @patient @functional', async ({ page }) => {
    // Open edit profile modal
    await myAccountPage.openEditProfileModal();

    // Fill in tax ID with valid input
    await myAccountPage.fillTaxId(TEST_DATA.VALID_TAX_ID);
    await expect(myAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();
    await myAccountPage.saveEditProfileChanges();
    await expect(myAccountPage.profileUpdatedSuccessMessage).toBeVisible();

    // Verify updated tax ID appears in profile
    await expect(page.getByText(TEST_DATA.VALID_TAX_ID)).toBeVisible();

    // Reset state with second valid tax ID
    await myAccountPage.openEditProfileModal();
    await myAccountPage.fillTaxId(TEST_DATA.VALID_TAX_ID_2);
    await myAccountPage.saveEditProfileChanges();
    await expect(myAccountPage.profileUpdatedSuccessMessage).toBeVisible();
  });

  test('Verify validation for Insurance policy number valid input in Edit Profile Details @[118045] @patient @functional', async ({
    page,
  }) => {
    // Open edit profile modal
    await myAccountPage.openEditProfileModal();

    // Validate insurance policy field
    await myAccountPage.fillInsurancePolicyNumber(TEST_DATA.VALID_INSURANCE_POLICY);
    await expect(myAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();
    await myAccountPage.saveEditProfileChanges();
    await expect(myAccountPage.profileUpdatedSuccessMessage).toBeVisible();

    // Verify updated insurance policy number appears in edit profile details
    await expect(page.getByText(TEST_DATA.VALID_INSURANCE_POLICY)).toBeVisible();

    // Reset state
    await myAccountPage.openEditProfileModal();
    await myAccountPage.fillInsurancePolicyNumber(TEST_DATA.VALID_INSURANCE_POLICY_2);
    await myAccountPage.saveEditProfileChanges();
    await expect(myAccountPage.profileUpdatedSuccessMessage).toBeVisible();
  });

  test('Verify validation for Insurance valid input in Edit Profile Details @[118046] @patient @functional', async ({ page }) => {
    // Open edit profile modal
    await myAccountPage.openEditProfileModal();

    // Validate insurance field
    await myAccountPage.fillInsurance(TEST_DATA.VALID_INSURANCE);
    await expect(myAccountPage.editProfileDetailsModalSaveButton).toBeEnabled();
    await myAccountPage.saveEditProfileChanges();
    await expect(myAccountPage.profileUpdatedSuccessMessage).toBeVisible();

    // Verify updated insurance value appears in edit profile details
    await expect(page.getByText(TEST_DATA.VALID_INSURANCE)).toBeVisible();

    // Reset state
    await myAccountPage.openEditProfileModal();
    await myAccountPage.fillInsurance(TEST_DATA.VALID_INSURANCE_2);
    await myAccountPage.saveEditProfileChanges();
    await expect(myAccountPage.profileUpdatedSuccessMessage).toBeVisible();
  });

  test('Verify entering invalid text into "Tax ID" field functionality @[118047] @patient @functional', async ({ page }) => {
    // Open edit profile modal
    await myAccountPage.openEditProfileModal();

    // Validate tax ID field with invalid input
    await myAccountPage.fillTaxId(TEST_DATA.INVALID_SPECIAL_CHARS);

    // Verify validation error appears
    await expect(myAccountPage.taxIdFieldError).toBeVisible();
  });

  test('Verify entering invalid text into "Insurance policy number" field functionality @[118049] @patient @functional', async ({
    page,
  }) => {
    // Open edit profile modal
    await myAccountPage.openEditProfileModal();

    // Validate insurance policy number field with invalid input
    await myAccountPage.fillInsurancePolicyNumber(TEST_DATA.INVALID_SPECIAL_CHARS);

    // Verify validation error appears
    await expect(myAccountPage.insurancePolicyNumberFieldError).toBeVisible();
  });

  test('Verify entering invalid text into "Insurance" field functionality @[118050] @patient @functional', async ({ page }) => {
    // Open edit profile modal
    await myAccountPage.openEditProfileModal();

    // Validate insurance field with invalid input
    await myAccountPage.fillInsurance(TEST_DATA.INVALID_SPECIAL_CHARS);

    // Verify validation error appears
    await expect(myAccountPage.insuranceFieldError).toBeVisible();
  });
});
