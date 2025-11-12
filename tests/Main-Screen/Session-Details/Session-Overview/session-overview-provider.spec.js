import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/provider/provider-dashboard.page';
import { ProviderSessionOverviewPage } from '../../../models/pages/provider/provider-session-overview.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Session Overview Provider - Total tests 18 (including 4 skipped)

// Test Data Constants
const TEST_DATA = {
  PATIENT_NAME: 'cody test patient',
  ADDED_PARTICIPANT: 'cody test coordinator',
};

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;
  let sessionOverviewPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    sessionOverviewPage = new ProviderSessionOverviewPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Validate display of Session Details with header and overview tab @[111796] @provider @functional', async ({ page }) => {
    // Schedule session and open details
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Verify header elements
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByText('Scheduled duration')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Video' }).getByRole('img')).toBeVisible();
    await expect(page.getByTestId('card').nth(1)).toBeVisible();
    await expect(page.getByTestId('icon-ClockStopwatch')).toBeVisible();

    //reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
  });

  test('Validate Past Sessions @[111798] @provider @functional', async ({ page }) => {
    // Navigate to view all past sessions
    await sessionOverviewPage.navigateToAllSessions();

    // Verify join session button is not visible for past sessions
    await expect(sessionOverviewPage.joinVideoSessionButton).not.toBeVisible();

    // Verify session date is in the past
    const sessionDateText = await sessionOverviewPage.dateCard.first().innerText();
    const sessionDate = new Date(sessionDateText);
    const currentDate = new Date();

    expect(sessionDate < currentDate).toBeTruthy();
  });

  test('Validate Canceled Sessions @[111799] @provider @functional', async ({ page }) => {
    // Navigate to view all sessions
    await sessionOverviewPage.navigateToAllSessions();

    // Verify session is marked as canceled
    await expect(sessionOverviewPage.sessionCancelledCard.first()).toBeVisible();
  });

  test('Validate Rescheduled Sessions @[111800] @provider @functional', async ({ page }) => {
    // Schedule session and open details
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Reschedule session
    await sessionOverviewPage.rescheduleSession();
    await expect(sessionOverviewPage.successToast).toBeVisible();
    await expect(sessionOverviewPage.sessionRescheduledMessage).toBeVisible();
    await page.waitForTimeout(3000);

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Verify Functionality of "3 Dots" Dropdown Menu @[111802] @provider @functional', async ({ page }) => {
    // Schedule session and open three dots menu
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();
    await sessionOverviewPage.openThreeDotsMenu();

    // Verify all menu options are visible
    await expect(sessionOverviewPage.rescheduleButton).toBeVisible();
    await expect(sessionOverviewPage.cancelSessionButton).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSessionButton.click();
    await sessionOverviewPage.yesCancelButton.click();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Verify Reschedule Session Functionality @[111803] @provider @functional', async ({ page }) => {
    // Schedule session and open details
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Reschedule session and verify success
    await sessionOverviewPage.rescheduleSession();
    await expect(sessionOverviewPage.successToast).toBeVisible();
    await expect(sessionOverviewPage.sessionRescheduledMessage).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Check Cancel Button on Reschedule Session Modal @[111804] @provider @functional', async ({ page }) => {
    // Schedule session and open details
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Open reschedule modal and cancel
    await sessionOverviewPage.cancelReschedule();

    // Verify modal behavior
    await expect(sessionOverviewPage.sessionDetailsHeader.first()).toBeVisible();
    await expect(sessionOverviewPage.rescheduleModal.first()).not.toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Verify Cancel Session Functionality @[111806] @provider @functional', async ({ page }) => {
    // Schedule session and open details
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Validate "No, Dont Cancel Button" on Cancel Session Modal @[111807] @provider @functional', async ({ page }) => {
    // Schedule session for patient
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Decline cancel session
    await sessionOverviewPage.dotsVButton.click();
    await sessionOverviewPage.cancelSessionButton.click();
    await sessionOverviewPage.noDontCancelButton.click();

    // Verify still on session details page
    await expect(page.getByRole('paragraph').filter({ hasText: 'Session scheduled' })).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Validate "Yes, Cancel Session" Button @[111808] @provider @functional', async ({ page }) => {
    // Schedule session for patient
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Check "Add Participants" Dropdown @[111809] @provider @functional', async ({ page }) => {
    // Schedule session for patient
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Open add participants dropdown and verify all options
    await expect(sessionOverviewPage.addParticipantsDropdown).toBeVisible();
    await sessionOverviewPage.openAddParticipantsDropdown();
    await expect(sessionOverviewPage.customDropdown).toBeVisible();
    await expect(sessionOverviewPage.addExistingUsersOption).toBeVisible();
    await expect(sessionOverviewPage.addExistingUsersOption).toBeEnabled();
    await expect(sessionOverviewPage.inviteExternalUserOption).toBeVisible();
    await expect(sessionOverviewPage.inviteExternalUserOption).toBeEnabled();
    await expect(sessionOverviewPage.copyInvitationLinkOption).toBeVisible();
    await expect(sessionOverviewPage.copyInvitationLinkOption).toBeEnabled();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Validate Adding Existing Users @[111810] @provider @functional', async ({ page }) => {
    // Schedule session and add existing participant
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();
    await sessionOverviewPage.addExistingUser(TEST_DATA.ADDED_PARTICIPANT);

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Verify search functionality and participant addition
    await expect(sessionOverviewPage.addExistingUsersOption).toBeVisible();
    await expect(sessionOverviewPage.searchByNameTextbox).toBeVisible();
    await expect(page.getByText(TEST_DATA.ADDED_PARTICIPANT)).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Check Copying Session Invitation Link @[111811] @provider @functional', async ({ page }) => {
    // Schedule session and copy invitation link
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();
    await sessionOverviewPage.copyInvitationLink();

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Verify add participants dropdown is present and invitation link was copied successfully
    await expect(sessionOverviewPage.addParticipantsDropdown).toBeVisible();
    await expect(sessionOverviewPage.invitationLinkCopiedMessage).toBeVisible();

    // Cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });

  test('Validate Viewing Participant Profile @[111812] @provider @functional', async () => {
    // Schedule session and open details
    await sessionOverviewPage.scheduleSessionForPatient(TEST_DATA.PATIENT_NAME);
    await sessionOverviewPage.openSessionDetails();

    // Verify header elements
    await expect(sessionOverviewPage.sessionDetailsHeader).toBeVisible();
    await expect(sessionOverviewPage.scheduledDurationText).toBeVisible();
    await expect(sessionOverviewPage.videoIcon).toBeVisible();
    await expect(sessionOverviewPage.clockStopwatchIcon).toBeVisible();

    // Open patient profile
    await sessionOverviewPage.openPatientProfile(TEST_DATA.PATIENT_NAME);
    await expect(sessionOverviewPage.cancelSessionModal).toBeVisible();

    // Verify all patient profile fields are visible
    await expect(sessionOverviewPage.firstNameField).toBeVisible();
    await expect(sessionOverviewPage.lastNameField).toBeVisible();
    await expect(sessionOverviewPage.dobField).toBeVisible();
    await expect(sessionOverviewPage.sexField).toBeVisible();
    await expect(sessionOverviewPage.countryField).toBeVisible();
    await expect(sessionOverviewPage.stateField).toBeVisible();
    await expect(sessionOverviewPage.cityField).toBeVisible();
    await expect(sessionOverviewPage.zipCodeField).toBeVisible();
    await expect(sessionOverviewPage.address1Field).toBeVisible();
    await expect(sessionOverviewPage.address2Field).toBeVisible();
    await expect(sessionOverviewPage.phoneNumberField).toBeVisible();
    await expect(sessionOverviewPage.taxIdField).toBeVisible();
    await expect(sessionOverviewPage.insuranceField).toBeVisible();
    await expect(sessionOverviewPage.insurancePolicyNumberField).toBeVisible();
    await sessionOverviewPage.closeModalButton.click();

    // Close modal and cancel session to reset state
    await sessionOverviewPage.cancelSession();
    await expect(sessionOverviewPage.sessionCanceledToast).toBeVisible();
  });
});

test.describe('Multi-user @regression', () => {
  let dashboardPage;
  let sessionOverviewPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    sessionOverviewPage = new ProviderSessionOverviewPage(page);
  });

  // skipping multi-user tests for now
  test.skip('Validate Confirm Reschedule Button @[111805] @multi-user @functional', async ({}) => {});

  // skipping anything payments for now
  test.skip('Validate Payment-Required Sessions @[111801] @multi-user @functional', async ({ page }) => {});

  // skipping multi-user tests for now
  test.skip('Validate Future Scheduled Sessions @[111797] @multi-user @functional', async ({}) => {});

  // dependent on whether the waiting room is on/off
  test.skip('Validate Join Session Button @[111813] @multi-user @functional', async ({ browser }) => {
    // Create separate contexts with camera/microphone permissions for video calls
    const providerContext = await browser.newContext({
      permissions: ['camera', 'microphone'],
    });
    const patientContext = await browser.newContext({
      permissions: ['camera', 'microphone'],
    });

    const providerPage = await providerContext.newPage();
    const patientPage = await patientContext.newPage();

    const providerBasePage = new BasePage(providerPage);
    const patientBasePage = new BasePage(patientPage);

    try {
      // Provider login and setup
      await providerBasePage.performProviderLogin();
      await providerPage.waitForLoadState('networkidle');
      await resetStateIfSessionScheduled(providerPage);

      //schedule session for cody patient two
      await providerPage.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
      await providerPage.getByRole('link', { name: 'Change patient' }).click();
      await providerPage.getByText('cody patient two').click();
      await providerPage.getByRole('button', { name: 'Save' }).click();

      // click the first time slot available
      await providerPage.locator('._container_1hd2b_1').first().click();

      // schedule the visit
      await providerPage.getByRole('button', { name: 'Schedule visit' }).click();
      await expect(providerPage.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
      await providerPage.getByTestId('toast').getByText('Session scheduled', { exact: true }).waitFor({ state: 'hidden' });

      // reschedule the appointment
      await providerPage.getByText('Session scheduled').first().click();
      await providerPage.getByRole('button', { name: 'DotsV' }).click();
      await providerPage.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();

      // click the first calendar time slot available
      await providerPage.locator('._container_1hd2b_1').first().click();
      await providerPage.getByRole('button', { name: 'Reschedule' }).click();
      await expect(providerPage.getByText('Success')).toBeVisible();
      await expect(providerPage.getByRole('paragraph').filter({ hasText: 'Session rescheduled' })).toBeVisible();
      await providerPage.waitForTimeout(4000);
      await providerPage.getByRole('button', { name: 'XClose' }).click();

      // Patient login in separate context to accept the rescheduled appointment
      await patientBasePage.performPatientLogin();
      await patientPage.waitForLoadState('networkidle');

      // wait for /dashboard to load
      await patientPage.waitForURL(/.*\/dashboard/);
      await expect(patientPage).toHaveURL(/.*\/dashboard/);

      // accept appointment as patient
      await expect(patientPage.getByRole('button', { name: 'Check' })).toBeVisible();
      await patientPage.getByRole('button', { name: 'Check' }).click();
      await expect(patientPage.getByText('Session request accepted')).toBeVisible();

      // Back to provider context - verify the accepted session
      // await providerPage.reload();
      await providerPage.waitForLoadState('networkidle');

      // CLICK data-testid="main-card" with class="sc-hlDTgW enzraZ" , aka the confirmed appointment card
      await providerPage.locator('div[data-testid="main-card"].sc-hlDTgW.enzraZ').first().click();

      // verify join session button
      await expect(providerPage.getByRole('button', { name: 'Video Join video session' })).toBeVisible();

      // click join session button - this will open in a new page with video permissions already granted
      const videoPagePromise = providerPage.waitForEvent('popup');
      await providerPage.getByRole('button', { name: 'Video Join video session' }).click();
      const videoPage = await videoPagePromise;

      // Wait for video session page to load and verify waiting room elements
      await videoPage.getByRole('button', { name: 'MessageChatCircle' }).waitFor({ state: 'visible' });
      await expect(videoPage.getByRole('button', { name: 'MessageChatCircle' })).toBeVisible();
      await expect(videoPage.getByRole('button', { name: 'FileHeart' })).toBeVisible();
      await expect(videoPage.getByTestId('icon-ClockStopwatch')).toBeVisible();
      await expect(videoPage.getByText('Welcome to waiting room!')).toBeVisible();
      await expect(videoPage.getByText('When you are ready to start')).toBeVisible();
      await expect(videoPage.getByRole('button', { name: 'Start session' })).toBeVisible();
      await expect(videoPage.getByRole('button', { name: 'LogOut Leave waiting room' })).toBeVisible();

      // Clean up by leaving the waiting room and canceling the session
      await videoPage.getByRole('button', { name: 'LogOut Leave waiting room' }).click();
      await videoPage.getByRole('button', { name: 'DotsV' }).click();
      await videoPage.getByRole('button', { name: 'XCircle Cancel session' }).click();
      await videoPage.getByRole('button', { name: 'Yes, cancel' }).click();
      await expect(videoPage.getByText('Session canceled')).toBeVisible();
    } finally {
      // Clean up contexts
      await providerContext.close();
      await patientContext.close();
    }
  });
});
