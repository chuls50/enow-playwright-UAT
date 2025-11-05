import { expect } from '@playwright/test';
import { BasePage } from '../../base-page.js';
import dotenv from 'dotenv';

dotenv.config();

export class AccountSignupPage extends BasePage {
    constructor(page) {
        super(page)
        
        this.emailField = page.getByRole('textbox', { name: 'Email' });
        this.verifyEmailButton = page.getByRole('button', { name: 'Verify email' });
        this.emptyEmailError = page.getByText('Enter an email');
        this.invalidEmailError = page.getByText('Email fields can only include');
    }

    async goto() {
        await this.page.goto(process.env.INVITE_LINK_PROD);
        
        // Wait for spinner to disappear if present
        await this.waitForSpinnerToDisappear();
        
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForURL(/.*\/signup/);
    }

    async enterEmail(email) {
        await this.emailField.fill(email);
    }

    async clickVerifyEmail() {
        await this.verifyEmailButton.click();
    }

    async fillEmailAndSubmit(email) {
        await this.enterEmail(email);
        await this.clickVerifyEmail();
    }

    async verifyEmptyEmailError() {
        await expect(this.emptyEmailError).toBeVisible();
    }

    async verifyInvalidEmailError() {
        await expect(this.invalidEmailError).toBeVisible();
    }

    async testEmptyEmailValidation() {
        await this.clickVerifyEmail();
        await this.verifyEmptyEmailError();
    }

    async testInvalidEmailValidation(invalidEmail = 'invalidemail.com') {
        await this.fillEmailAndSubmit(invalidEmail);
        await this.verifyInvalidEmailError();
    }
}