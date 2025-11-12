import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Transient Meeting Request Providers Tab - total tests 7 (including 4 skipped)

test.describe('Dual-User @regression', () => {
  test.use(useRole(ROLES.PROVIDER_COORDINATOR));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test('Verify UI of Provider/Coordinator List Screen @[114316] @dual-user @functional', async ({ page }) => {
    await dashboardPage.gotoProviderDashboard();
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await expect(page.getByRole('heading', { name: 'Providers' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by name, email' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'User type ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Specialty ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Spoken languages ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Status ChevronDown' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Messages' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Video' }).first()).toBeVisible();
  });

  test('Verify Filtering by Status @[114317] @dual-user @functional', async ({ page }) => {
    await dashboardPage.gotoProviderDashboard();
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await page.getByRole('link', { name: 'Status ChevronDown' }).click();
    await page.getByTestId('item Offline').click();
    await page.getByText('Apply Filter').click();
    await expect(page.getByText('Offline').first()).toBeVisible();
    await expect(page.getByText('Online')).not.toBeVisible();
  });

  test('Verify Search by Name or Email @[114318] @dual-user @functional', async ({ page }) => {
    await dashboardPage.gotoProviderDashboard();
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await page.getByRole('textbox', { name: 'Search by name, email' }).click();
    await page.getByRole('textbox', { name: 'Search by name, email' }).fill('cody prov');
    await expect(page.getByTestId('cell-0-name').getByRole('paragraph')).toContainText('cody prov');
    await page.getByRole('textbox', { name: 'Search by name, email' }).click();
    await page.getByRole('textbox', { name: 'Search by name, email' }).fill('chuls+prov1codytest');
    await expect(page.getByText('cody prov')).toBeVisible();
  });
});

// Skipping multi-user tests for now
test.describe('Multi-User @regression', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  // multi user test
  test.skip('Verify "Video Call Now" Button Opens Video Request @[114319] @multi-user @functional', async ({ page }) => {});

  // multi user test
  test.skip('Verify "Chat Now" Button Opens Chat Request @[114320] @multi-user @functional', async ({ page }) => {});

  // multi user test
  test.skip('Verify "Video Call Now" and "Chat Now" Are Disabled for Offline Users @[114321] @multi-user @functional', async ({
    page,
  }) => {});

  // multi user test
  test.skip('Verify "Meeting Declined" Popup Message @[114330] @multi-user @functional', async ({ page }) => {});
});
