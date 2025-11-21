import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Schedule Appointment Patient Confirm - Total tests 3

const TEST_DATA = {
  PROVIDER_NAME: 'cody test provider',
  SERVICE_NAME: 'Pediatrics',
};

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test('Verify user can see Request confirmation modal @[111492] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE_NAME }).check();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first time slot
    await page.locator('._container_1hd2b_1').first().click();

    await page.getByTestId('erroring-text').locator('span').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByRole('heading', { name: 'Appointment confirmed' })).toBeVisible();

    // verify appointment details
    await expect(page.getByText('Session overview')).toBeVisible();
    await expect(page.getByText('Date')).toBeVisible();
    await expect(page.getByText('Day', { exact: true })).toBeVisible();
    await expect(page.getByText('Start time')).toBeVisible();
    await expect(page.getByText('End time')).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Service')).toBeVisible();
    await expect(page.getByText('Specialty')).toBeVisible();
    await expect(page.getByText('Provider', { exact: true })).toBeVisible();
    await expect(page.getByText('The next steps')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to my appointments' })).toBeVisible();
    await expect(page.getByText('Experiencing issues with your')).toBeVisible();
    await expect(page.getByText('We’re sorry for the')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Click here for support.' })).toBeVisible();

    //reset state
    await page.getByRole('button', { name: 'Go to my appointments' }).click();
    await page.getByText('Session scheduled').click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByTestId('toast').getByText('Session canceled', { exact: true })).toBeVisible();
  });

  test('Verify Support Link Navigation on Appointment Confirmed Page @[111493] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE_NAME }).check();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();

    await page.getByTestId('erroring-text').locator('span').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByRole('heading', { name: 'Appointment confirmed' })).toBeVisible();

    // verify appointment details
    await expect(page.getByText('Session overview')).toBeVisible();
    await expect(page.getByText('Date')).toBeVisible();
    await expect(page.getByText('Day', { exact: true })).toBeVisible();
    await expect(page.getByText('Start time')).toBeVisible();
    await expect(page.getByText('End time')).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Service')).toBeVisible();
    await expect(page.getByText('Specialty')).toBeVisible();
    await expect(page.getByText('Provider', { exact: true })).toBeVisible();
    await expect(page.getByText('The next steps')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to my appointments' })).toBeVisible();
    await expect(page.getByText('Experiencing issues with your')).toBeVisible();
    await expect(page.getByText('We’re sorry for the')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Click here for support.' })).toBeVisible();

    // click support link
    await page.getByRole('link', { name: 'Click here for support.' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Need Help?')).toBeVisible();
    await expect(page.getByText('Please contact your')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Got it' })).toBeVisible();
    await page.getByRole('button', { name: 'Got it' }).click();

    //reset state
    await page.getByRole('button', { name: 'Go to my appointments' }).click();
    await page.getByText('Session scheduled').click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByTestId('toast').getByText('Session canceled', { exact: true })).toBeVisible();
  });

  test('Verify Navigation to My Appointments from Appointment Confirmed Page @[111494] @patient @functional', async ({ page }) => {
    await page.getByText('Schedule an appointment').click();
    await page.getByRole('button', { name: 'Continue' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE_NAME }).check();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();

    await page.getByTestId('erroring-text').locator('span').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByRole('heading', { name: 'Appointment confirmed' })).toBeVisible();

    // verify appointment details
    await expect(page.getByText('Session overview')).toBeVisible();
    await expect(page.getByText('Date')).toBeVisible();
    await expect(page.getByText('Day', { exact: true })).toBeVisible();
    await expect(page.getByText('Start time')).toBeVisible();
    await expect(page.getByText('End time')).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Service')).toBeVisible();
    await expect(page.getByText('Specialty')).toBeVisible();
    await expect(page.getByText('Provider', { exact: true })).toBeVisible();
    await expect(page.getByText('The next steps')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Go to my appointments' })).toBeVisible();
    await expect(page.getByText('Experiencing issues with your')).toBeVisible();
    await expect(page.getByText('We’re sorry for the')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Click here for support.' })).toBeVisible();

    // click support link
    await page.getByRole('link', { name: 'Click here for support.' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Need Help?')).toBeVisible();
    await expect(page.getByText('Please contact your')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Got it' })).toBeVisible();
    await page.getByRole('button', { name: 'Got it' }).click();

    //reset state
    await page.getByRole('button', { name: 'Go to my appointments' }).click();
    await page.getByText('Session scheduled').click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByTestId('toast').getByText('Session canceled', { exact: true })).toBeVisible();
  });
});
