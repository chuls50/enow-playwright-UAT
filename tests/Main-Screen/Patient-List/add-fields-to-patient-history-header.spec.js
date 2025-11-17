import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';
import { DashboardPage } from '../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Add Fields to Patient History Header - Total tests 3
test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test('Verify Content on "Before we get started" Page @[111192] @patient @ui', async ({ page }) => {
    // Navigate to participant form as patient
    await page.goto(`${process.env.UAT_URL}/first-login/participant-form`);

    // Verify page header is displayed
    await page.getByRole('heading', { name: 'Before we get started' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Before we get started' })).toBeVisible();

    // Verify insurance information section with all fields
    await expect(page.getByRole('heading', { name: 'Insurance information' })).toBeVisible();
    await expect(page.getByText('Tax ID')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Tax ID' })).toBeVisible();
    await expect(page.getByText('Insurance policy number')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Insurance policy number' })).toBeVisible();
    await expect(page.getByText('Insurance', { exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Insurance', exact: true })).toBeVisible();
  });

  test('Verify Patient Appointment History screen opens and displays correct UI elements @[116581] @patient @functional', async ({
    page,
  }) => {
    // wait for cell-0-actions to be visible
    await page.getByTestId('cell-0-actions').waitFor({ state: 'visible', timeout: 15000 });

    // open appointment history
    await page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' }).click();

    // verify Session Details header is displayed followed by session ID #
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Session Details#[A-Z0-9]+$/ })
        .first()
    ).toBeVisible();
  });
});

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let basePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goto(`${process.env.UAT_URL}/dashboard`);
    await basePage.waitForSpinnerToDisappear();
  });

  test('Verify additional fields added to patient history header @[118855] @provider @ui', async ({ page }) => {
    // Navigate to participant form as provider
    await page.goto(`${process.env.UAT_URL}/patients`);

    // Select first available patient from the list
    try {
      await page.getByTestId('cell-0-name').click();
    } catch (error) {
      await page.getByTestId('cell-1-name').click();
    }

    // Verify patient history page loads with new header fields
    await expect(page.getByRole('heading', { name: 'Past sessions' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Tax ID')).toBeVisible();
    await expect(page.getByText('Insurance', { exact: true })).toBeVisible();
    await expect(page.getByText('Insurance policy number')).toBeVisible();
  });
});
