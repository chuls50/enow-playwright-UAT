import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Schedule Appointment Change Provider -

const TEST_DATA = {
  PROVIDER_FULL_NAME: 'cody prov',
  SERVICE_NAME: 'General Practice',
};

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
    // Click Schedule an appointment
    await dashboardPage.clickScheduleAppointment();

    // Wait for symptom checker to load
    await dashboardPage.skipManualSymptomChecker();

    // Select Service
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE_NAME }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Wait for schedule appointment page to load
    await page.getByRole('link', { name: 'Change provider' }).waitFor({ state: 'visible' });

    // Click Change provider to open slideout
    await page.getByRole('link', { name: 'Change provider' }).click();

    // Wait for Change provider slideout to load
    await expect(page.locator('div').filter({ hasText: /^Change provider$/ })).toBeVisible();
  });

  test('Verify Schedule Appointment Change Provider on Change Provider Slideout @[111495] @patient @ui', async ({ page }) => {
    // Verify Change provider slideout elements
    await expect(page.locator('div').filter({ hasText: /^Any available provider$/ })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by name' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'User type ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Specialty ChevronDown' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('Verify Search Functionality on Change Provider Slideout @[111496] @patient @functional', async ({ page }) => {
    // Click on the search textbox
    await page.getByRole('textbox', { name: 'Search by name' }).click();

    // Type a provider name to search
    await page.getByRole('textbox', { name: 'Search by name' }).fill(TEST_DATA.PROVIDER_FULL_NAME);

    // Verify that the provider appears in the search results
    await expect(page.getByText(TEST_DATA.PROVIDER_FULL_NAME)).toBeVisible();

    // Search by a different name
    await page.getByRole('textbox', { name: 'Search by name' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).fill('Jane Smith');

    // Verify that the previous provider is no longer visible
    await expect(page.getByText(TEST_DATA.PROVIDER_FULL_NAME)).not.toBeVisible();
  });

  test('Verify Filter Functionality on Change Provider Slideout @[111497] @patient @functional', async ({ page }) => {
    // Open and apply Provider filter
    await page.getByRole('link', { name: 'User type ChevronDown' }).click();
    await page.getByTestId('item Provider').click();
    await page.getByRole('button', { name: 'Apply Filter' }).click();

    // Verify filter by user type
    await expect(page.getByTestId('badge').getByText('Provider').first()).toBeVisible();

    // Apply specialties filter
    await page.getByRole('link', { name: 'Specialty ChevronDown' }).click();
    await page.getByTestId('item Allergologist').click();
    await page.getByRole('button', { name: 'Apply Filter' }).click();

    // Verify filter by specialty
    await expect(page.getByTestId('filter-panel').getByText('Allergologist')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByTestId('filter-panel').getByText('Allergologist')).not.toBeVisible();
  });

  test('Verify Any Available Provider Checkbox Behavior (Unchecked State) @[111498] @patient @functional', async ({ page }) => {
    // Verify "Any available provider" is visible
    await expect(page.locator('div').filter({ hasText: /^Any available provider$/ })).toBeVisible();

    // Select a specific provider
    await page.getByText(TEST_DATA.PROVIDER_FULL_NAME).click();

    // Verify Save button is enabled and click it
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify selected provider is displayed on schedule appointment page
    await expect(page.getByText(`Provider${TEST_DATA.PROVIDER_FULL_NAME}`)).toBeVisible();
  });

  test('Verify Any Available Provider Checkbox Behavior (Checked State) @[111499] @patient @functional', async ({ page }) => {
    // Verify "Any available provider" is visible
    await expect(page.locator('div').filter({ hasText: /^Any available provider$/ })).toBeVisible();

    // Select a specific provider
    await page.getByText(TEST_DATA.PROVIDER_FULL_NAME).click();

    // Verify Save button is enabled
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();

    // Check "Any available provider" option
    await page.getByText('Any available provider').click();

    // Verify Save button is disabled
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();

    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify previously selected provider is not displayed on schedule appointment page
    await expect(page.getByText(`Provider${TEST_DATA.PROVIDER_FULL_NAME}`)).not.toBeVisible();
  });

  test('Verify Provider Row Selection on Change Provider Slideout @[111500] @patient @functional', async ({ page }) => {
    // Verify "Any available provider" is visible
    await expect(page.locator('div').filter({ hasText: /^Any available provider$/ })).toBeVisible();

    // Select a specific provider
    await page.getByText(TEST_DATA.PROVIDER_FULL_NAME).click();

    // Verify Save button is enabled and click it
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify selected provider is displayed on schedule appointment page
    await expect(page.getByText(`Provider${TEST_DATA.PROVIDER_FULL_NAME}`)).toBeVisible();
  });

  test('Verify Cancel Button Behavior on Change Provider Slideout @[111501] @patient @functional', async ({ page }) => {
    // Verify "Any available provider" is visible
    await expect(page.locator('div').filter({ hasText: /^Any available provider$/ })).toBeVisible();

    // Select a specific provider
    await page.getByText(TEST_DATA.PROVIDER_FULL_NAME).click();

    // Verify Save button is enabled
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();

    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify previously selected provider is not displayed on schedule appointment page
    await expect(page.getByText(`Provider${TEST_DATA.PROVIDER_FULL_NAME}`)).not.toBeVisible();
  });

  test('Verify Save Changes Functionality on Change Provider Slideout @[111502] @patient @functional', async ({ page }) => {
    // Verify "Any available provider" is visible
    await expect(page.locator('div').filter({ hasText: /^Any available provider$/ })).toBeVisible();

    // Select a specific provider
    await page.getByText(TEST_DATA.PROVIDER_FULL_NAME).click();

    // Verify Save button is enabled and click it
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify selected provider is displayed on schedule appointment page
    await expect(page.getByText(`Provider${TEST_DATA.PROVIDER_FULL_NAME}`)).toBeVisible();
  });
});
