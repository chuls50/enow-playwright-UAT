import { expect } from '@playwright/test';
import { BasePage } from '../../base-page.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export class AccountCreationPage extends BasePage {
  constructor(page) {
    super(page);
    this.createAccountHeading = page.getByRole('heading', { name: 'Create account' });
    this.createAccountWelcomeMessage = page.getByText('Welcome to eNow! Please set your password.');
    this.createAccountEmail = page.locator('input[type="text"][value="chuls+activateaccountlink@globalmed.com"]');
    this.createAccountButton = page.getByRole('button', { name: 'Create account' });
    this.passwordInput = page.getByTestId('password-input');
    this.confirmPasswordInput = page.getByTestId('confirm-password-input');
    this.passwordErrorIcon = page.getByTestId('icon-XClose');
    this.passwordMismatchError = page.getByText(/password.*match/i);
    this.passwordUppercaseError = page
      .locator('div')
      .filter({ hasText: /^At least 1 uppercase$/ })
      .getByTestId('icon');
    this.passwordLowercaseError = page
      .locator('div')
      .filter({ hasText: /^At least 1 lowercase$/ })
      .getByTestId('icon');
    this.passwordNumberError = page
      .locator('div')
      .filter({ hasText: /^At least 1 number$/ })
      .getByTestId('icon');
    this.passwordSpecialCharError = page
      .locator('div')
      .filter({ hasText: /^At least 1 special character$/ })
      .getByTestId('icon');
  }

  async goto() {
    await this.page.goto(process.env.ACTIVATE_ACCOUNT_LINK_PROD, { waitUntil: 'networkidle' });

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    await this.page.waitForURL(/.*\/signup/);
  }

  async enterPassword(password) {
    await this.page.waitForTimeout(1000);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async enterConfirmPassword(confirmPassword) {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clearConfirmPassword() {
    await this.confirmPasswordInput.clear();
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async fillMatchingPasswords(password = process.env.PATIENT_PASSWORD) {
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
  }

  async testPasswordMismatchValidation(
    correctPassword = process.env.PATIENT_PASSWORD,
    wrongPassword = 'wrongpassword'
  ) {
    await this.enterPassword(correctPassword);
    await expect(this.passwordErrorIcon).not.toBeVisible();

    await this.enterConfirmPassword(wrongPassword);
    await this.clickCreateAccount();
    await expect(this.passwordMismatchError).toBeVisible();

    await this.clearConfirmPassword();
    await this.enterConfirmPassword(correctPassword);
    await this.createAccountButton.isEnabled();
  }

  async verifyAccountCreationElements() {
    await expect(this.createAccountHeading).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
  }

  async verifySignupUrl() {
    await expect(this.page).toHaveURL(/\/signup/);
  }
}
