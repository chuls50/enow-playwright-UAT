import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Make Payments - Total Tests 13 (including 13 skipped)
test.describe('Multi-User @regression @e2e', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test.skip('Verify Service Defined Self-Pay Flow Directs Patient to Appropriate Payment Screen With Correct Fee @[113775] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Self-Pay Flow When Fee Is Overridden in Session Details @[113776] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Insurance Co-pay Flow Directs Patient to Appropriate Payment Screen With Correct Co-pay @[113777] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify insurance selection leads to direct appointment creation for Scheduled type with Dispatcher OFF and Payments ON @[114120] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify appointment is created with no payment if private is selected and service fee is disabled with Dispatcher OFF and Payments ON @[114121] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify service fee modal appears when private payment is selected and service fee is enabled with Dispatcher OFF and Payments ON @[114122] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify redirect to Azul after clicking Pay Fee with Dispatcher OFF and Payments ON @[114123] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify successful Azul payment creates Scheduled appointment with Dispatcher OFF and Payments ON @[114124] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify appointment is created after successful Azul payment with Dispatcher OFF and Payments ON @[114125] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify Scheduled appointment is cancelled if payment is not completed before start time with Dispatcher OFF and Payments ON @[114126] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify appointment is cancelled in On-Demand flow with Dispatcher OFF and Payments ON if payment is not completed @[114127] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify appointment is created in On-Demand flow with Dispatcher OFF and Payments ON after successful payment @[114128] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify appointment is created after selecting insurance on "Your Appointment" screen with Dispatcher OFF @[114130] @multi-user @functional', async ({
    page,
  }) => {});
});
