import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../../models/pages/provider/provider-dashboard.page.js';
import { ProviderSessionOverviewPage } from '../../../../models/pages/provider/provider-session-overview.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';
import { BasePage } from '../../../../models/base-page.js';

// total tests 8

// this test suite is going to need a lot of work

// might just want to re-record it honestly

test.describe('Multi-User @regression', () => {
  test.use(useRole(ROLES.PROVIDER_COORDINATOR));
  let dashboardPage;
  let providerSessionOverviewPage;
  let basePage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    providerSessionOverviewPage = new ProviderSessionOverviewPage(page);
    basePage = new BasePage(page);
  });

  //skipping multi user test for now
  test.skip('Check Participant Badge Display for Device ID Role in Session Details @[115024] @multi-user @functional', async ({ page }) => {
    // click schedule session button
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // select service
    await page.getByRole('link', { name: 'Change service' }).click();
    await page.getByRole('radio', { name: 'Pediatrics' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText('cody test provider').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // select device 'Hatsune Mikuuuu' (33255419)
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).fill('mikuuuu');
    await page.getByText('Hatsune Mikuuuu').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first available time slot
    await page.locator('div._container_1hd2b_1').first().click();

    // schedule the session
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByText('Session scheduled', { exact: true })).toBeVisible({ timeout: 10000 });
    // CLOSE THE NOTIFICATION IF IT IS VISIBLE !!!
    if (await page.getByRole('link', { name: 'XClose' }).isVisible()) {
      await page.getByRole('link', { name: 'XClose' }).click();
    }

    // logout ProviderCoordinator
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'LogOut Log out' }).click();
    await page.waitForLoadState('networkidle');

    // login as provider
    await basePage.performUATProviderLogin();

    // accept request
    await page.getByRole('button', { name: 'Check' }).first().click();
    await expect(page.getByText('Session request accepted')).toBeVisible();

    // click the first Hatsune mikuuu in the list to open session details
    await page
      .locator('div')
      .filter({ hasText: /^Hatsune Mikuuuu$/ })
      .first()
      .click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // verify overview tab is displayed
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Hatsune Mikuuuu' })).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();

    // close the notification if it is visible
    if (await page.getByRole('link', { name: 'XClose' }).isVisible()) {
      await page.getByRole('link', { name: 'XClose' }).click();
    }

    // close session details
    await page.getByRole('button', { name: 'XClose' }).click();

    // Reset state: cancel the session if DotsV button is visible
    if (await page.getByRole('button', { name: 'DotsV' }).first().isVisible()) {
      await page.getByRole('button', { name: 'DotsV' }).first().click();
      await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
      await page.getByRole('button', { name: 'Yes, cancel' }).click();
      await page.getByText('Session canceled').waitFor({ state: 'visible' });
      await expect(page.getByText('Session canceled')).toBeVisible();
    }
  });

  // skipping multi user test for now
  test.skip('Check Other Participant Badge Details in Overview Tab @[115025] @multi-user @functional', async ({ page }) => {
    await basePage.performProviderCoordinatorLogin();

    // click schedule session button
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // select 'Toxicology Report'
    await page.getByRole('link', { name: 'Change service' }).click();
    await page.getByRole('radio', { name: 'Toxicology Report' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // select provider (CODY TEST USER provider two)
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText('CODY TEST USER provider two').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // select device 'Hatsune Mikuuuu' (33255419)
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).fill('mikuuuu');
    await page.getByText('Hatsune Mikuuuu').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first available time slot
    await page.locator('div._container_1hd2b_1').first().click();

    // schedule the session
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByText('Session scheduled', { exact: true })).toBeVisible({ timeout: 10000 });
    // CLOSE THE NOTIFICATION IF IT IS VISIBLE !!!
    if (await page.getByRole('link', { name: 'XClose' }).isVisible()) {
      await page.getByRole('link', { name: 'XClose' }).click();
    }

    // logout ProviderCoordinator
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'LogOut Log out' }).click();
    await page.waitForLoadState('networkidle');

    // login as provider
    await basePage.performProviderLogin();

    // accept request
    await page.getByRole('button', { name: 'Check' }).first().click();
    await expect(page.getByText('Session request accepted')).toBeVisible();

    // open session details for Hatsune Mikuuuu
    await page
      .locator('div')
      .filter({ hasText: /^Hatsune Mikuuuu$/ })
      .first()
      .click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // verify overview tab and participant badges are displayed
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Hatsune Mikuuuu' })).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();

    // verify device ID badge details
    await page.getByText('HHatsune Mikuuuu Device ID').click();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Device ID')).toBeVisible();
    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByRole('button', { name: 'XClose' }).click();

    // verify provider badge details
    await page.getByText('CPCODY TEST USER provider two').click();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Medical specialty')).toBeVisible();
    await expect(page.getByText('Languages spoken')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await page.getByRole('button', { name: 'XClose' }).click();

    // close the notification if it is visible
    if (await page.getByRole('link', { name: 'XClose' }).isVisible()) {
      await page.getByRole('link', { name: 'XClose' }).click();
    }

    // close session details
    await page.getByRole('button', { name: 'XClose' }).click();

    // Reset state: cancel the session if DotsV button is visible
    if (await page.getByRole('button', { name: 'DotsV' }).first().isVisible()) {
      await page.getByRole('button', { name: 'DotsV' }).first().click();
      await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
      await page.getByRole('button', { name: 'Yes, cancel' }).click();
      await expect(page.getByText('Session canceled')).toBeVisible();
    }
  });

  // skipping multi user test for now
  test.skip('Ensure Badge Renders Correctly When Participant Photo Is Missing @[115026] @multi-user @functional', async ({ page }) => {
    await basePage.performProviderCoordinatorLogin();

    // Schedule session between provider2 and device4
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();

    // Select Toxicology Report service
    await page.getByRole('link', { name: 'Change service' }).click();
    await page.getByRole('radio', { name: 'Toxicology Report' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Select provider (CODY TEST USER provider two)
    await page.getByRole('link', { name: 'Change provider' }).click();
    await page.getByText('CODY TEST USER provider two').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Select patient (device4)
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).click();
    await page.getByRole('textbox', { name: 'Search by name' }).fill('mikuuuu');
    await page.getByText('Hatsune Mikuuuu').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first available time slot
    await page.locator('div._container_1hd2b_1').first().click();

    // schedule the session
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByText('Session scheduled', { exact: true })).toBeVisible({ timeout: 10000 });
    // CLOSE THE NOTIFICATION IF IT IS VISIBLE !!!
    if (await page.getByRole('link', { name: 'XClose' }).isVisible()) {
      await page.getByRole('link', { name: 'XClose' }).click();
    }

    // Logout ProviderCoordinator
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'LogOut Log out' }).click();
    await page.waitForLoadState('networkidle');

    // Login as provider
    await basePage.performProviderLogin();

    // Accept session request
    await page.getByRole('button', { name: 'Check' }).first().click();
    await expect(page.getByText('Session request accepted')).toBeVisible();

    // Open session details for Hatsune Mikuuuu
    await page
      .locator('div')
      .filter({ hasText: /^Hatsune Mikuuuu$/ })
      .first()
      .click();
    await expect(page.getByText('Session Details')).toBeVisible();

    // Verify overview tab and participant badges are displayed
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Hatsune Mikuuuu' })).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();

    // Verify device ID badge is rendered without profile photo
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^HHatsune Mikuuuu Device ID$/ })
        .locator('div')
        .nth(2)
    ).toBeVisible();
    await expect(page.getByText('HHatsune Mikuuuu Device ID')).toBeVisible();

    // Close session details
    await page.getByRole('button', { name: 'XClose' }).click();

    // Reset state: cancel the session if DotsV button is visible
    if (await page.getByRole('button', { name: 'DotsV' }).first().isVisible()) {
      await page.getByRole('button', { name: 'DotsV' }).first().click();
      await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
      await page.getByRole('button', { name: 'Yes, cancel' }).click();
      await expect(page.getByText('Session canceled')).toBeVisible();
    }
  });

  // skipping multi user test for now
  test.skip('[Negative] Ensure Device ID Badge Is Not Displayed When Not Assigned @[115027] @provider @functional', async ({ page }) => {
    await basePage.performProviderLogin();
    await page.waitForLoadState('networkidle');

    //schedule session for cody patient two
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText('cody patient two').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first available time slot
    await page.locator('div._container_1hd2b_1').first().click();

    // schedule the session
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible({ timeout: 15000 });
    // CLOSE THE NOTIFICATION IF IT IS VISIBLE !!!
    if (await page.getByRole('link', { name: 'XClose' }).isVisible()) {
      await page.getByRole('link', { name: 'XClose' }).click();
    }

    // check session summary header
    await page.getByText('Session scheduled', { exact: true }).first().click();
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByText('Scheduled duration')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Video' }).getByTestId('icon-Video')).toBeVisible();
    await expect(page.getByTestId('icon-ClockStopwatch')).toBeVisible();

    // verify device id badge is not displayed
    await expect(page.getByText('Device ID')).not.toBeVisible();

    // reset state to no upcomming schedules
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await page.getByText('Session canceled').waitFor({ state: 'visible' });
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test.skip('[Negative] Ensure Schedule Appointment Buttons Are Not Displayed for Device ID  @[115535] @device @ui', async ({ page }) => {
    await page.goto('https://portal.encounterservices.com/login/device');

    // login device 4
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill('33255419');
    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await page.goto('https://portal.encounterservices.com/dashboard');

    // verify "Schedule an Appointment" and "See a Provider Now" buttons are not visible
    await expect(page.getByRole('button', { name: 'Schedule an Appointment' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'See a Provider Now' })).not.toBeVisible();
  });

  test.skip('Verify Participants Tab Displays Device ID Badge in Session Details @[115536] @device @ui', async ({ page }) => {
    await page.goto('https://portal.encounterservices.com/login/device');

    // login device 4
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill('33255419');
    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await page.goto('https://portal.encounterservices.com/dashboard');

    // verify "Schedule an Appointment" and "See a Provider Now" buttons are not visible
    await expect(page.getByRole('button', { name: 'Schedule an Appointment' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'See a Provider Now' })).not.toBeVisible();

    // click the first view details link
    await page.locator('text=View details').first().click();
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Hatsune Mikuuuu' })).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^HHatsune Mikuuuu \(you\)Device ID$/ })
        .locator('div')
        .nth(2)
    ).toBeVisible();

    // verify device id badge details
    await page.getByText('HHatsune Mikuuuu (you)Device').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Device ID')).toBeVisible();
  });

  test.skip('Validate Payments Tab Displays “Not Applicable” for Device ID @[115537] @device @ui', async ({ page }) => {
    await page.goto('https://portal.encounterservices.com/login/device');

    // login device 4
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill('33255419');
    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await page.goto('https://portal.encounterservices.com/dashboard');

    // verify "Schedule an Appointment" and "See a Provider Now" buttons are not visible
    await expect(page.getByRole('button', { name: 'Schedule an Appointment' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'See a Provider Now' })).not.toBeVisible();

    // click the first view details link
    await page.locator('text=View details').first().click();
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();

    // verify payments tab
    await page.getByRole('button', { name: 'Payments' }).click();
    await expect(page.getByText('Not applicable')).toBeVisible();
  });

  test.skip('Verify the components of the "Session Details" slide out for Upcoming appointments @[118826] @device @ui', async ({
    page,
  }) => {
    await page.goto('https://portal.encounterservices.com/login/device');

    // login device 4
    await page.getByRole('textbox', { name: '1234' }).click();
    await page.getByRole('textbox', { name: '1234' }).fill('33255419');
    await page.getByRole('button', { name: 'Verify Device ID' }).click();
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await page.goto('https://portal.encounterservices.com/dashboard');

    // verify "Schedule an Appointment" and "See a Provider Now" buttons are not visible
    await expect(page.getByRole('button', { name: 'Schedule an Appointment' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'See a Provider Now' })).not.toBeVisible();

    // click the first view details link
    await page.locator('text=View details').first().click();
    await expect(page.getByText('Session Details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByText('Participants')).toBeVisible();

    // verify payments tab
    await page.getByRole('button', { name: 'Payments' }).click();
    await expect(page.getByText('Not applicable')).toBeVisible();

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
  });
});
