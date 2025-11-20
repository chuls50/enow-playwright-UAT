import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// total tests 8

const TEST_DATA = {
  DEVICE_NAME: 'Hatsune Mikuuuu',
  PATIENT_NAME: 'cody test patient',
  COORDINATOR_NAME: 'cody test coordinator Cody',
};

test.describe('Multi-User @regression', () => {
  test.use(useRole(ROLES.PROVIDER_COORDINATOR));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Check Participant Badge Display for Device ID Role in Session Details @[115024] @multi-user @functional', async ({ page }) => {
    // Schedule session for device 'Hatsune Mikuuuu'
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.DEVICE_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('div._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await page.waitForTimeout(2000);

    // Verify appointment is visible on Provider-Coordinator Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Verify Overview tab and participant badges are displayed
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();

    // Cancel the session to reset state
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Check Other Participant Badge Details in Overview Tab @[115025] @multi-user @functional', async ({ page }) => {
    // Schedule session for device 'Hatsune Mikuuuu'
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.DEVICE_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('div._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await page.waitForTimeout(2000);

    // Verify appointment is visible on Provider-Coordinator Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Verify Overview tab and participant badges are displayed
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();

    // Add additional coordinator participant
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await page.getByText('Add existing user(s)').click();
    await page.getByText(TEST_DATA.COORDINATOR_NAME).click();
    await page.getByRole('button', { name: 'Add participant' }).click();

    // Verify coordinator participant badge details
    await expect(page.getByText('Provider (Allergologist,').first()).toBeVisible();
    await expect(page.getByText('Coordinator', { exact: true })).toBeVisible();

    // Cancel the session to reset state
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Ensure Badge Renders Correctly When Participant Photo Is Missing @[115026] @multi-user @functional', async ({ page }) => {
    // Schedule session for device 'Hatsune Mikuuuu'
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.DEVICE_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('div._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await page.waitForTimeout(2000);

    // Verify appointment is visible on Provider-Coordinator Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Verify Overview tab and participant badges are displayed
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();

    // Verify device participant badge without photo
    await expect(page.getByRole('paragraph').filter({ hasText: TEST_DATA.DEVICE_NAME })).toBeVisible();
    await expect(page.getByText('H', { exact: true })).toBeVisible();

    // Cancel the session to reset state
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('[Negative] Ensure Device ID Badge Is Not Displayed When Not Assigned @[115027] @provider @functional', async ({ page }) => {
    // Schedule session for device 'Hatsune Mikuuuu'
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('div._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await page.waitForTimeout(2000);

    // Verify appointment is visible on Provider-Coordinator Dashboard
    await expect(page.getByText('Session scheduled').first()).toBeVisible();

    // click it
    await page.getByTestId('main-card').getByText('Session scheduled').first().click();

    // Verify Overview tab and participant badges are displayed
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();

    // Verify Device ID badge is not displayed
    await expect(page.getByText('Device ID')).not.toBeVisible();

    // Cancel the session to reset state
    await page.getByRole('button', { name: 'DotsV' }).first().click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Session canceled')).toBeVisible();
  });
});

test.describe('Device-ID @regression', () => {
  test.use(useRole(ROLES.DEVICE_USER));
  let basePage;

  test.beforeEach(async ({ page }) => {
    basePage = new DashboardPage(page);
    await basePage.goto(`${process.env.UAT_URL}/dashboard`);
  });

  test('[Negative] Ensure Schedule Appointment Buttons Are Not Displayed for Device ID  @[115535] @device @ui', async ({ page }) => {
    // verify "Schedule an Appointment" and "See a Provider Now" buttons are not visible
    await expect(page.getByRole('button', { name: 'Schedule an Appointment' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'See a Provider Now' })).not.toBeVisible();
  });

  test('Verify Participants Tab Displays Device ID Badge in Session Details @[115536] @device @ui', async ({ page }) => {
    // Navigate to session details
    await page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' }).click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // Verify Participants tab and device ID badge
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByText(`${TEST_DATA.DEVICE_NAME} (you)`)).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();
  });

  test('Validate Payments Tab Displays “Not Applicable” for Device ID @[115537] @device @ui', async ({ page }) => {
    // Navigate to session details
    await page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' }).click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // Navigate to Payments tab and verify "Not applicable" message
    await page.getByRole('button', { name: 'Payments' }).click();
    await expect(page.getByText('No insurance or payment information is required to schedule')).toBeVisible();
  });

  test('Verify the components of the "Session Details" slide out for Upcoming appointments @[118826] @device @ui', async ({ page }) => {
    // Navigate to session details
    await page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' }).click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // verify payments tab
    await page.getByRole('button', { name: 'Payments' }).click();
    await expect(page.getByText('No insurance or payment information is required to schedule')).toBeVisible();

    // verify Attachments tab
    await page.getByRole('button', { name: 'Attachments' }).click();
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();

    // verify Summary tab
    await page.getByRole('button', { name: 'Summary' }).click();
    await expect(page.getByText('Visit Summary report')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Export PDF' })).toBeVisible();

    // verify Symptoms tab
    await page.getByRole('button', { name: 'Symptoms' }).click();
    await expect(page.getByText('Described symptoms')).toBeVisible();

    // verify Documents tab
    await page.getByRole('button', { name: 'Documents' }).click();
    await expect(page.getByText('Documents').nth(1)).toBeVisible();
    await expect(page.getByText('No documents yet')).toBeVisible();
  });
});
