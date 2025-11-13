import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Session Payments - Total Tests 16 (including 16 skipped)
test.describe('Multi-user @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test.skip('Verify the Display of the Payments Tab with Payments Defined - Payment Completed and Approved @[112716] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify "Co-pay Required" Button Functionality @[112717] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Display of Premium Package Info When Enabled in Admin Settings @[112718] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Badge and Fee Details on Payment Tab When Insurance is Selected @[112719] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify Payment Failure Scenario @[112720] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Badge and Fee Details on Payment Tab When Self-pay is selected @[112793] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Display of the Payments Tab with Payments Defined - Payment Required @[114388] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Display of the Payments Tab with Payments Defined - Co-pay Completed @[114389] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Display of Payments Tab with Payments Defined - Co-pay Required @[114390] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Display of Payments Tab with Payments Defined - Insurance Accepted @[114391] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Display of Payments Tab with Payments Defined - Insurance Declined @[114392] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Display of Payments Tab with Payments Defined - Pending Approval @[114393] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify "Payment Required" Button Functionality @[114394] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Verify "Payment Required" Button Functionality @[114395] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Verify "Co-pay Required" Button Functionality @[114396] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify the Display of the Payments Tab with Payment Defined - Payment Completed and Approved @[114399] @multi-user @functional', async ({
    page,
  }) => {});
});
