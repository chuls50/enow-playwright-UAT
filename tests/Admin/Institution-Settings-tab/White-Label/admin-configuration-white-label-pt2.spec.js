import { test, expect } from '@playwright/test';
import { InstitutionSettingsProfilePage } from '../../../models/pages/admin/institution-settings-profile.page.js';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

// Admin Configuration White Label pt2 - Total Tests 7

test.setTimeout(90000); // 90 seconds

test.describe('Super Admin @regression', () => {
  let institutionSettingsProfilePage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsProfilePage = new InstitutionSettingsProfilePage(page);

    // Navigate to base URL and wait for login page
    await page.goto(process.env.SANDBOX_URL);
    await page.waitForURL(/.*\/login/);

    // Fill email
    await page.getByPlaceholder('Enter email').fill(process.env.SUPER_ADMIN_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(500);

    // Fill password
    await page.getByPlaceholder('Enter your password').fill(process.env.SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(/.*\/route-me/);

    // Wait for spinner to disappear
    await institutionSettingsProfilePage.waitForSpinnerToDisappear();
  });

  test.skip('Verify new Institution is created with White Label OFF and empty subdomain @[118733] @super-admin @functional', async ({
    page,
  }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'White label' }).click();

    // Verify White Label switch is visible and OFF by default
    await expect(page.getByTestId('switch-div')).toBeVisible();

    // Check if the toggle is OFF by default
    const switchElement = page.getByTestId('switch-div');
    // First verify the element exists
    await expect(switchElement).toBeVisible();

    // reload the page to ensure the state is persisted
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    await page.getByRole('button', { name: 'White label' }).click();
    await page.waitForTimeout(1000);

    // Verify the switch is still OFF after reload
    await expect(switchElement).toBeVisible();

    // Check if the switch is not checked by verifying its appearance
    // This is more reliable than using getAttribute which might return null
    const isChecked = await switchElement.evaluate((el) => {
      return (
        window.getComputedStyle(el).getPropertyValue('--switch-checked') === 'true' ||
        el.classList.contains('checked') ||
        el.getAttribute('aria-checked') === 'true'
      );
    });
    expect(isChecked).toBe(false);

    // Verify Subdomain field is empty
    const subdomainField = page.getByRole('textbox', { name: 'Subdomain example' });
    await expect(subdomainField).toBeVisible();
    const subdomainValue = await subdomainField.inputValue();
    expect(subdomainValue).toBe('');
  });

  test.skip('Verify default “portal” subdomain is used when White Label is OFF @[118734] @super-admin @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'White label' }).click();

    // Verify White Label switch is visible and OFF by default
    await expect(page.getByTestId('switch-div')).toBeVisible();

    // Check if the toggle is OFF by default
    const switchElement = page.getByTestId('switch-div');
    // First verify the element exists
    await expect(switchElement).toBeVisible();

    // verify https://portal.sandbox-encounterservices.com/institution-settings is used
    const expectedURL = 'https://portal.sandbox-encounterservices.com/institution-settings';
    const currentURL = page.url();
    expect(currentURL).toBe(expectedURL);

    // verify subdomain field says portal
    const subdomainField = page.getByRole('textbox', { name: 'Subdomain example' });
    await expect(subdomainField).toBeVisible();
    const subdomainValue = await subdomainField.inputValue();
    expect(subdomainValue).toBe('portal');
  });

  test.skip('[Negative] Verify error is shown if White label is toggled on without subdomain @[118735] @super-admin @functional', async ({
    page,
  }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();
    await page.getByTestId('custom-dropdown-item-New Institution').nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'White label' }).click();

    // Verify White Label switch is visible and OFF by default
    await expect(page.getByTestId('switch-div')).toBeVisible();

    // Check if the toggle is OFF by default
    const switchElement = page.getByTestId('switch-div');

    // First verify the element exists
    await expect(switchElement).toBeVisible();

    // Toggle the switch to ON
    await switchElement.click();
    await page.waitForTimeout(1000);

    // clear fields
    await page.getByRole('textbox', { name: 'Organization example' }).click();
    await page.getByRole('textbox', { name: 'Organization example' }).fill('');
    await page.getByRole('textbox', { name: 'Name example' }).click();
    await page.getByRole('textbox', { name: 'Name example' }).fill('');
    await page.getByRole('textbox', { name: 'Subdomain example' }).click();
    await page.getByRole('textbox', { name: 'Subdomain example' }).fill('');

    // attempt to save
    await page.getByRole('button', { name: 'Save changes' }).click();

    // Verify error messages are shown for required fields
    await expect(page.getByText('ErrorPlease fix the errors in')).toBeVisible();
    await expect(page.getByText('A valid subdomain value must')).toBeVisible();
    await expect(page.getByText('Product name is required')).toBeVisible();
    await expect(page.getByText('Organization name is required')).toBeVisible();
  });

  // this changes the entire site so we skip for now
  test.skip('[Negative] Verify error is shown if entered subdomain already exists @[118736] @super-admin @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();

    await page.getByTestId('custom-dropdown-item-Cody Test').click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'White label' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox', { name: 'Subdomain example' }).fill('portal');

    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    // Verify error message is shown for duplicate subdomain
    await expect(page.getByText('ErrorThis subdomain already')).toBeVisible();
    await expect(page.getByText('This subdomain already exists.').first()).toBeVisible();
  });

  // this changes the entire site so we skip for now
  test.skip('Check successfully enabling White Label with unique subdomain @[118737] @super-admin @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();

    await page.getByTestId('custom-dropdown-item-Cody Test').click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();

    await page.getByRole('button', { name: 'White label' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    // wait for page to reload and verify the URL has changed to the new subdomain
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    // Wait for the URL to change from /route-me to /users-table
    await page.waitForURL('https://xj9.sandbox-encounterservices.com/users-table', { timeout: 30000 });
    const expectedURL = 'https://xj9.sandbox-encounterservices.com/users-table';
    const currentURL = page.url();
    expect(currentURL).toBe(expectedURL);

    // reset state by turning off white label
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'White label' }).click();
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    // wait for page to reload and verify the URL has changed back to the default portal subdomain
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    // Wait for the URL to change back to portal subdomain
    await page.waitForURL('https://portal.sandbox-encounterservices.com/users-table', { timeout: 30000 });
    const resetURL = 'https://portal.sandbox-encounterservices.com/users-table';
    const currentResetURL = page.url();
    expect(currentResetURL).toBe(resetURL);
  });

  // this changes the entire site so we skip for now
  test.skip('Verify "Register as a Patient" link appears on login page when White Label is ON @[118738] @super-admin @functional', async ({
    page,
  }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();

    await page.getByTestId('custom-dropdown-item-Cody Test').click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();

    await page.getByRole('button', { name: 'White label' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    // wait for page to reload and verify the URL has changed to the new subdomain
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    // Wait for the URL to change to the specific subdomain
    await page.waitForURL('https://xj9.sandbox-encounterservices.com/users-table', { timeout: 30000 });
    const expectedURL = 'https://xj9.sandbox-encounterservices.com/users-table';
    const currentURL = page.url();
    expect(currentURL).toBe(expectedURL);

    // logout
    await page.getByTestId('popover-trigger').getByTestId('avatar').locator('div').filter({ hasText: 'AG' }).locator('div').click();
    await page.getByRole('button', { name: 'LogOut Log out' }).click();
    await expect(page.getByText('Not a user? Click here:Register as a Patient')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register as a Patient' })).toBeVisible();
    await page.getByRole('link', { name: 'Register as a Patient' }).click();
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

    await page.goto('https://xj9.sandbox-encounterservices.com/login');

    // login again
    await page.getByPlaceholder('Enter email').fill(process.env.SUPER_ADMIN_USERNAME);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(1000);
    await page.getByPlaceholder('Enter your password').fill(process.env.SUPER_ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(/.*\/route-me/);
    await institutionSettingsProfilePage.waitForSpinnerToDisappear();

    // reset state by turning off white label
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();

    await page.getByTestId('custom-dropdown-item-Cody Test').click();
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'White label' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();

    // wait for page to reload and verify the URL has changed back to the default portal subdomain
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    // Wait for the URL to change back to portal subdomain
    await page.waitForURL('https://portal.sandbox-encounterservices.com/users-table', { timeout: 30000 });
    const resetURL = 'https://portal.sandbox-encounterservices.com/users-table';
    const currentResetURL = page.url();
    expect(currentResetURL).toBe(resetURL);
  });

  test.skip('Verify default login page is used when White Label is OFF @[118739] @super-admin @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Select institutionGM HealthcareAG$/ })
      .getByTestId('icon-ChevronDown')
      .click();
    await page.getByTestId('custom-dropdown-item-Cody Test').click();

    // verify white label is off
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'White label' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify White Label switch is visible and OFF by default
    const switchElement = page.getByTestId('switch-div');
    await expect(switchElement).toBeVisible();
    const isChecked = await switchElement.evaluate((el) => {
      return (
        window.getComputedStyle(el).getPropertyValue('--switch-checked') === 'true' ||
        el.classList.contains('checked') ||
        el.getAttribute('aria-checked') === 'true'
      );
    });
    expect(isChecked).toBe(false);

    //logout
    await page.getByTestId('popover-trigger').getByTestId('avatar').locator('div').filter({ hasText: 'AG' }).locator('div').click();
    await page.getByRole('button', { name: 'LogOut Log out' }).click();

    // navigate to login page and verify default login page is shown
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByText('Not a user? Click here:Register as a Patient')).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Register as a Patient' })).not.toBeVisible();
  });
});
