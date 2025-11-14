import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Appointment Change Service - Total tests 5

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test('Verify Schedule Appointment Change Service on Schedule an Appointment Page @[111503] @patient @ui', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();
    await expect(page.getByText('Change service')).toBeVisible();
    await expect(page.getByText('Search')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by service name' })).toBeVisible();
    await expect(page.getByTestId('radio-group')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
  });

  test('Verify Search Functionality on Change Service Slideout @[111504] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();

    await page.getByRole('textbox', { name: 'Search by service name' }).click();
    await page.getByRole('textbox', { name: 'Search by service name' }).fill('Pediatrics');
    await expect(page.getByRole('radio', { name: 'Pediatrics' })).toBeVisible();
    await expect(page.getByText('General Practice')).not.toBeVisible();
  });

  test('Verify Service Selection via Radio Button on Change Service Slideout @[111505] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();

    await page.getByRole('textbox', { name: 'Search by service name' }).click();
    await page.getByRole('textbox', { name: 'Search by service name' }).fill('Pediatrics');
    await expect(page.getByRole('radio', { name: 'Pediatrics' })).toBeVisible();

    await page.getByRole('radio', { name: 'Pediatrics' }).check();
    await expect(page.getByTestId('radio-group').getByText('Type')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  test('Verify Cancel Button Functionality on Change Service Slideout @[111506] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();

    await page.getByRole('textbox', { name: 'Search by service name' }).click();
    await page.getByRole('textbox', { name: 'Search by service name' }).fill('Pediatrics');
    await expect(page.getByRole('radio', { name: 'Pediatrics' })).toBeVisible();

    await page.getByRole('radio', { name: 'Pediatrics' }).check();
    await expect(page.getByTestId('radio-group').getByText('Type')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Pediatrics')).not.toBeVisible();
  });

  test('Verify Save Changes Functionality on Change Service Slideout @[111508] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();

    await page.getByRole('textbox', { name: 'Search by service name' }).click();
    await page.getByRole('textbox', { name: 'Search by service name' }).fill('Pediatrics');
    await expect(page.getByRole('radio', { name: 'Pediatrics' })).toBeVisible();

    await page.getByRole('radio', { name: 'Pediatrics' }).check();
    await expect(page.getByTestId('radio-group').getByText('Type')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(1000); // wait for 1 second to allow UI to update
    await expect(page.getByText('Pediatrics')).toBeVisible();
  });
});
