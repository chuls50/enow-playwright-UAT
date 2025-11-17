import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Session Overview Patient - total tests 7
const TEST_DATA = {
  SERVICE: 'Pediatrics',
  PROVIDER_NAME: 'cody test provider Cody Test',
  PATIENT_NAME: 'cody test patient',
};

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
    await dashboardPage.resetStateIfSessionScheduled();
  });

  test('Verify components the dropdown menu on "3 Dots" button in the "Session Details" @[113242] @patient @ui', async ({ page }) => {
    //schedule appointment
    await dashboardPage.scheduleAppointment.click();

    // click past manual symptom checker if it appears
    await dashboardPage.skipManualSymptomChecker();

    // select service
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    //click first available time slot
    await page.locator('._container_1hd2b_1').first().click();

    // accept notice of consent
    await page.locator('.sc-cxgKzJ').click();

    // schedule visit
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // go to my appointments
    await page.getByRole('button', { name: 'Go to my appointments' }).click();

    // open scheduled appointment
    await page.getByText('Session scheduled').first().click();

    // click 3 dots menu
    await page.getByRole('button', { name: 'DotsV' }).click();

    // verify dropdown menu items
    await expect(page.getByRole('button', { name: 'CalendarRepeat Reschedule' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XCircle Cancel session' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled').first()).toBeVisible();
  });

  test('Check and Access Other Tabs in Session Details @[113243] @patient @ui', async ({ page }) => {
    // go to scheduled appointment
    await page.getByText('Session cancelled').first().click();
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await page.getByRole('button', { name: 'Symptoms' }).click();
    await expect(page.getByText('Described symptoms')).toBeVisible();

    // if symptoms sections are visible, verify them
    const riskFactorsElement = page.getByText('Risk factors');
    const reportedSymptomsElement = page.getByText('Reported symptoms');
    const otherSymptomsElement = page.getByText('Other symptoms');

    if (await riskFactorsElement.isVisible()) {
      await expect(riskFactorsElement).toBeVisible();
    }

    if (await reportedSymptomsElement.isVisible()) {
      await expect(reportedSymptomsElement).toBeVisible();
    }

    if (await otherSymptomsElement.isVisible()) {
      await expect(otherSymptomsElement).toBeVisible();
    }

    // verify summary and attachments sections
    await page.getByRole('button', { name: 'Summary' }).click();
    await expect(page.getByText('Visit Summary reportExport PDF')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await page.getByRole('button', { name: 'Payments' }).click();

    // verify payments tab, if payments enabled for the service
    if (await page.getByRole('heading', { name: 'Payments' }).isVisible()) {
      await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();
    }
  });

  test('Verify the components of the Session Details slide out for Upcomming Appointments @[113245] @patient @ui', async ({ page }) => {
    // go to scheduled appointment
    await page.getByText('Session cancelled').first().click();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Session cancelled' })).toBeVisible();
    await expect(page.getByText('Scheduled duration')).toBeVisible();
    await expect(page.getByTestId('icon-ClockStopwatch')).toBeVisible();
    await expect(page.getByTestId('tabs')).toBeVisible();
    await page.getByRole('button', { name: 'Overview' }).click();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByText(TEST_DATA.PATIENT_NAME)).toBeVisible();
  });

  test('Verify cancelation of a scheduled appointment @[113246] @patient @functional', async ({ page }) => {
    //schedule appointment
    await dashboardPage.scheduleAppointment.click();

    // click past manual symptom checker if it appears
    await dashboardPage.skipManualSymptomChecker();

    // select service
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    //click first available time slot
    await page.locator('._container_1hd2b_1').first().click();

    // accept notice of consent
    await page.locator('.sc-cxgKzJ').click();

    // schedule visit
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // go to my appointments
    await page.getByRole('button', { name: 'Go to my appointments' }).click();

    // open scheduled appointment
    await page.getByText('Session scheduled').first().click();

    // click 3 dots menu
    await page.getByRole('button', { name: 'DotsV' }).click();

    // verify dropdown menu items
    await expect(page.getByRole('button', { name: 'CalendarRepeat Reschedule' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XCircle Cancel session' })).toBeVisible();

    // click "Cancel session"
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();

    // verify session is canceled
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify rescheduling of a scheduled appointment @[113250] @patient @functional', async ({ page }) => {
    //schedule appointment
    await dashboardPage.scheduleAppointment.click();

    // click past manual symptom checker if it appears
    await dashboardPage.skipManualSymptomChecker();

    // select service
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    //click first available time slot
    await page.locator('._container_1hd2b_1').first().click();

    // accept notice of consent
    await page.locator('.sc-cxgKzJ').click();

    // schedule visit
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // go to my appointments
    await page.getByRole('button', { name: 'Go to my appointments' }).click();

    // open scheduled appointment
    await page.getByText('Session scheduled').first().click();

    // click 3 dots menu
    await page.getByRole('button', { name: 'DotsV' }).click();

    // verify dropdown menu items
    await expect(page.getByRole('button', { name: 'CalendarRepeat Reschedule' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XCircle Cancel session' })).toBeVisible();

    // click "Reschedule"
    await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();

    // select a new time
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Reschedule' }).click();

    // verify session is rescheduled
    await expect(page.getByText('Success')).toBeVisible();
    await expect(page.getByText('Session rescheduled').first()).toBeVisible();

    // then cancel session to reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify the dropdown menu when the "3 Dots" button is clicked in "Session Details" @[113251] @patient @ui', async ({ page }) => {
    //schedule appointment
    await dashboardPage.scheduleAppointment.click();

    // click past manual symptom checker if it appears
    await dashboardPage.skipManualSymptomChecker();

    // select service
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    //click first available time slot
    await page.locator('._container_1hd2b_1').first().click();

    // accept notice of consent
    await page.locator('.sc-cxgKzJ').click();

    // schedule visit
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // go to my appointments
    await page.getByRole('button', { name: 'Go to my appointments' }).click();

    // open scheduled appointment
    await page.getByText('Session scheduled').first().click();

    // click 3 dots menu
    await page.getByRole('button', { name: 'DotsV' }).click();

    // verify dropdown menu items
    await expect(page.getByRole('button', { name: 'CalendarRepeat Reschedule' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XCircle Cancel session' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled').first()).toBeVisible();
  });

  test('[Negative] Verify Reschedule Appointment from Session Details Cancel @[114047] @patient @functional', async ({ page }) => {
    //schedule appointment
    await dashboardPage.scheduleAppointment.click();

    // click past manual symptom checker if it appears
    await dashboardPage.skipManualSymptomChecker();

    // select service
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: TEST_DATA.SERVICE }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText(TEST_DATA.PROVIDER_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    //click first available time slot
    await page.locator('._container_1hd2b_1').first().click();

    // accept notice of consent
    await page.locator('.sc-cxgKzJ').click();

    // schedule visit
    await page.getByRole('button', { name: 'Schedule visit' }).click();

    // go to my appointments
    await page.getByRole('button', { name: 'Go to my appointments' }).click();

    // open scheduled appointment
    await page.getByText('Session scheduled').first().click();

    // click 3 dots menu
    await page.getByRole('button', { name: 'DotsV' }).click();

    // click "Reschedule"
    await page.getByRole('button', { name: 'CalendarRepeat Reschedule' }).click();

    // verify reschedule modal opens up
    await expect(page.getByText('Reschedule session')).toBeVisible();

    // click the first available time slot
    await page.locator('._container_1hd2b_1').first().click();

    // click cancel
    await page.getByRole('button', { name: 'Cancel' }).click();

    // verify session is still scheduled
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // cancel to reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled').first()).toBeVisible();
  });
});
