import { test, expect } from '@playwright/test';
import { CreateNewPasswordPage } from '../../../models/pages/shared/create-new-password.page.js';

// Create New Password - Total Tests 10 (including 1 skipped)

// Test data constants
const TEST_PASSWORDS = {
  VALID: 'ValidPassword123!',
  SHORT: 'Short1!',
  NO_UPPERCASE: 'validpass123!',
  NO_LOWERCASE: 'VALIDPASS123!',
  NO_NUMBER: 'ValidPassword!',
  NO_SPECIAL_CHAR: 'ValidPass123',
  MISMATCH: 'DifferentPass123!',
};

test.describe('Unauthenticated @regression', () => {
  let createNewPasswordPage;

  test.beforeEach(async ({ page }) => {
    createNewPasswordPage = new CreateNewPasswordPage(page);
    await createNewPasswordPage.gotoChangePassword();
  });

  test('Verify Content on "Create New Password" Page @[114524] @unauthenticated @ui', async () => {
    // Verify all elements on Create New Password page are visible
    await expect(createNewPasswordPage.pageHeading).toBeVisible();
    await expect(createNewPasswordPage.rememberText).toBeVisible();
    await expect(createNewPasswordPage.newPasswordLabel).toBeVisible();
    await expect(createNewPasswordPage.newPasswordFieldLabel).toBeVisible();
    await expect(createNewPasswordPage.passwordInput).toBeVisible();
    await expect(createNewPasswordPage.requirementMinLength).toBeVisible();
    await expect(createNewPasswordPage.requirementUppercase).toBeVisible();
    await expect(createNewPasswordPage.requirementLowercase).toBeVisible();
    await expect(createNewPasswordPage.requirementNumber).toBeVisible();
    await expect(createNewPasswordPage.requirementSpecialChar).toBeVisible();
    await expect(createNewPasswordPage.confirmPasswordLabel).toBeVisible();
    await expect(createNewPasswordPage.confirmPasswordInput).toBeVisible();
    await expect(createNewPasswordPage.newPasswordButton).toBeVisible();
    await expect(createNewPasswordPage.copyrightText).toBeVisible();
  });

  test('Verify password visibility toggle on "Create New Password" Page @[114526] @unauthenticated @functional', async () => {
    await expect(createNewPasswordPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveAttribute('type', 'password');

    await createNewPasswordPage.togglePasswordVisibility();
    await expect(createNewPasswordPage.passwordInput).toHaveAttribute('type', 'text');

    await createNewPasswordPage.toggleConfirmPasswordVisibility();
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  test('Verify functionality on "Create New Password" Page @[114527] @unauthenticated @functional', async () => {
    const validPassword = TEST_PASSWORDS.VALID;

    // Enter a valid new password
    await createNewPasswordPage.fillPassword(validPassword);
    await expect(createNewPasswordPage.passwordInput).toHaveValue(validPassword);

    // Enter a valid confirm password
    await createNewPasswordPage.fillConfirmPassword(validPassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(validPassword);

    // Verify the submit button is enabled
    await expect(createNewPasswordPage.newPasswordButton).toBeEnabled();

    // Verify that all requirement fail icons are not visible (password meets all requirements)
    await expect(createNewPasswordPage.minLengthFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.uppercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.lowercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.numberFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.specialCharFailIcon).not.toBeVisible();
  });

  test('[Negative] Verify change password requirements - (password too short) @[114528] @unauthenticated @functional', async () => {
    const shortPassword = TEST_PASSWORDS.SHORT;

    // Enter an invalid new password (too short)
    await createNewPasswordPage.fillBothPasswords(shortPassword, shortPassword);
    await expect(createNewPasswordPage.passwordInput).toHaveValue(shortPassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(shortPassword);

    // Verify that only the minimum length requirement fails
    await expect(createNewPasswordPage.minLengthFailIcon).toBeVisible();
    await expect(createNewPasswordPage.uppercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.lowercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.numberFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.specialCharFailIcon).not.toBeVisible();

    // Submit the form
    await createNewPasswordPage.submitNewPassword();

    // Verify the error message is displayed
    await expect(createNewPasswordPage.passwordRequirementsError).toBeVisible();
  });

  test('[Negative] Verify change password requirements - (missing uppercase letter) @[114529] @unauthenticated @functional', async () => {
    const noUppercasePassword = TEST_PASSWORDS.NO_UPPERCASE;

    // Enter an invalid new password (missing uppercase letter)
    await createNewPasswordPage.fillBothPasswords(noUppercasePassword, noUppercasePassword);
    await expect(createNewPasswordPage.passwordInput).toHaveValue(noUppercasePassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(noUppercasePassword);

    // Verify that only the uppercase requirement fails
    await expect(createNewPasswordPage.uppercaseFailIcon).toBeVisible();
    await expect(createNewPasswordPage.minLengthFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.lowercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.numberFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.specialCharFailIcon).not.toBeVisible();

    // Submit the form
    await createNewPasswordPage.submitNewPassword();

    // Verify the error message is displayed
    await expect(createNewPasswordPage.passwordRequirementsError).toBeVisible();
  });

  test('[Negative] Verify change password requirements - (missing lowercase letter) @[114530] @unauthenticated @functional', async () => {
    const noLowercasePassword = TEST_PASSWORDS.NO_LOWERCASE;

    // Enter an invalid new password (missing lowercase letter)
    await createNewPasswordPage.fillBothPasswords(noLowercasePassword, noLowercasePassword);
    await expect(createNewPasswordPage.passwordInput).toHaveValue(noLowercasePassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(noLowercasePassword);

    // Verify that only the lowercase requirement fails
    await expect(createNewPasswordPage.lowercaseFailIcon).toBeVisible();
    await expect(createNewPasswordPage.minLengthFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.uppercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.numberFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.specialCharFailIcon).not.toBeVisible();

    // Submit the form
    await createNewPasswordPage.submitNewPassword();

    // Verify the error message is displayed
    await expect(createNewPasswordPage.passwordRequirementsError).toBeVisible();
  });

  test('[Negative] Verify change password requirements - (missing number) @[114531] @unauthenticated @functional', async () => {
    const noNumberPassword = TEST_PASSWORDS.NO_NUMBER;

    // Enter an invalid new password (missing number)
    await createNewPasswordPage.fillBothPasswords(noNumberPassword, noNumberPassword);
    await expect(createNewPasswordPage.passwordInput).toHaveValue(noNumberPassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(noNumberPassword);

    // Verify that only the number requirement fails
    await expect(createNewPasswordPage.numberFailIcon).toBeVisible();
    await expect(createNewPasswordPage.minLengthFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.uppercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.lowercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.specialCharFailIcon).not.toBeVisible();

    // Submit the form
    await createNewPasswordPage.submitNewPassword();

    // Verify the error message is displayed
    await expect(createNewPasswordPage.passwordRequirementsError).toBeVisible();
  });

  test('[Negative] Verify change password requirements - (missing special character) @[114532] @unauthenticated @functional', async () => {
    const noSpecialCharPassword = TEST_PASSWORDS.NO_SPECIAL_CHAR;

    // Enter an invalid new password (missing special character)
    await createNewPasswordPage.fillBothPasswords(noSpecialCharPassword, noSpecialCharPassword);
    await expect(createNewPasswordPage.passwordInput).toHaveValue(noSpecialCharPassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(noSpecialCharPassword);

    // Verify that only the special character requirement fails
    await expect(createNewPasswordPage.specialCharFailIcon).toBeVisible();
    await expect(createNewPasswordPage.minLengthFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.uppercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.lowercaseFailIcon).not.toBeVisible();
    await expect(createNewPasswordPage.numberFailIcon).not.toBeVisible();

    // Submit the form
    await createNewPasswordPage.submitNewPassword();

    // Verify the error message is displayed
    await expect(createNewPasswordPage.passwordRequirementsError).toBeVisible();
  });

  test.skip('Verify Time Pass Functionality on Password Changed Page @[111177] @unauthenticated @functional', async ({ page }) => {
    // This test is skipped because it requires time manipulation which is not supported in the current environment.
    // The test would ideally check if the user is redirected to
    // the login page after a certain period on the password changed confirmation page.
  });

  test('[Negative] Verify password mismatch validation on "Create New Password" Page @[111178] @unauthenticated @functional', async () => {
    const validPassword = TEST_PASSWORDS.VALID;
    const mismatchPassword = TEST_PASSWORDS.MISMATCH;

    // Enter a valid new password but mismatched confirm password
    await createNewPasswordPage.fillPassword(validPassword);
    await createNewPasswordPage.fillConfirmPassword(mismatchPassword);

    await expect(createNewPasswordPage.passwordInput).toHaveValue(validPassword);
    await expect(createNewPasswordPage.confirmPasswordInput).toHaveValue(mismatchPassword);

    // Submit the form
    await createNewPasswordPage.submitNewPassword();

    // Verify that the mismatch error message is displayed
    await expect(createNewPasswordPage.passwordMismatchError).toBeVisible();
  });
});
