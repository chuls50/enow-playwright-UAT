import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../../utils/auth-helpers.js';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
import { AdminDataReportingPage } from '../../models/pages/admin/admin-data-reporting.page.js';

// Admin Reporting pt2 Extra Fields - Total tests 2

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let usersTablePage;
  let adminDataReportingPage;

  test.beforeEach(async ({ page }) => {
    usersTablePage = new UsersTablePage(page);
    adminDataReportingPage = new AdminDataReportingPage(page);

    // Navigate to users table first, then to reporting
    await usersTablePage.gotoUsersTable();
    await adminDataReportingPage.navigateToDataReporting();
    await adminDataReportingPage.navigateToTotalCalls();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.waitForSpinnerToDisappear();
  });

  test('Verify "Service" Filter Displays @[118229] @admin @ui', async ({ page }) => {
    // Verify service filter is visible on the page
    await adminDataReportingPage.serviceFilter.waitFor({ state: 'visible' });
    await expect(adminDataReportingPage.serviceFilter).toBeVisible();

    // Open service filter dropdown and verify items wrapper displays
    await adminDataReportingPage.serviceFilter.click();
    await expect(adminDataReportingPage.itemsWrapper).toBeVisible();
  });

  test('Verify "Service" Filter Functionality @[118165] @admin @functional', async ({ page }) => {
    // Verify service filter is visible
    await adminDataReportingPage.serviceFilter.waitFor({ state: 'visible' });
    await page.waitForTimeout(300);
    await expect(adminDataReportingPage.serviceFilter).toBeVisible();

    // Open service filter dropdown
    await adminDataReportingPage.serviceFilter.click();
    await page.waitForTimeout(300);
    await adminDataReportingPage.itemsWrapper.waitFor({ state: 'visible' });
    await expect(adminDataReportingPage.itemsWrapper).toBeVisible();

    // Select first available service option
    const firstServiceOption = page.locator('[data-testid^="item "]').first();
    await firstServiceOption.click();
    await page.waitForTimeout(300);

    // Apply filter and verify it was applied successfully
    await adminDataReportingPage.applyFilterButton.click();
    await page.waitForTimeout(1000);
    const filterTags = adminDataReportingPage.filterPanel.locator('div').filter({ hasText: /\w/ });
    await expect(filterTags.first()).toBeVisible();
  });
});
