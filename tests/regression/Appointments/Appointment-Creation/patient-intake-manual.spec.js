import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Patient Intake Manual - Total tests 8/8

// This .spec file tests on the UAT environment and is assuming that
// interactive triage has been DISABLED by the super admin

// Note: "Symptom checker" / "Interactive triage" functionality is always ENABLED on PROD
// --> That is why we have to run this .spec on UAT

// Here, we are testing on the "Cody Test" institution on UAT, which has interactive triage DISABLED

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test('Validate the Display of "My Symptoms" Screen when Interactive Triage is Disabled @[113451] @patient @ui', async ({ page }) => {
    // await basePage.performUATPatientLogin();

    // click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    //verify the "My Symptoms" screen is displayed
    await expect(page.getByRole('heading', { name: 'My symptoms' })).toBeVisible();

    // verify the presense of UI elements on the screen
    await expect(page.getByText('Please list your symptoms by')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Start typing your symptom' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Didn’t find your symptoms?' })).toBeVisible();
    await expect(page.getByText('Describe your physical or')).toBeVisible();
    await expect(page.getByText('Other symptoms')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Describe other symptoms' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Estimate how long have you' })).toBeVisible();
    await expect(page.getByText('Please add your symptoms first')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('Verify Autocomplete Functionality in "My Symptoms" Text Box @[113452] @patient @functional', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Begin typing a symptom
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).click();
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).fill('back');

    // Verify that autocomplete suggestions are displayed
    await expect(page.getByTestId('custom-dropdown-item-Back pain')).toBeVisible();

    // Choose a suggestion from the autocomplete list
    await page.getByTestId('custom-dropdown-item-Back pain').click();

    // Verify that the selected symptom is added to the symptoms list
    await expect(page.getByText('Back pain')).toBeVisible();

    // Click on the X to remove the symptom
    await page.getByRole('button', { name: 'XClose' }).click();

    // Verify that the symptom has been removed from the list
    await expect(page.getByText('Back pain')).not.toBeVisible();
  });

  test('Verify Entry and Handling in "Didnt find your symptoms?" Text Box @[113453] @patient @functional', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Enter text in the "Didn’t find your symptoms?" text box'
    await page.getByRole('textbox', { name: 'Describe other symptoms' }).click();
    await page.getByRole('textbox', { name: 'Describe other symptoms' }).fill('I have this thing where i freakout 1/2 the time');

    // Verify that the entered text is displayed
    await expect(page.getByRole('textbox', { name: 'Describe other symptoms' })).toHaveValue(
      'I have this thing where i freakout 1/2 the time'
    );

    // Clear the text box
    await page.getByRole('textbox', { name: 'Describe other symptoms' }).fill('');

    // Verify that the text box is cleared
    await expect(page.getByRole('textbox', { name: 'Describe other symptoms' })).toHaveValue('');
  });

  test('Check Click Here for Support Link Functionality @[113631] @patient @ui', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Click on the "Click here for support" link
    await page.getByRole('link', { name: 'Click here for support.' }).click();

    // Verify Modal Elements
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Need Help?')).toBeVisible();
    await expect(page.getByText('Please contact your')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Got it' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();

    // Close the modal
    await page.getByRole('button', { name: 'Got it' }).click();

    // Verify the modal is closed
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Validate the Behavior of "Continue" Button @[113632] @patient @functional', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Add a symptom
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).click();
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).fill('back');
    await page.getByTestId('custom-dropdown-item-Back pain').click();

    // Add time period
    await page.getByRole('button', { name: 'Days' }).click();
    await page.getByRole('textbox', { name: 'Enter a number' }).click();
    await page.getByRole('textbox', { name: 'Enter a number' }).fill('4');

    // Click the "Continue" button
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify navigation to the "Select date and time" screen
    await expect(page.getByRole('heading', { name: 'Select date and time' })).toBeVisible();
  });

  test('Check Visibility of Time Period Fields @[113633] @patient @ui', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Verify that time period fields are not visible initially
    await expect(page.getByText('Please add your symptoms first')).toBeVisible();

    // Add symptom
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).click();
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).fill('back');
    await page.getByTestId('custom-dropdown-item-Back pain').click();

    // Verify that time period fields are now visible
    await expect(page.getByRole('heading', { name: 'Estimate how long have you' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hours' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Days' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Months' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Years' })).toBeVisible();
    await expect(page.getByText('Number')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter a number' })).toBeVisible();
  });

  test(' [Negative] Check "Continue" button Functionality with No Input @[113640] @patient @functional', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Click the "Continue" button without adding any symptoms
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify navigation to the "Select date and time" screen
    await expect(page.getByRole('heading', { name: 'Select date and time' })).toBeVisible();
  });

  test(' Verify "Clear All" link Functionality @[113641] @patient @functional', async ({ page }) => {
    // Click on schedule an appointment
    await page.getByText('Schedule an appointment').click();

    // Add multiple symptoms
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).click();
    await page.getByRole('textbox', { name: 'Start typing your symptom' }).fill('back');
    await page.getByTestId('custom-dropdown-item-Back pain').click();

    await page.getByRole('textbox', { name: 'Start typing your symptom' }).fill('head');
    await page.getByTestId('custom-dropdown-item-Headache').click();

    // Click the "Clear All" link
    await page.getByText('Clear All').click();

    // Verify that all symptoms have been removed
    await expect(page.getByText('Back pain')).not.toBeVisible();
    await expect(page.getByText('Headache')).not.toBeVisible();
  });
});
