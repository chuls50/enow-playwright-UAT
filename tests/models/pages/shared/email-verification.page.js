import { expect } from '@playwright/test';

export class EmailVerificationPage {
  constructor(page) {
    this.page = page;

    // Page elements
    this.verifyEmailHeading = page.getByRole('heading', { name: 'Verify your email' });
    this.resendLink = page.getByRole('link', { name: 'Resend link' });
    this.resendConfirmationMessage = page.getByText('Please check your email for a verification link');
  }

  getEmailText(email) {
    return this.page.getByText(email);
  }

  async clickResendLink() {
    await this.resendLink.click();
  }

  async verifyEmailVerificationHeading() {
    await expect(this.verifyEmailHeading).toBeVisible();
  }

  async verifyEmailDisplayed(email) {
    await expect(this.getEmailText(email)).toBeVisible();
  }

  async verifyResendLinkVisible() {
    await expect(this.resendLink).toBeVisible();
  }

  async verifyResendConfirmation() {
    await expect(this.resendConfirmationMessage).toBeVisible();
  }

  async verifyEmailVerificationElements(email) {
    await this.verifyEmailVerificationHeading();
    await this.verifyEmailDisplayed(email);
    await this.verifyResendLinkVisible();
  }

  async testResendLinkWorkflow() {
    await this.clickResendLink();
    await this.verifyResendConfirmation();
  }
}
