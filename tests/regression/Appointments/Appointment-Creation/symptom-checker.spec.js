import { test, expect } from '@playwright/test';
// import { BasePage } from '../../../models/base-page.js';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';

// Patient Symptom Checker - Total tests 6/6

// This .spec file tests on the PROD environment and is assuming that
// interactive triage has been ENABLED by the super admin

// Note: "Symptom checker" / "Interactive triage" functionality is always ENABLED on PROD

// Here, we are testing on the "Global Healthcare" institution on PROD, which has interactive triage ENABLED

test.describe('Patient Symptom Checker @regression', () => {
  // let basePage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    // basePage = new BasePage(page);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.performPatientLogin();
  });

  test('Patient symptom checker is displayed after scheduling an appointment @[111471] @patient @ui', async ({ page }) => {
    // Click Schedule an appointment
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('heading', { name: 'How does each of these' }).waitFor({ state: 'visible' });

    // Verify symptom checker elements
    await expect(page.getByRole('heading', { name: 'How does each of these' })).toBeVisible();
    await expect(page.getByText('Select one answer for each')).toBeVisible();
    await expect(page.getByText('Recent physical injury')).toBeVisible();
    await expect(page.getByText('Smoking cigarettes')).toBeVisible();
    await expect(page.getByText('History of allergy in myself')).toBeVisible();
    await expect(page.getByText('Overweight and obesity')).toBeVisible();
    await expect(page.getByText('Diagnosed diabetes')).toBeVisible();
    await expect(page.getByText('Diagnosed hypertension')).toBeVisible();
  });

  test('Patient symptom checker is displayed after selecting "See a provider now" @[111472] @patient @ui', async ({ page }) => {
    // Click See a provider now
    await page.getByText('See a provider now').click();
    await page.getByRole('heading', { name: 'How does each of these' }).waitFor({ state: 'visible' });

    // Verify symptom checker elements
    await expect(page.getByRole('heading', { name: 'How does each of these' })).toBeVisible();
    await expect(page.getByText('Select one answer for each')).toBeVisible();
    await expect(page.getByText('Recent physical injury')).toBeVisible();
    await expect(page.getByText('Smoking cigarettes')).toBeVisible();
    await expect(page.getByText('History of allergy in myself')).toBeVisible();
    await expect(page.getByText('Overweight and obesity')).toBeVisible();
    await expect(page.getByText('Diagnosed diabetes')).toBeVisible();
    await expect(page.getByText('Diagnosed hypertension')).toBeVisible();
  });

  test('Selecting a response option highlights the selected option @[111473] @patient @functional', async ({ page }) => {
    // Click See a provider now
    await page.getByText('See a provider now').click();
    await page.getByRole('heading', { name: 'How does each of these' }).waitFor({ state: 'visible' });

    // Click radio button and verify it is checked
    await page.locator('.sc-jquVwK').first().check();
    await expect(page.locator('.sc-jquVwK').first()).toBeChecked();
  });

  test('Navigating to the next step after completing the symptom checker @[111474] @patient @functional', async ({ page }) => {
    // Click See a provider now
    await page.getByText('See a provider now').click();
    await page.getByRole('heading', { name: 'How does each of these' }).waitFor({ state: 'visible' });

    // Select "Yes" for all questions
    await page.locator('.sc-jquVwK').first().check();
    await page.locator('.sc-jquVwK').nth(3).check();
    await page.locator('.sc-jquVwK').nth(6).check();
    await page.locator('.sc-jquVwK').nth(9).check();
    await page.locator('.sc-jquVwK').nth(12).check();
    await page.locator('.sc-jquVwK').nth(15).check();

    // Click the "Submit" button
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify Add your symptoms screen
    await page.getByRole('heading', { name: 'Add your symptoms' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Add your symptoms' })).toBeVisible();
  });

  test('Navigation back to the previous screen from the symptom checker @[111475] @patient @functional', async ({ page }) => {
    // Click See a provider now
    await page.getByText('See a provider now').click();
    await page.getByRole('heading', { name: 'How does each of these' }).waitFor({ state: 'visible' });

    // Select "Yes" for all questions
    await page.locator('.sc-jquVwK').first().check();
    await page.locator('.sc-jquVwK').nth(3).check();
    await page.locator('.sc-jquVwK').nth(6).check();
    await page.locator('.sc-jquVwK').nth(9).check();
    await page.locator('.sc-jquVwK').nth(12).check();
    await page.locator('.sc-jquVwK').nth(15).check();

    // Click the "Submit" button
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify Add your symptoms screen
    await page.getByRole('heading', { name: 'Add your symptoms' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Add your symptoms' })).toBeVisible();

    // Navigate back to previous screen using browser history
    await page.goBack();

    // Verify we are on dashboard
    await page.getByRole('heading', { name: 'Upcoming appointments' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Upcoming appointments' })).toBeVisible();
  });

  test('Verify "Submit" button remains enabled and prevents moving to the next screen until all responses are provided @[111476] @patient @functional', async ({
    page,
  }) => {
    await page.getByText('See a provider now').click();
    await page.getByRole('heading', { name: 'How does each of these' }).waitFor({ state: 'visible' });

    // Click "Yes" radio button for "Recent physical injury"
    await page.locator('.sc-jquVwK').first().check();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify that the error 'This field is required' is displayed
    await expect(page.getByText('This field is required').first()).toBeVisible();

    await page.locator('.sc-jquVwK').first().check();
    await page.locator('.sc-jquVwK').nth(3).check();
    await page.locator('.sc-jquVwK').nth(6).check();
    await page.locator('.sc-jquVwK').nth(9).check();
    await page.locator('.sc-jquVwK').nth(12).check();
    await page.locator('.sc-jquVwK').nth(15).check();

    // Click the "Submit" button
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify Add your symptoms screen
    await page.getByRole('heading', { name: 'Add your symptoms' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Add your symptoms' })).toBeVisible();
  });
});
