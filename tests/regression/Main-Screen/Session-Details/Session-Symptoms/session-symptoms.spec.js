import { test, expect } from '@playwright/test';
import { BasePage } from '../../../../models/base-page.js';

// Session Symptoms - Total tests: 3

// This .spec file tests on the PROD environment and is assuming that
// interactive triage has been ENABLED by the super admin

// Note: "Symptom checker" / "Interactive triage" functionality is always ENABLED on PROD
// --> That is why we have to run this .spec on PROD

// Here, we are testing on the "Global Healthcare" institution on PROD, which has interactive triage ENABLED

test.describe('Patient (PROD) @regression', () => {
  let basePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    // Log in and navigate to appointment scheduling
    await basePage.performPatientLogin();
    await page.getByText('Schedule an appointment').waitFor({ state: 'visible', timeout: 15000 });
  });

  test('Verify Navigation to Symptoms Tab @[112573] @patient @functional', async ({ page }) => {
    // sort by date to find an appointment that has added symptoms
    await page.getByTestId('sort-button-date').click();

    // Click on the first appointment's "View details" link
    await page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' }).click();

    // Navigate to the Symptoms tab
    await page.getByRole('button', { name: 'Symptoms' }).click();

    // Verify the presence of Symptoms tab elements
    await expect(page.getByText('Described symptoms')).toBeVisible();
    await expect(page.getByText('Reported symptoms')).toBeVisible();
    await expect(page.getByText('Other symptoms')).toBeVisible();

    // Verify the presence of the Other Symptoms section
    await expect(page.getByText('Present')).toBeVisible();
    await expect(page.getByText('Absent')).toBeVisible();
  });

  test('Verify the Display of Symptoms Data @[112574] @patient @functional', async ({ page }) => {
    // sort by date to find an appointment that has added symptoms
    await page.getByTestId('sort-button-date').click();

    // Click on the first appointment's "View details" link
    await page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' }).click();

    // Navigate to the Symptoms tab
    await page.getByRole('button', { name: 'Symptoms' }).click();

    // Verify the Described symptoms is displayed with a submission date
    await expect(page.getByText(/Described symptoms/)).toBeVisible();
    await expect(page.getByText(/Submitted on/)).toBeVisible();

    // Verify the Risk Factors section is displayed with at least one risk factor
    await expect(page.getByText('Risk Factors')).toBeVisible();
    await expect(page.getByText('Smoking cigarettes')).toBeVisible();

    // Verify the Other symptoms - Present section
    await expect(page.getByText('Present')).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Residence or recent travel,' }).getByTestId('icon-Check')).toBeVisible();

    // Verify the Other symptoms - Absent section
    await expect(page.getByText('Absent')).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Reported exposure to cold' }).getByTestId('icon-XClose')).toBeVisible();
  });

  // skipping this one bc it requires a patient with no symptoms added, which is hard to find on PROD
  test.skip('Verify Symptoms Tab Behavior with No Symptoms Available @[112919] @patient @functional', async ({ page }) => {});
});
