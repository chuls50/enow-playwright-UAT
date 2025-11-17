import { test, expect } from '@playwright/test';
import { CoordinatorDashboardPage } from '../../../models/pages/coordinator/coordinator-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';
import path from 'path';

// Schedule Appointment Coordinator - Total Tests 7

test.describe('Schedule Coordinator @regression', () => {
  test.use(useRole(ROLES.COORDINATOR));
  let coordinatorDashboardPage;

  test.beforeEach(async ({ page }) => {
    coordinatorDashboardPage = new CoordinatorDashboardPage(page);
    await coordinatorDashboardPage.gotoCoordinatorDashboard();
  });

  // bug submitted here 11/14/25
  test('Verify Schedule Session Screen Content on Clicking "Schedule Session" Button @[111789] @coordinator @ui', async ({ page }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Verify Schedule Session screen content

    await expect(page.getByText('Schedule a session')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your appointment' })).toBeVisible();
    await expect(page.getByText('Service', { exact: true })).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Duration', { exact: true })).toBeVisible();
    await expect(page.getByText('Provider', { exact: true })).toBeVisible();
    await expect(page.getByText('Patient', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change service' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change type' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change duration' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change provider' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change patient' })).toBeVisible();

    //datetime
    await expect(page.getByRole('heading', { name: 'Select date and time' })).toBeVisible();
    await expect(page.getByText('Please choose a preferred')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();

    //attachments
    await expect(page.getByRole('heading', { name: 'Attachments' })).toBeVisible();
    await expect(page.getByText('Upload any relevant')).toBeVisible();
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();
  });

  test('Verify Date Selection Using Calendar Tool on Schedule Session Page @[111790] @coordinator @functional', async ({ page }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // select date from calendar
    await page.getByRole('button', { name: 'ChevronRight' }).click();
    await page.locator('.react-datepicker__day.react-datepicker__day--001').first().click();

    // verify selected date by checking that aria-selected="true"
    await expect(page.locator('.react-datepicker__day.react-datepicker__day--001').first()).toHaveAttribute('aria-selected', 'true');
  });

  test('Verify Time Selection from Available Time Slots on Schedule Session Page @[111791] @coordinator @functional', async ({ page }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // select time slot
    await page.locator('._container_1hd2b_1').first().click();

    // verify selected time slot by checking that it has class class="_container_1hd2b_1 _active_1hd2b_24"
    await expect(page.locator('._container_1hd2b_1').first()).toHaveClass(/.*_active_1hd2b_24.*/);
  });

  test('Verify File Selection Using "Choose Files" Link on Schedule Session Page @[111792] @coordinator @functional', async ({ page }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Set up file chooser promise before triggering the file dialog
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click choose files link
    await page.getByRole('link', { name: 'Choose files' }).click();

    // Wait for the file chooser dialog and set the file
    const fileChooser = await fileChooserPromise;

    // Use the requested image file path
    const testFilePath = path.join(process.cwd(), 'tests', 'images', 'hieroglyphics-10.jpg');
    await fileChooser.setFiles(testFilePath);

    // Verify the file was uploaded successfully - adjust the selector based on your UI
    await page.waitForTimeout(2000); // wait for 2 seconds to ensure upload completes
    await expect(page.getByRole('img', { name: 'document preview' })).toBeVisible();
  });

  test('Verify Session Cancellation Using "Cancel" Button on Schedule Session Page @[111793] @coordinator @functional', async ({
    page,
  }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify that we are back on the main dashboard by checking for the presence of the "Schedule Appointment" button
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();

    // verify toast never appears
    await expect(page.getByText('Appointment scheduled successfully')).not.toBeVisible();
  });

  test('[Negative] Verify "Schedule Session" Button Requires Mandatory Inputs on Schedule Session Page @[111794] @coordinator @functional', async ({
    page,
  }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Click Schedule visit button without entering any inputs
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // Verify that error messages are displayed for mandatory fields
    await expect(page.getByText('Patient is required')).toBeVisible();
    await expect(page.getByText('Time slot is not selected')).toBeVisible();
  });

  // this e2e workflow depends on a lot of thingss
  test.skip('Verify Successful Appointment Scheduling with All Inputs Provided on Schedule Session Page @[111795] @coordinator @functional', async ({
    page,
  }) => {
    // Click on Schedule Appointment in the sidebar
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Verify Schedule Session screen content
    await expect(page.getByText('Schedule a session')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your appointment' })).toBeVisible();
    await expect(page.getByText('Service', { exact: true })).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Duration', { exact: true })).toBeVisible();
    await expect(page.getByText('Provider', { exact: true })).toBeVisible();
    await expect(page.getByText('Patient', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change service' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change type' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change duration' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change provider' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change patient' })).toBeVisible();

    // Select Patient and Provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^John DoeProviderGeneral Practitioner$/ })
      .first()
      .click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByRole('link', { name: 'User type ChevronDown' }).click();
    await page.getByTestId('item Patient').click();
    await page.getByRole('button', { name: 'Apply Filter' }).click();
    await page.getByText('cody patient two').click();
    await page.getByRole('button', { name: 'Save' }).click();

    //datetime
    await expect(page.getByRole('heading', { name: 'Select date and time' })).toBeVisible();
    await expect(page.getByText('Please choose a preferred')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();

    //attachments
    await expect(page.getByRole('heading', { name: 'Attachments' })).toBeVisible();
    await expect(page.getByText('Upload any relevant')).toBeVisible();
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule visit' })).toBeVisible();

    // select date from calendar
    await page.getByRole('button', { name: 'ChevronRight' }).click();
    await page.locator('.react-datepicker__day.react-datepicker__day--001').first().click();
    // verify selected date by checking that aria-selected="true"
    await expect(page.locator('.react-datepicker__day.react-datepicker__day--001').first()).toHaveAttribute('aria-selected', 'true');

    // select time slot
    await page.locator('._container_1hd2b_1').first().click();
    // verify selected time slot by checking that it has class class="_container_1hd2b_1 _active_1hd2b_24"
    await expect(page.locator('._container_1hd2b_1').first()).toHaveClass(/.*_active_1hd2b_24.*/);

    // Set up file chooser promise before triggering the file dialog
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click choose files link
    await page.getByRole('link', { name: 'Choose files' }).click();

    // Wait for the file chooser dialog and set the file
    const fileChooser = await fileChooserPromise;

    // Use the requested image file path
    const testFilePath = path.join(process.cwd(), 'images', 'hieroglyphics-10.jpg');
    await fileChooser.setFiles(testFilePath);

    // Verify the file was uploaded successfully - adjust the selector based on your UI
    await basePage.waitForSpinnerToDisappear();
    await expect(page.getByRole('img', { name: 'document preview' })).toBeVisible();

    // Click Schedule visit button
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByText('Session scheduled', { exact: true })).toBeVisible({ timeout: 15000 });

    // logout
    await page.locator('div:nth-child(2) > .sc-fbguzk').click();
    await page.getByRole('button', { name: 'LogOut Log out' }).click();

    // login as patient2
    await basePage.performPatientLogin();

    // reset state
    await page.getByText('Session scheduled').first().click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });
});
