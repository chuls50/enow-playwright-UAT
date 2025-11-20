import { test, expect } from '@playwright/test';
import { DashboardPage as PatientDashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { DashboardPage as ProviderDashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole, createMultiRoleContexts } from '../../../utils/auth-helpers.js';

// Provider Dashboard - Total tests 15 (including 4 skipped)

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
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Verify navigation bar is visible
    await expect(providerDashboardPage.navbar).toBeVisible();
  });

  test('Verify "3 Dots" dropdown menu for Upcoming events @[111454] @provider @functional', async ({ page }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Open "3 Dots" menu for the scheduled appointment
    await page.getByRole('button', { name: 'DotsV' }).click();

    // Verify dropdown menu options
    await expect(page.getByRole('button', { name: 'CalendarRepeat Reschedule' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XCircle Cancel session' })).toBeVisible();

    // Reset state by cancelling the appointment
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();

    // Verify appointment is cancelled
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify "Reschedule Session" screen @[111455] @provider @functional', async ({ page }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // Verify appointment is visible on Provider Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Rescedule the appointment from Session Details
    await providerDashboardPage.rescheduleAppointmentFromSessionDetails();

    // Verify session is successfully rescheduled
    await expect(page.getByText('Success')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Session rescheduled' })).toBeVisible();

    // Reset state by cancelling the appointment
    await providerDashboardPage.cancelAppointmentFromSessionDetails();

    // Verify appointment is cancelled
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify "Cancel Session" popup @[111456] @provider @functional', async ({ page }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // Verify appointment is visible on Provider Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Open "3 Dots" menu for the scheduled appointment
    await page.getByRole('button', { name: 'DotsV' }).first().click();

    // Click on "Cancel Session" option
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();

    // Verify Cancel Session popup elements
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Cancel session?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'No, don’t cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yes, cancel' })).toBeVisible();

    // Click No, don't cancel button and verify popup closes
    await page.getByRole('button', { name: 'No, don’t cancel' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Reopen Cancel Session popup, then close using "X" button
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'XClose' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Reset state by cancelling the appointment if needed
    await providerDashboardPage.cancelAppointmentFromSessionDetails();

    // Verify appointment is cancelled
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify Schedule Session button functionality @[114171] @provider @functional', async ({ page }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // click Schedule Session button
    await providerDashboardPage.scheduleSessionButton.click();
    await page.waitForLoadState('networkidle');

    // Verify URL contains the schedule-appointment path
    await expect(page).toHaveURL(`${process.env.UAT_URL}/dashboard/schedule-appointment`);
  });

  test('Verify navigation to Session Details screen on appointment module click @[114172] @provider @functional', async ({ page }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Click on an appointment module from Today's Schedule
    await page.getByTestId('main-card').first().click();

    // Verify Session Details heading displays the Session ID
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Session Details#[A-Z0-9]+$/ })
        .first()
    ).toBeVisible();
  });

  test('Verify Cancel button dismisses the Reschedule Session screen and discards changes @[114173] @provider @functional', async ({
    page,
  }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // Verify appointment is visible on Provider Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Open "3 Dots" menu for the scheduled appointment
    await page.getByRole('button', { name: 'DotsV' }).first().click();

    // Click on "Reschedule" option
    await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();

    // Verify Reschedule Session screen elements
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Reschedule session')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Select new date and time' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reschedule' })).toBeVisible();

    // Select a new time slot
    await page.locator('div._container_1hd2b_1').nth(1).click();

    // Click on Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify Reschedule Session screen is closed
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Reset state by cancelling the appointment if needed
    await providerDashboardPage.cancelAppointmentFromSessionDetails();

    // Verify appointment is cancelled
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify Dashboard updates after actions @[111460] @provider @functional', async ({ page }) => {
    // Navigate to Provider Dashboard
    await providerDashboardPage.gotoProviderDashboard();

    // Schedule appointment for "cody test patient"
    await providerDashboardPage.scheduleAppointmentWithPatient(TEST_DATA.PATIENT_NAME);

    // Verify appointment is visible on Provider Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Reset state by cancelling the appointment
    await providerDashboardPage.cancelAppointmentFromSessionDetails();

    // Verify Session canceled message is visible on Provider Dashboard
    await expect(page.getByText('Session canceled')).toBeVisible();
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

  test('Verify Appointments section display @[111453] @multi-user @functional', async ({ page }) => {
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

    // Patient accept the scheduled appointment
    await patientPage.getByRole('button', { name: 'Check' }).first().click();
    await expect(patientPage.getByText('Session request accepted')).toBeVisible();

    // Patient reschedule the appointment
    await patientPage.getByRole('button', { name: 'DotsV' }).first().click();
    await patientPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
    await patientPage.locator('div._container_1hd2b_1').first().click();
    await patientPage.getByRole('button', { name: 'Reschedule' }).click();
    await expect(patientPage.getByTestId('main-card').getByText('Session rescheduled')).toBeVisible();

    // Switch back to provider context to verify rescheduled session
    await providerPage.getByText('Session rescheduled').first().waitFor({ state: 'visible' });
    await expect(providerPage.getByText('Session rescheduled').first()).toBeVisible();

    // Accept the rescheduled appointment
    await providerPage.getByTestId('main-card').getByRole('button', { name: 'Check' }).click();
    await expect(providerPage.getByText('Session request accepted')).toBeVisible();

    // Reset state by cancelling the appointment if needed
    await providerPage.getByRole('button', { name: 'DotsV' }).first().click();
    await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await providerPage.getByRole('button', { name: 'Yes, cancel' }).click();

    // Verify appointment is cancelled
    await expect(providerPage.getByText('Session canceled')).toBeVisible();
  });

  test('Verify appointment is declined on "X" button click @[114174] @multi-user @functional', async ({ page }) => {
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

    // Patient accept the scheduled appointment
    await patientPage.getByRole('button', { name: 'Check' }).first().click();
    await expect(patientPage.getByText('Session request accepted')).toBeVisible();

    // Patient reschedule the appointment
    await patientPage.getByRole('button', { name: 'DotsV' }).first().click();
    await patientPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
    await patientPage.locator('div._container_1hd2b_1').first().click();
    await patientPage.getByRole('button', { name: 'Reschedule' }).click();
    await expect(patientPage.getByTestId('main-card').getByText('Session rescheduled')).toBeVisible();

    // Switch back to provider context to verify rescheduled session
    await providerPage.getByText('Session rescheduled').first().waitFor({ state: 'visible' });
    await expect(providerPage.getByText('Session rescheduled').first()).toBeVisible();

    // Decline the rescheduled appointment
    await providerPage.getByTestId('main-card').getByRole('button', { name: 'X' }).click();
    await providerPage.getByText('Yes, decline').click();

    // Verify appointment is declined
    await expect(providerPage.getByText('Session request declined')).toBeVisible();
  });

  test('Verify appointment is confirmed on "Check" button click @[114175] @multi-user @functional', async ({ page }) => {
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

    // Patient accept the scheduled appointment
    await patientPage.getByRole('button', { name: 'Check' }).first().click();
    await expect(patientPage.getByText('Session request accepted')).toBeVisible();

    // Patient reschedule the appointment
    await patientPage.getByRole('button', { name: 'DotsV' }).first().click();
    await patientPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();
    await patientPage.locator('div._container_1hd2b_1').first().click();
    await patientPage.getByRole('button', { name: 'Reschedule' }).click();
    await expect(patientPage.getByTestId('main-card').getByText('Session rescheduled')).toBeVisible();

    // Switch back to provider context to verify rescheduled session
    await providerPage.getByText('Session rescheduled').first().waitFor({ state: 'visible' });
    await expect(providerPage.getByText('Session rescheduled').first()).toBeVisible();

    // Confirm the rescheduled appointment
    await providerPage.getByTestId('main-card').getByRole('button', { name: 'Check' }).click();
    await expect(providerPage.getByText('Session request accepted')).toBeVisible();

    // Open 'Session Scheduled' main card
    await providerPage.getByRole('button', { name: 'DotsV' }).first().click();
    await providerPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await providerPage.getByRole('button', { name: 'Yes, cancel' }).click();

    // Verify appointment is cancelled
    await expect(providerPage.getByText('Session canceled')).toBeVisible();
  });

  test.skip('Verify Scheduled Requests Section @[111457] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify handling for Reschedule conflicts @[111458] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Notifications for session updates @[111459] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Reschedule screen behavior without input @[111461] @multi-user @functional', async ({ page }) => {});
});
