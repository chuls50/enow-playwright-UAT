import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../models/pages/admin/admin-my-account.page.js';
import { useRole, ROLES } from '../../utils/auth-helpers.js';

// Admin Coordinator - Total Tests 10

test.describe('Admin+Coordinator @regression', () => {
  test.use(useRole(ROLES.ADMIN_COORDINATOR));
  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoMyAccount();
  });

  test('Verify Edit Profile screen UI elements and field states @[117700] @dual-user @ui', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Verify modal header and all form field labels are visible
    await expect(page.getByText('Edit profile detailsFirst')).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('Languages spoken')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('Country')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('State')).toBeVisible();

    // Verify action buttons are visible and Save button is initially disabled
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Check Save changes button after editing any field @[117701] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Edit first name field with unique timestamp
    await page.getByRole('textbox', { name: 'First name' }).click();
    const timestamp = Date.now();
    await page.getByRole('textbox', { name: 'First name' }).fill(`cody test ${timestamp}`);

    // Verify Save button becomes enabled after editing
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Verify multi-select behavior of Languages spoken list @[117702] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Reset state by removing Spanish if present
    const spanishChip = page.locator('div').filter({ hasText: /^Spanish$/ });
    const isVisible = await spanishChip.isVisible();
    if (isVisible) {
      await spanishChip.getByRole('button').click();
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page.getByText('SuccessProfile updated')).toBeVisible();
      await page.getByRole('button', { name: 'Edit Edit' }).click();
    }

    // Add Spanish language and verify both language chips are visible
    await page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^Languages spokenEnglish$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-Spanish').click();
    await expect(page.getByTestId('tag').first()).toBeVisible();
    await expect(page.getByTestId('tag').nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();

    // Remove newly added language and verify Save button becomes disabled
    await page.getByRole('button', { name: 'XClose' }).nth(2).click();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Remove a language chip from Languages spoken list @[117703] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Reset state by removing Spanish if present
    const spanishChip = page.locator('div').filter({ hasText: /^Spanish$/ });
    const isVisible = await spanishChip.isVisible();
    if (isVisible) {
      await spanishChip.getByRole('button').click();
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page.getByText('SuccessProfile updated')).toBeVisible();
      await page.getByRole('button', { name: 'Edit Edit' }).click();
    }

    // Open languages dropdown
    await page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^Languages spokenEnglish$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();

    // Remove last remaining language and verify validation error
    await page.getByTestId('tag').getByRole('button', { name: 'XClose' }).click();
    await expect(page.getByText('At least one language is')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Verify Country selection and enabling of State dropdown @[117704] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Select Afghanistan as country
    await page.getByTestId('custom-select-item-wrapper').nth(1).click();
    await page.getByTestId('custom-dropdown-item-Afghanistan').click();

    // Verify State dropdown becomes enabled after country selection
    await page.getByTestId('custom-select-item-wrapper').nth(2).click();
    await expect(page.getByTestId('custom-dropdown')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Verify State selection from enabled dropdown @[117705] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Select Afghanistan as country
    await page.getByTestId('custom-select-item-wrapper').nth(1).click();
    await page.getByTestId('custom-dropdown-item-Afghanistan').click();

    // Select Badakhshan state and verify Save button is enabled
    await page.getByTestId('custom-select-item-wrapper').nth(2).click();
    await page.getByText('Badakhshan').click();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Verify phone number input and formatting @[117706] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Fill phone number with formatted input
    await page.getByRole('textbox', { name: '(555) 000-' }).click();
    await page.getByRole('textbox', { name: '(555) 000-' }).fill('(123) 654 - 9876_');

    // Open country code selector and verify dropdown is visible
    await page
      .locator('div')
      .filter({ hasText: /^US \(\+1\)$/ })
      .nth(1)
      .click();
    await expect(page.getByTestId('items-wrapper')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('Cancel changes and exit Edit Profile screen @[117707] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Edit first name field with unique timestamp
    await page.getByRole('textbox', { name: 'First name' }).click();
    const timestamp = Date.now();
    await page.getByRole('textbox', { name: 'First name' }).fill(`cody test ${timestamp}`);
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();

    // Cancel changes and verify modal is closed
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Edit profile detailsFirst')).not.toBeVisible();
  });

  test('Verify saving valid changes @[117708] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Edit first name with random string
    await page.getByRole('textbox', { name: 'First name' }).click();
    const randomString = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substring(0, 6);
    await page.getByRole('textbox', { name: 'First name' }).fill(`cody test ${randomString}`);
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();

    // Save changes and verify success message
    await page.getByRole('button', { name: 'Save changes' }).click();
    await page.getByText('Profile updated successfully').waitFor({ state: 'visible' });
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    await expect(page.getByText('Edit profile detailsFirst')).not.toBeVisible();

    // Reset state to original first name
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('cody');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
  });

  test('[Negative] Attempt to save with required fields empty @[117709] @dual-user @functional', async ({ page }) => {
    // Open edit profile modal
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // Reset state by removing Spanish if present
    const spanishChip = page.locator('div').filter({ hasText: /^Spanish$/ });
    const isVisible = await spanishChip.isVisible();
    if (isVisible) {
      await spanishChip.getByRole('button').click();
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page.getByText('SuccessProfile updated')).toBeVisible();
      await page.getByRole('button', { name: 'Edit Edit' }).click();
    }

    // Clear all required fields
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('');
    await page.getByTestId('tag').getByRole('button', { name: 'XClose' }).click();

    // Submit form and verify all validation errors are displayed
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('At least one language is')).toBeVisible();
  });
});
