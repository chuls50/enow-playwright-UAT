import { test, expect } from '@playwright/test';
import { DashboardPage as PatientDashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { DashboardPage as ProviderDashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole, createAuthenticatedContext, createMultiRoleContexts } from '../../../utils/auth-helpers.js';

// Provider Dashboard - Total tests 15

// make sure that the test in this file run in series
// test.describe.configure({ mode: 'serial' });

const TEST_DATA = {
  PATIENT_NAME: 'cody test patient',
};

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let providerDashboardPage;

  test.beforeEach(async ({ page }) => {
    providerDashboardPage = new ProviderDashboardPage(page);
  });

  test('Verify Dashboard accessibility @[111452] @provider @ui', async ({ page }) => {
    // Go to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Verify navigation bar is visible
    await expect(providerDashboardPage.navbar).toBeVisible();
  });

  test('Verify "3 Dots" dropdown menu for Upcoming events @[111454] @provider @functional', async ({ page }) => {
    // Go to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Open "3 Dots" menu for the scheduled appointment
    await page.getByRole('button', { name: 'DotsV' }).click();
    await expect(page.getByRole('button', { name: 'CalendarRepeat Reschedule' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XCircle Cancel session' })).toBeVisible();

    // Reset state by cancelling the appointment
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
  });
});

test.describe('Multi-User @regression', () => {
  let patientDashboardPage;
  let providerDashboardPage;
  let patientContext;
  let providerContext;

  test.beforeEach(async ({ browser }) => {
    const contexts = await createMultiRoleContexts(browser, [ROLES.PATIENT, ROLES.PROVIDER]);
    patientContext = contexts[ROLES.PATIENT];
    providerContext = contexts[ROLES.PROVIDER];

    const patientPage = await patientContext.newPage();
    const providerPage = await providerContext.newPage();

    patientDashboardPage = new PatientDashboardPage(patientPage);
    providerDashboardPage = new ProviderDashboardPage(providerPage);
  });

  test.afterEach(async () => {
    await patientContext?.close();
    await providerContext?.close();
  });

  test('Verify Appointments section display @[111453] @provider @functional @slow', async () => {
    const providerPage = providerDashboardPage.page;
    const patientPage = patientDashboardPage.page;

    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // Verify appointment is visible on Provider Dashboard
    await expect(providerPage.getByTestId('main-card').getByText('Session scheduled').first()).toBeVisible();

    // Navigate to Patient Dashboard
    await patientDashboardPage.gotoPatientDashboard();

    // Accept the scheduled appointment
    await patientPage.getByRole('button', { name: 'Check' }).first().click();
    await expect(patientPage.getByText('Session request accepted')).toBeVisible();

    // Reschedule the appointment
    await patientPage.getByRole('button', { name: 'DotsV' }).first().click();
    await patientPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
    await patientPage.locator('div._container_1hd2b_1').first().click();
    await patientPage.getByRole('button', { name: 'Reschedule' }).click();
    await expect(patientPage.getByTestId('main-card').getByText('Session rescheduled')).toBeVisible();

    // Switch back to provider context to verify rescheduled session
    await providerPage.reload();
    await providerPage.getByText('Session rescheduled').first().waitFor({ state: 'visible' });
    await expect(providerPage.getByText('Session rescheduled').first()).toBeVisible();

    // Accept the rescheduled appointment
    await providerPage.getByTestId('main-card').getByRole('button', { name: 'Check' }).click();
    await expect(providerPage.getByText('Session request accepted')).toBeVisible();

    // Reset state by cancelling the appointment if needed
    const dotsVVisible = await providerPage.getByRole('button', { name: 'DotsV' }).first().isVisible();
    if (dotsVVisible) {
      await providerPage.getByRole('button', { name: 'DotsV' }).first().click();
      await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
      await providerPage.getByRole('button', { name: 'Yes, cancel' }).click();
    }
  });
});

//   test('Verify "Reschedule Session" screen @[111455] @provider @functional', async ({ browser }) => {
//     // Create Provider context with stored auth state
//     const providerContext = await createAuthenticatedContext(browser, ROLES.PROVIDER);
//     const providerPage = await providerContext.newPage();

//     // Initialize DashboardPage with the provider page
//     const providerDashboard = new DashboardPage(providerPage);

//     // Navigate to Provider Dashboard
//     await providerDashboard.gotoProviderDashboard();

//     // Schedule appointment for "cody test patient"
//     await providerPage.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
//     await providerPage.getByRole('link', { name: 'Change patient' }).click();
//     await providerPage.getByText('cody test patient').click();
//     await providerPage.getByRole('button', { name: 'Save' }).click();
//     // click on the first available time slot via class="_container_1hd2b_1"
//     await providerPage.locator('div._container_1hd2b_1').first().click();
//     await providerPage.getByRole('button', { name: 'Schedule visit' }).click();
//     await expect(providerPage.getByTestId('main-card').getByText('Session scheduled').first()).toBeVisible();
//     // click it
//     await providerPage.getByTestId('main-card').getByText('Session scheduled').first().click();
//     await providerPage.waitForTimeout(1000);

//     // Open "3 Dots" menu for the scheduled appointment
//     await providerPage.getByRole('button', { name: 'DotsV' }).first().click();

//     // Click on "Reschedule" option
//     await providerPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();

//     // Verify Reschedule Session screen elements
//     await expect(providerPage.getByTestId('modal')).toBeVisible();
//     await expect(providerPage.getByText('Reschedule session')).toBeVisible();
//     await expect(providerPage.getByRole('heading', { name: 'Select new date and time' })).toBeVisible();
//     await expect(providerPage.getByRole('button', { name: 'Cancel' })).toBeVisible();
//     await expect(providerPage.getByRole('button', { name: 'Reschedule' })).toBeVisible();

//     // Select a new time slot
//     await providerPage.locator('div._container_1hd2b_1').nth(1).click();

//     // Click on Reschedule button
//     await providerPage.getByRole('button', { name: 'Reschedule' }).click();

//     // Verify success message
//     await expect(providerPage.getByText('Success')).toBeVisible();
//     await expect(providerPage.getByRole('paragraph').filter({ hasText: 'Session rescheduled' })).toBeVisible();

//     // Reset state by cancelling the appointment if needed
//     // IF getByRole('button', { name: 'DotsV' }) IS VISIBLE, CLICK IT AND CANCEL THE APPOINTMENT
//     const dotsVVisible = await providerPage.getByRole('button', { name: 'DotsV' }).first().isVisible();
//     if (dotsVVisible) {
//       await providerPage.getByRole('button', { name: 'DotsV' }).first().click();
//       await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
//       await providerPage.getByRole('button', { name: 'Yes, cancel' }).click();
//     }

//     // Clean up
//     await providerContext.close();
//   });

//   test('Verify "Cancel Session" popup @[111456] @provider @functional', async ({ browser }) => {
//     // Create Provider context with stored auth state
//     const providerContext = await createAuthenticatedContext(browser, ROLES.PROVIDER);
//     const providerPage = await providerContext.newPage();

//     // Initialize DashboardPage with the provider page
//     const providerDashboard = new DashboardPage(providerPage);

//     // Navigate to Provider Dashboard
//     await providerDashboard.gotoProviderDashboard();

//     // Schedule appointment for "cody test patient"
//     await providerPage.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
//     await providerPage.getByRole('link', { name: 'Change patient' }).click();
//     await providerPage.getByText('cody test patient').click();
//     await providerPage.getByRole('button', { name: 'Save' }).click();
//     // click on the first available time slot via class="_container_1hd2b_1"
//     await providerPage.locator('div._container_1hd2b_1').first().click();
//     await providerPage.getByRole('button', { name: 'Schedule visit' }).click();
//     await expect(providerPage.getByTestId('main-card').getByText('Session scheduled').first()).toBeVisible();
//     // click it
//     await providerPage.getByTestId('main-card').getByText('Session scheduled').first().click();

//     // Open "3 Dots" menu for the scheduled appointment
//     await providerPage.getByRole('button', { name: 'DotsV' }).first().click();

//     // Click on "Cancel Session" option
//     await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();

//     // Verify Cancel Session popup elements
//     await expect(providerPage.getByTestId('modal')).toBeVisible();
//     await expect(providerPage.getByText('Cancel session?')).toBeVisible();
//     await expect(providerPage.getByRole('button', { name: 'No, don’t cancel' })).toBeVisible();
//     await expect(providerPage.getByRole('button', { name: 'Yes, cancel' })).toBeVisible();

//     // Click No, don't cancel button and verify popup closes
//     await providerPage.getByRole('button', { name: 'No, don’t cancel' }).click();
//     await expect(providerPage.getByTestId('modal')).not.toBeVisible();

//     // Reopen Cancel Session popup, then close using "X" button
//     await providerPage.getByRole('button', { name: 'DotsV' }).click();
//     await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
//     await providerPage.getByRole('button', { name: 'XClose' }).click();
//     await expect(providerPage.getByTestId('modal')).not.toBeVisible();

//     // Reset state by cancelling the appointment if needed
//     // IF getByRole('button', { name: 'DotsV' }) IS VISIBLE, CLICK IT AND CANCEL THE APPOINTMENT
//     const dotsVVisible = await providerPage.getByRole('button', { name: 'DotsV' }).first().isVisible();
//     if (dotsVVisible) {
//       await providerPage.getByRole('button', { name: 'DotsV' }).first().click();
//       await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
//       await providerPage.getByRole('button', { name: 'Yes, cancel' }).click();
//     }

//     // Clean up
//     await providerContext.close();
//   });

//   // honestly ... this is a really terrible test case anyway so skipping it
//   test.skip('Verify Scheduled Requests Section @[111457] @provider @functional', async ({ page }) => {});

//   test.skip('Verify handling for Reschedule conflicts @[111458] @provider @functional', async ({ page }) => {});

//   test.skip('Verify Notifications for session updates @[111459] @provider @functional', async ({ page }) => {});

//   test.skip('Verify Dashboard updates after actions @[111460] @provider @functional', async ({ page }) => {});

//   test.skip('Verify Reschedule screen behavior without input @[111461] @provider @functional', async ({ page }) => {});

//   test('Verify Schedule Session button functionality @[114171] @provider @functional', async ({ browser }) => {
//     // Create Provider context with stored auth state
//     const providerContext = await createAuthenticatedContext(browser, ROLES.PROVIDER);
//     const providerPage = await providerContext.newPage();

//     // Initialize DashboardPage with the provider page
//     const providerDashboard = new DashboardPage(providerPage);

//     // Navigate to Provider Dashboard
//     await providerDashboard.gotoProviderDashboard();

//     // click Schedule Session button
//     await providerPage.getByText('Schedule session').click();
//     await providerPage.waitForLoadState('networkidle');

//     // Verify URL contains the schedule-appointment path
//     await expect(providerPage).toHaveURL('https://xj9.sandbox-encounterservices.com/dashboard/schedule-appointment');

//     // Clean up
//     await providerContext.close();
//   });

//   test('Verify navigation to Session Details screen on appointment module click @[114172] @provider @functional', async ({ browser }) => {
//     // Create Provider context with stored auth state
//     const providerContext = await createAuthenticatedContext(browser, ROLES.PROVIDER);
//     const providerPage = await providerContext.newPage();

//     // Initialize DashboardPage with the provider page
//     const providerDashboard = new DashboardPage(providerPage);

//     // Navigate to Provider Dashboard
//     await providerDashboard.gotoProviderDashboard();

//     // Click on an appointment module from Today's Schedule
//     await providerPage.getByTestId('main-card').first().click();

//     // Verify navigation to Session Details screen by checking for Session Details header
//     await expect(
//       providerPage
//         .locator('div')
//         .filter({ hasText: /^Session Details#[A-Z0-9]+$/ })
//         .first()
//     ).toBeVisible();

//     // Clean up
//     await providerContext.close();
//   });

//   test('Verify Cancel button dismisses the Reschedule Session screen and discards changes @[114173] @provider @functional', async ({
//     browser,
//   }) => {
//     // Create Provider context with stored auth state
//     const providerContext = await createAuthenticatedContext(browser, ROLES.PROVIDER);
//     const providerPage = await providerContext.newPage();

//     // Initialize DashboardPage with the provider page
//     const providerDashboard = new DashboardPage(providerPage);

//     // Navigate to Provider Dashboard
//     await providerDashboard.gotoProviderDashboard();

//     // Schedule appointment for "cody test patient"
//     await providerPage.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
//     await providerPage.getByRole('link', { name: 'Change patient' }).click();
//     await providerPage.getByText('cody test patient').click();
//     await providerPage.getByRole('button', { name: 'Save' }).click();
//     // click on the first available time slot via class="_container_1hd2b_1"
//     await providerPage.locator('div._container_1hd2b_1').first().click();
//     await providerPage.getByRole('button', { name: 'Schedule visit' }).click();
//     await expect(providerPage.getByTestId('main-card').getByText('Session scheduled').first()).toBeVisible();
//     // click it
//     await providerPage.getByTestId('main-card').getByText('Session scheduled').first().click();

//     // Open "3 Dots" menu for the scheduled appointment
//     await providerPage.getByRole('button', { name: 'DotsV' }).first().click();

//     // Click on "Reschedule" option
//     await providerPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();

//     // Verify Reschedule Session screen elements
//     await expect(providerPage.getByTestId('modal')).toBeVisible();
//     await expect(providerPage.getByText('Reschedule session')).toBeVisible();
//     await expect(providerPage.getByRole('heading', { name: 'Select new date and time' })).toBeVisible();
//     await expect(providerPage.getByRole('button', { name: 'Cancel' })).toBeVisible();
//     await expect(providerPage.getByRole('button', { name: 'Reschedule' })).toBeVisible();

//     // Select a new time slot
//     await providerPage.locator('div._container_1hd2b_1').nth(1).click();

//     // Click on Cancel button
//     await providerPage.getByRole('button', { name: 'Cancel' }).click();
//     await expect(providerPage.getByTestId('modal')).not.toBeVisible();

//     // Reset state by cancelling the appointment if needed
//     // IF getByRole('button', { name: 'DotsV' }) IS VISIBLE, CLICK IT AND CANCEL THE APPOINTMENT
//     const dotsVVisible = await providerPage.getByRole('button', { name: 'DotsV' }).first().isVisible();
//     if (dotsVVisible) {
//       await providerPage.getByRole('button', { name: 'DotsV' }).first().click();
//       await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
//       await providerPage.getByRole('button', { name: 'Yes, cancel' }).click();
//     }

//     // Clean up
//     await providerContext.close();
//   });

//   test.skip('Verify appointment is declined on "X" button click @[114174] @provider @functional', async ({ browser }) => {});

//   test.skip('Verify appointment is confirmed on "Check" button click @[114175] @provider @functional', async ({ page }) => {});
// });
