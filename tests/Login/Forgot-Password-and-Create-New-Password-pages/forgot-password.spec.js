import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/shared/login.page.js';

// Forgot Password - Total Tests 8 (including 2 skipped)

test.describe('Forgot Password @regression', () => {
  let loginPage;

  // Initialize LoginPage before each test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // Verify all main elements are visible on Forgot Password page
  test('Verify Content on Forgot Password Page @[114517] @unauthenticated @ui', async ({ page }) => {
    await loginPage.goToForgotPasswordPage();
    await expect(loginPage.forgotPasswordHeading).toBeVisible();
    await expect(loginPage.emailDisplay).toBeVisible();
    await expect(loginPage.sendEmailButton).toBeVisible();
    await expect(loginPage.backToPasswordLink).toBeVisible();
    await expect(loginPage.footer).toBeVisible();
  });

  // Check Forgot Password link is enabled and navigates correctly
  test('Verify Forgot Password Link on Password Page @[111171] @unauthenticated @ui', async ({ page }) => {
    await loginPage.goToPasswordStep();
    await expect(loginPage.forgotPasswordLink).toBeEnabled();
    await loginPage.forgotPasswordLink.click();
    await loginPage.page.waitForURL(/.*\/forgot-password/);
    await expect(loginPage.forgotPasswordHeading).toBeVisible();
  });

  // Ensure Back to Password link works from Forgot Password page
  test('Verify Back to Password Page Link on Forgot Password Page @[111172] @unauthenticated @functional', async ({ page }) => {
    await loginPage.goToForgotPasswordPage();
    await expect(loginPage.backToPasswordLink).toBeVisible();
    await loginPage.backToPasswordLink.click();
    await loginPage.page.waitForURL(/.*\/login/);
    await expect(loginPage.passwordInput).toBeVisible();
  });

  // Test submission button functionality on Forgot Password page
  test('Verify the submission button on Forgot Password Page @[111173] @unauthenticated @functional', async ({ page }) => {
    await loginPage.goToForgotPasswordPage();
    await loginPage.sendEmailButton.click();
    await loginPage.page.waitForURL(/.*\/password-reset-confirmation/);
    await loginPage.confirmationHeading.waitFor();
    await expect(loginPage.confirmationHeading).toBeVisible();
  });

  // Skipped: Resend Link test (not implemented)
  test.skip('Verify the Resend Link on Forgot Password Page @[111174] @unauthenticated @functional', async ({ page }) => {});

  // Verify resend link and confirmation after sending email
  test('Verify the Verification Link in Users Email @[111175] @unauthenticated @functional', async ({ page }) => {
    await loginPage.goToForgotPasswordPage();
    await loginPage.sendEmailButton.click();
    await loginPage.page.waitForURL(/.*\/password-reset-confirmation/);
    await loginPage.confirmationHeading.waitFor();
    await expect(loginPage.confirmationHeading).toBeVisible();
    await expect(loginPage.resendLink).toBeVisible();
    await expect(loginPage.footer).toBeVisible();
    await loginPage.resendLink.click();
    await expect(loginPage.passwordResetHeading).toBeVisible();
  });

  // Check redirect on Forgot Password link from Password page
  test('Verify redirect on Forgot Password? link click on Password Page @[111184] @unauthenticated @functional', async ({ page }) => {
    await loginPage.goToPasswordStep();
    await loginPage.forgotPasswordLink.click();
    await loginPage.page.waitForURL(/.*\/forgot-password/);
    await expect(loginPage.forgotPasswordHeading).toBeVisible();
  });

  // Skipped: Negative test for password creation (not implemented)
  test.skip('[Negative] Verify Creation of a New Password that matches old password @[111518] @unauthenticated @functional', async ({
    page,
  }) => {});
});
