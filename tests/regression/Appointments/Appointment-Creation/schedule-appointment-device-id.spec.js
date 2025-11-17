import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Schedule Appointment Device ID - Total Tests 10 (including 10 skipped)

test.describe('Device_ID @regression', () => {
  test.use(useRole(ROLES.DEVICE_USER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test.skip('Verify Participant Selector Toggle Is Displayed with Default on "Patient List" @[115311] @provider @ui', async ({}) => {});

  test.skip('Verify Patient List Displays Correctly When Toggle Is on "Patient List" @[115312] @provider @functional', async ({}) => {});

  test.skip('Verify Device ID List Displays When Toggle Is Switched to "Device ID List" @[115313] @provider @functional', async ({}) => {});

  test.skip('Verify Participant List View Updates Based on Toggle Selection @[115314] @provider @functional', async ({}) => {});

  test.skip('[Negative] Verify Behavior When No Patients or Device IDs Are Available @[115315] @provider @functional', async ({}) => {});

  test.skip('Verify User Type Filter Is Displayed in Participant Selection Modal @[115545] @provider @functional', async ({}) => {});

  test.skip('Verify List Filters Based on “Patient” Selection in User Type Filter @[115546] @provider @functional', async ({}) => {});

  test.skip('Verify List Filters Based on “Device ID” Selection in User Type Filter @[115547] @provider @functional', async ({}) => {});

  test.skip('[Negative] Verify Behavior When No Participants Match Selected User Type @[115548] @provider @functional', async ({}) => {});

  test.skip('Verify Session Details Displays ‘Not Applicable’ for Payments and Insurance @[115550] @provider @functional', async ({}) => {});
});
