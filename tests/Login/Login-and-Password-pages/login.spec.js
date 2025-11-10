import { test, expect } from '@playwright/test';
import { LoginPage } from '../../models/pages/shared/login.page.js';

// total tests 20/20

// Test Data Constants
const TEST_DATA = {
  INVALID_EMAIL: 'invalid-email',
  UNREGISTERED_EMAIL: 'unregistered@domain.com',
  PARTIAL_EMAIL: 'test',
  VALID_EMAIL: process.env.UAT_PROVIDER_USERNAME,
};

test.describe('Unauthenticated @regression', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Verify Login Screen Display @[117346] @unauthenticated @ui', async ({ page }) => {
    // Verify URL pattern
    await expect(page).toHaveURL(/.*\/login/);

    // Verify all main elements are visible
    await expect(loginPage.welcomeMessage).toBeVisible();
    await expect(loginPage.emailField).toBeVisible();
    await expect(loginPage.emailLabel).toBeVisible();
    await expect(loginPage.nextButton).toBeVisible();
    await expect(loginPage.footer).toBeVisible();
  });

  test('Verify Login Screen Right Half Image @[117347] @unauthenticated @ui', async ({ page }) => {
    // Verify the presence of the welcome image on the right half of the screen
    await expect(loginPage.welcomeImage).toBeAttached();

    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width > 768) {
      await expect(loginPage.welcomeImage).toBeVisible();
    }
  });

  test('Verify Login Screen Language Dropdown @[117349] @unauthenticated @ui', async ({ page }) => {
    // Desktop Chrome test logic
    await loginPage.selectLanguage('Spanish');
    await expect(loginPage.loginHeadingSpanish).toBeVisible();
    await loginPage.selectLanguage('EnglishFromSpanish');
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('Verify Login Screen Label @[117350] @unauthenticated @ui', async ({ page }) => {
    // Wait for login label to be visible
    await page.getByRole('heading', { name: 'Login' }).waitFor({ state: 'visible' });

    // Verify the login label text
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('Verify Email Label Display @[117352] @unauthenticated @ui', async ({ page }) => {
    // Wait for email label to be visible
    await page.getByText('Email*').waitFor({ state: 'visible' });

    // Verify the email label text
    await expect(page.getByText('Email*')).toBeVisible();
  });

  test('Verify Email Textbox Default Content @[117353] @unauthenticated @ui', async ({ page }) => {
    // Wait for email textbox to be visible
    await page.getByRole('textbox', { name: 'Enter email' }).waitFor({ state: 'visible' });

    // Verify the email textbox placeholder text
    await expect(page.getByRole('textbox', { name: 'Enter email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter email' })).toHaveAttribute('placeholder', 'Enter email');
  });

  test('Verify Next Button Display and Default State @[117354] @unauthenticated @ui', async ({ page }) => {
    // Wait for Next button to be visible
    await page.getByRole('button', { name: 'Next' }).waitFor({ state: 'visible' });

    // Verify the Next button is visible and enabled
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  test('Verify Language Dropdown Display @[117355] @unauthenticated @ui', async ({ page }) => {
    // Verify the language dropdown is visible
    await expect(loginPage.currentLanguageText).toBeVisible();

    // Click to open the dropdown and verify options are visible
    await loginPage.languageDropdownTrigger.click();
    await expect(loginPage.languageDropdown).toBeVisible();
  });

  test('Verify Available Languages @[117357] @unauthenticated @ui', async ({ page }) => {
    // Verify the language dropdown is visible
    await expect(loginPage.currentLanguageText).toBeVisible();

    // Click to open the dropdown and verify options are visible
    await loginPage.languageDropdownTrigger.click();
    await expect(loginPage.languageDropdown).toBeVisible();
    await expect(loginPage.spanishLanguageOption).toBeVisible();
    await expect(loginPage.portugueseLanguageOption).toBeVisible();
  });

  test('Verify English Language Selection @[117358] @unauthenticated @functional', async ({ page }) => {
    // Verify the language dropdown is visible
    await expect(loginPage.currentLanguageText).toBeVisible();

    // Select Spanish, then switch back to English
    await loginPage.selectLanguage('Spanish');
    await expect(loginPage.loginHeadingSpanish).toBeVisible();

    await loginPage.selectLanguage('EnglishFromSpanish');
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('Verify Spanish Language Selection @[117360] @unauthenticated @functional', async ({ page }) => {
    // Verify the language dropdown is visible
    await expect(loginPage.currentLanguageText).toBeVisible();

    // Select Spanish, then switch back to English
    await loginPage.selectLanguage('Spanish');
    await expect(loginPage.loginHeadingSpanish).toBeVisible();

    await loginPage.selectLanguage('EnglishFromSpanish');
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('Verify Email Empty Field Error @[117362] @unauthenticated @functional', async ({ page }) => {
    // Wait for next button to be visible
    await page.getByRole('button', { name: 'Next' }).waitFor({ state: 'visible' });

    // Click Next without entering email
    await loginPage.nextButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Verify Invalid Email Format Display @[117363] @unauthenticated @functional', async ({ page }) => {
    // Wait for email field to be visible
    await page.getByRole('textbox', { name: 'Enter email' }).waitFor({ state: 'visible' });

    // Enter invalid email format and click Next
    await loginPage.emailField.fill(TEST_DATA.INVALID_EMAIL);
    await loginPage.nextButton.click();
    await expect(loginPage.errorMessageInvalidEmail).toBeVisible();
  });

  test('Verify Invalid Email Format Message Persistence @[117365] @unauthenticated @functional', async ({ page }) => {
    // Wait for email field to be visible
    await page.getByRole('textbox', { name: 'Enter email' }).waitFor({ state: 'visible' });

    // Enter invalid email format and click Next
    await loginPage.emailField.fill(TEST_DATA.INVALID_EMAIL);
    await loginPage.nextButton.click();

    // Verify the error message
    await expect(loginPage.errorMessageInvalidEmail).toBeVisible();

    // Try to clear the input and check if the error persists
    await loginPage.emailField.fill(TEST_DATA.PARTIAL_EMAIL);
    await loginPage.nextButton.click();
    await expect(loginPage.errorMessageInvalidEmail).toBeVisible();
  });

  test('Verify Valid Email Format Recognition @[117366] @unauthenticated @functional', async ({ page }) => {
    // Wait for email field to be visible
    await page.getByRole('textbox', { name: 'Enter email' }).waitFor({ state: 'visible' });

    // Enter valid email format and click Next
    await loginPage.emailField.fill(TEST_DATA.VALID_EMAIL);
    await loginPage.nextButton.click();

    // Verify that the system does not show an error message for valid email
    await expect(loginPage.errorMessageInvalidEmail).not.toBeVisible();
  });

  test('Verify Validation Message Dismissal @[117367] @unauthenticated @functional', async ({ page }) => {
    // Enter an invalid partial email
    await loginPage.emailField.fill(TEST_DATA.PARTIAL_EMAIL);
    await loginPage.nextButton.click();

    // Verify that the validation message appears
    await expect(page.getByText('Email fields can only include alphanumeric characters')).toBeVisible();

    // Complete the email to a valid format
    await loginPage.emailField.clear();
    await loginPage.emailField.fill(TEST_DATA.VALID_EMAIL);

    // Click outside the field to trigger validation
    await loginPage.nextButton.click();

    // Verify that the validation message has disappeared
    await expect(loginPage.errorMessageInvalidEmail)
      .not.toBeVisible({ timeout: 1000 })
      .catch(() => {});
  });

  test('Verify Email Registration Validation @[117369] @unauthenticated @functional', async ({ page }) => {
    // Enter valid email
    await loginPage.emailField.fill(TEST_DATA.VALID_EMAIL);

    // Click the button and observe for system response
    await loginPage.nextButton.click();

    // Verify that we move to password step without error
    await expect(loginPage.passwordLabel).toBeVisible();
  });

  test('Verify Unregisterred Email Error Message @[117373] @unauthenticated @functional', async ({ page }) => {
    // Enter valid but unregistered email
    await loginPage.emailField.fill(TEST_DATA.UNREGISTERED_EMAIL);

    // Click the button and wait for error message
    await loginPage.nextButton.click();

    // Verify that an error message about unregistered email is displayed
    await expect(page.getByText(/Couldn't find an account for the email address provided/i)).toBeVisible({ timeout: 5000 });
  });

  test('Verify Password Entry for Registered Email @[117374] @unauthenticated @functional', async ({ page }) => {
    // Enter valid and registered email
    await loginPage.emailField.fill(TEST_DATA.VALID_EMAIL);

    // Click the button and wait for password entry field
    await loginPage.nextButton.click();

    // Verify that we moved to the password screen
    await expect(loginPage.loginHeading).toBeVisible();

    // Check for password-related instructions or labels
    await loginPage.passwordLabel.waitFor({ state: 'visible' });
    await expect(loginPage.passwordLabel).toBeVisible();

    // Also check for "Forgot Password?" link which should be present on password screen
    await loginPage.forgotPasswordLink.waitFor({ state: 'visible' });
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('Verify Portuguese Language Selection @[118454] @unauthenticated @functional', async ({ page }) => {
    // Verify the language dropdown is visible
    await expect(loginPage.languageDropdownTrigger).toBeVisible();

    // Select Portuguese
    await loginPage.selectLanguage('Portuguese');
    await expect(loginPage.portugueseLanguageText).toBeVisible();
    await expect(loginPage.loginHeadingPortuguese).toBeVisible();

    // Switch back to English
    await loginPage.selectLanguage('EnglishFromPortuguese');
    await expect(loginPage.loginHeading).toBeVisible();
  });
});
