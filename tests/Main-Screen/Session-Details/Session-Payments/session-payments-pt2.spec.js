import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Session Payments pt2 - Total Tests 13 (including 13 skipped)

// skip payments for now, since there is more new stuff coming soon
test.describe('Multi-user @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test.skip('Verify Initial Payments Tab View When Payment Option is Not Defined @[114334] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Check “Yes, I`m Insured” selection @[114335] @multi-user @functional', async ({ page }) => {});

  test.skip('Check “No, Continue Paying Private” selection @[114336] @multi-user @functional', async ({ page }) => {});

  test.skip('Check Save click on Insurance Selection – Dispatcher OFF @[114337] @multi-user @functional', async ({ page }) => {});

  test.skip('Check Save click on Insurance Selection – Dispatcher ON @[114338] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Check Save click on Self-Pay Selection – Dispatcher OFF - Payment fails @[114339] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Check Save click on Self-Pay Selection – Dispatcher ON Payment Fails @[114340] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Check Save click on Self-Pay Selection – Dispatcher ON Payment Successful @[114341] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Check Save click on Self-Pay Selection – Payment Succeeds, Dispatcher Declines @[114342] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify Payments Tab Message for Provider When Payment Option Not Defined @[114465] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Insurance Selection Submission – Dispatcher Approves @[114466] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Verify Insurance Selection Submission – Dispatcher Declines @[114467] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Check Save click on Self-Pay Selection – Dispatcher OFF - Payment succeds @[114468] @multi-user @functional', async ({
    page,
  }) => {});
});
