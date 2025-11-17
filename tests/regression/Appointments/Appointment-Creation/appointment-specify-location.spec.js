import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';

// Appointment Specify Location - Total tests 7 (including 7 skipped)

test.describe('Patient @regression', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test.skip('Verify Specify Location Functionality is Disabled - Schedule an appointment @[111509] @patient @functional', async ({
    page,
  }) => {});

  test.skip('Validate Specify Location Functionality Enabled - Schedule an appointment @[111511] @patient @functional', async ({
    page,
  }) => {});

  test.skip('Verify Country Dropdown Functionality on Specify Location Modal @[111513] @patient @functional', async ({ page }) => {});

  test.skip('Verify Use My Current Location Functionality on Specify Location Modal @[111515] @patient @functional', async ({
    page,
  }) => {});

  test.skip('Verify Continue Button Functionality on Specify Location Modal @[111516] @patient @functional', async ({ page }) => {});

  test.skip('Verify Specify Location functionality is disabled - See a Provider Now @[111510] @patient @functional', async ({
    page,
  }) => {});

  test.skip('Verify Continue Button Functionality on Specify Location Modal - See a Provider Now @[111517] @patient @functional', async ({
    page,
  }) => {});
});
