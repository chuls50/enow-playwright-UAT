import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Provider Coordinator Dashboard pt3 - Total Tests 3

test.describe('Provider-Coordinator @regression', () => {
  test.use(useRole(ROLES.PROVIDER_COORDINATOR));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Verify Provider-Coordinator Dashboard Display and Functionality @[117683] @dual-user @ui', async ({ page }) => {
    await expect(page.getByTestId('navigation')).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Dashboard' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Past sessions' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Providers' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Patients' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your schedule for today' })).toBeVisible();
    await expect(page.getByText('Schedule session')).toBeVisible();
    await expect(page.getByText('On demand requests')).toBeVisible();
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();

    // Verify waiting rooms if it is visible
    const waitingRoomsLink = page.locator('a').filter({ hasText: 'Waiting rooms' });
    if (await waitingRoomsLink.isVisible()) await expect(waitingRoomsLink).toBeVisible();
  });

  test('Verify Provider-Coordinator Patients Tab and Toggle Functionality @[117684] @dual-user @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Patients' }).click();
    await expect(page.getByRole('heading', { name: 'Patients' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Only my patients' })).toBeVisible();
    await page.locator('label').filter({ hasText: 'Only my patients' }).getByTestId('switch-div').click();
    await expect(page.getByTestId('card')).toBeVisible();
    await page.locator('label').filter({ hasText: 'Only my patients' }).getByTestId('switch-div').click();
    await expect(page.getByTestId('table')).toBeVisible();
  });

  // multi-user test
  test.skip('Verify Provider-Coordinator Availability Toggle Functionality @[117685] @multi-user @functional', async ({ page }) => {});
});
