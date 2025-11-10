import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/shared/login.page.js';

// Password - Total Tests 10 (including 1 skipped)

// Test Data Constants
const TEST_DATA = {
  TEST_PASSWORD: 'TestPassword123',
  WRONG_PASSWORD: 'WrongPassword123',
  CASE_SENSITIVE_PASSWORD: 'TESTPASSWORD123!',
};

test.describe('Unauthenticated @regression', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.goToPasswordStep();
  });

  test('Verify Content on Password Page @[111164] @unauthenticated @ui', async ({ page }) => {
    // Verify all password page elements are visible
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.passwordLabel).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.eyeButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.footer).toBeVisible();

    // Test password masking functionality
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Enter a test password
    await loginPage.passwordInput.fill(TEST_DATA.TEST_PASSWORD);

    // Test eye button toggle
    await loginPage.eyeButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    await loginPage.eyeButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Test forgot password link
    await loginPage.forgotPasswordLink.click();
    await expect(loginPage.backToPasswordLink).toBeVisible();
    await loginPage.backToPasswordLink.click();
  });

  test('Verify Password masking and visibility toggle on Password Page @[111165] @unauthenticated @functional', async ({ page }) => {
    // Verify the password is masked by default
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Enter a test password
    await loginPage.passwordInput.fill(TEST_DATA.TEST_PASSWORD);

    // Verify password is still masked
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordInput).toHaveValue(TEST_DATA.TEST_PASSWORD);

    // Toggle password visibility and verify it's visible
    await loginPage.eyeButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    // Toggle visibility again and verify it's masked
    await loginPage.eyeButton.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Verify Log In click with no password on Password Page @[111166] @unauthenticated @functional', async ({ page }) => {
    // Click login without entering password
    await loginPage.loginButton.click();

    // Verify error message
    await expect(loginPage.errorMessageEmptyPassword).toBeVisible();

    // Verify login button remains enabled
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('Validate Password complexity on Password Page @[111167] @unauthenticated @functional', async ({ page }) => {
    // Enter valid password and login
    await loginPage.passwordInput.fill(process.env.UAT_PATIENT_PASSWORD);
    await loginPage.loginButton.click();

    // Verify successful login by checking URL change
    await expect(page).toHaveURL(/.*\/route-me/);
  });

  test('[Negative] Validate Password Complexity on Password Page @[111168] @unauthenticated @functional', async ({ page }) => {
    // Enter invalid password and attempt login
    await loginPage.passwordInput.fill(TEST_DATA.WRONG_PASSWORD);
    await loginPage.loginButton.click();

    // Verify error message
    await loginPage.errorMessageWrongPassword.waitFor({ state: 'visible' });
    await expect(loginPage.errorMessageWrongPassword).toBeVisible();
  });

  test('Process Log In with Valid Password on Password Page @[111169] @unauthenticated @functional', async ({ page }) => {
    // Login with valid password
    await loginPage.passwordInput.fill(process.env.UAT_PATIENT_PASSWORD);
    await loginPage.loginButton.click();

    // Verify redirect to expected page
    await expect(page).toHaveURL(/.*\/route-me/);
  });

  test('[Negative] Verify password mismatch on Password Page @[111170] @unauthenticated @functional', async ({ page }) => {
    // Enter invalid password and attempt login
    await loginPage.passwordInput.fill(TEST_DATA.WRONG_PASSWORD);
    await loginPage.loginButton.click();

    // Verify error message
    await expect(loginPage.errorMessageWrongPassword).toBeVisible();
  });

  test('[Negative] Verify Case Sensitivity in Passwords on Password Page @[111194] @unauthenticated @functional', async ({ page }) => {
    // Try password with different case
    await loginPage.passwordInput.fill(TEST_DATA.CASE_SENSITIVE_PASSWORD);
    await loginPage.loginButton.click();

    // Verify error message
    await expect(loginPage.errorMessageWrongPassword).toBeVisible();
  });

  test('Verify Password page updates depending on "Language" selected from "Language dropdown" @[115394] @unauthenticated @functional', async ({
    page,
  }) => {
    // Verify English is initially selected
    await expect(loginPage.currentLanguageText).toBeVisible();

    // Select Spanish using POM method
    await loginPage.selectLanguage('SpanishText');
    await expect(loginPage.spanishLanguageText).toBeVisible();
    await expect(loginPage.loginHeadingSpanish).toBeVisible();
    await page.waitForTimeout(3000); // Wait for UI to update

    // Switch back to English
    await loginPage.selectLanguage('EnglishFromSpanish');
    await expect(page.getByText('English')).toBeVisible();
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('Verify Password page updates to reflect the White Label Configuration settings @[115395] @unauthenticated @functional', async ({
    page,
  }) => {
    // Verify URL contains the string 'xj9'
    await expect(page).toHaveURL(/.*xj9.*/);
  });
});
