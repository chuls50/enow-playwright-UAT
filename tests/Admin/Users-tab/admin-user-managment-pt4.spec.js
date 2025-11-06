import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
import { InstitutionSettingsConfigurationPage } from '../../models/pages/admin/institution-settings-configuration.page.js';
import { useRole, ROLES } from '../../utils/auth-helpers.js';

// Admin User Managment pt 4 - Total tests 5 (including 1 skipped)

// ========================================
// TEST DATA CONSTANTS
// ========================================
// All test data should be defined here in a centralized manner
// Use this pattern for consistent data management across tests
const TEST_DATA = {
  SEARCH: {
    USER_WITH_ALL_ROLES: 'cody all roles',
  },
};

test.describe('Admin User Managment Part 4 - Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));

  let userTablePage;

  test.beforeEach(async ({ page }) => {
    userTablePage = new UsersTablePage(page);
  });

  test.skip('Verify Adding Roles Functionality @[117677] @admin @functional', async () => {});

  test('Verify "Add Roles" button is disabled for Unsuitable Roles @[117678] @admin @functional', async ({ page }) => {
    // Admin goto Users table
    await userTablePage.gotoUsersTable();

    // Select Device role filter
    await userTablePage.filterByRoleDropdown.click();
    await userTablePage.filterByRoleDropdownOptionDevice.click();
    await userTablePage.filterByRoleDropdown.click();

    // "Add roles" button should NOT be visible for device roles
    await expect(userTablePage.addRolesButton).not.toBeVisible();
  });

  test('Verify "Add Roles" button is disabled for Users with all Roles @[117679] @admin @functional', async ({ page }) => {
    // Admin goto Users table
    await userTablePage.gotoUsersTable();

    // Search for user with all roles
    await userTablePage.searchInput.click();
    await userTablePage.searchInput.fill(TEST_DATA.SEARCH.USER_WITH_ALL_ROLES);

    // "Add roles" button should be visible
    await expect(userTablePage.addRolesButton).toBeVisible();

    // Click "Add roles" button
    await userTablePage.addRolesButton.click();

    // All role options should NOT be visible (since user already has all roles)
    await expect(userTablePage.addRolesButtonCoordinator).not.toBeVisible();
    await expect(userTablePage.addRolesButtonProvider).not.toBeVisible();
    await expect(userTablePage.addRolesButtonAdmin).not.toBeVisible();
  });
});

test.describe('Admin User Managment Part 4 - Admin+Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER)); // Provider account has both Admin and Provider roles

  let userTablePage;

  test.beforeEach(async ({ page }) => {
    userTablePage = new UsersTablePage(page);
    // Already authenticated as admin+provider via stored auth
    await page.goto(process.env.UAT_URL);
  });

  test('Verify Users with Multiple Administrator-Provider Role Display and Permissions @[117680] @dual-user @functional', async ({
    page,
  }) => {
    // Verify main navigation UI elements
    await expect(page.getByRole('listitem').filter({ hasText: 'Dashboard' }).locator('a')).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Past sessions' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Providers' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Patients' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Users' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Institution settings' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Data reporting' })).toBeVisible();

    // Verify Users section UI
    await page.locator('a').filter({ hasText: 'Users' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ConsultForm Create Device ID' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'UserAdd Invite users' })).toBeVisible();
    await page.getByTestId('table').waitFor({ state: 'visible' });
    await expect(page.getByTestId('table')).toBeVisible();

    // Verify Institution settings tab
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByTestId('tabs')).toBeVisible();

    // Verify Data reporting tab and dashboard links
    await page.locator('a').filter({ hasText: 'Data reporting' }).click();
    await expect(page.locator('a').filter({ hasText: 'Dashboard' }).nth(1)).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Calls' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Encounters' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Appointments' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Concurrent Usage' })).toBeVisible();

    // Verify Data Reporting section navigation and headings
    await page.locator('a').filter({ hasText: 'Dashboard' }).nth(1).click();
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Total Calls' }).click();
    await page.getByRole('heading', { name: 'Total Calls' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Total Calls' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Total Encounters' }).click();
    await page.getByRole('heading', { name: 'Total Encounters' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Total Encounters' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Total Appointments' }).click();
    await page.getByRole('heading', { name: 'Total Appointments' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Total Appointments' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Concurrent Usage' }).click();
    await page.getByRole('heading', { name: 'Concurrent Usage' }).first().waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Concurrent Usage' }).first()).toBeVisible();

    // Verify Dashboard section UI
    await page.locator('a').filter({ hasText: 'Dashboard' }).first().click();
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();

    // Change institution settings and verify edit permissions
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'Configuration' }).click();
    await page.locator('label').filter({ hasText: 'Enable Chat Appointment Types' }).getByTestId('switch-div').click();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();

    // Change account settings and verify edit permissions
    await page.getByTestId('popover-trigger').getByTestId('avatar').locator('div').filter({ hasText: 'CC' }).locator('div').click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
    await page.getByRole('button', { name: 'Edit Edit' }).first().click();

    // reset state if needed
    const spanishChip = page.locator('div').filter({ hasText: /^Spanish$/ });
    const isVisible = await spanishChip.isVisible();
    if (isVisible) {
      await spanishChip.getByRole('button').click();
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page.getByText('SuccessProfile updated')).toBeVisible();
      await page.getByRole('button', { name: 'Edit Edit' }).click();
    }

    await page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^Languages spokenEnglish$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-Spanish').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('SuccessProfile updated').first()).toBeVisible();
    await expect(page.getByText('English, Spanish')).toBeVisible();
    await page.getByRole('button', { name: 'Edit Edit' }).first().click();
    await page
      .locator('div')
      .filter({ hasText: /^Spanish$/ })
      .getByRole('button')
      .click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('SuccessProfile updated').first()).toBeVisible();

    // goto {PROD_URL}/past-sessions
    await page.goto(process.env.UAT_URL + '/past-sessions');

    // Verify Past sessions section UI
    await expect(page.getByRole('heading', { name: 'Past sessions' })).toBeVisible();
    await expect(page.getByTestId('table')).toBeVisible();

    // Verify Providers section
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await expect(page.getByRole('heading', { name: 'Providers' })).toBeVisible();
    await expect(page.getByTestId('filter-panel')).toBeVisible();
    await expect(page.getByTestId('table')).toBeVisible();

    // Verify Patients section
    await page.locator('a').filter({ hasText: 'Patients' }).click();
    await expect(page.getByRole('heading', { name: 'Patients' })).toBeVisible();
  });
});

test.describe('Admin User Managment Part 4 - Admin+Coordinator @regression', () => {
  test.use(useRole(ROLES.ADMIN_COORDINATOR)); // Admin+Coordinator account with both roles

  let userTablePage;
  let institutionSettingsConfigPage;

  test.beforeEach(async ({ page }) => {
    userTablePage = new UsersTablePage(page);
    institutionSettingsConfigPage = new InstitutionSettingsConfigurationPage(page);
  });

  test('Verify Users with Multiple Administrator-Coordinator Role Display and Permissions @[117681] @dual-user @functional', async ({
    page,
  }) => {
    // Already authenticated as admin+coordinator via stored auth
    await page.goto(process.env.UAT_URL);

    // Ensure Waiting Room is enabled for coordinator role testing
    await institutionSettingsConfigPage.gotoInstitutionSettingsConfiguration();
    await institutionSettingsConfigPage.ensureWaitingRoomIsOn();
    await userTablePage.gotoUsersTable();

    // Verify main navigation UI elements
    await expect(page.getByRole('listitem').filter({ hasText: 'Dashboard' }).locator('a')).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Past sessions' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Providers' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Command center' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Users' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Institution settings' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Data reporting' })).toBeVisible();

    // Verify Data reporting tab and dashboard links
    await page.locator('a').filter({ hasText: 'Data reporting' }).click();
    await expect(page.locator('a').filter({ hasText: 'Dashboard' }).nth(1)).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Calls' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Encounters' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Appointments' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Concurrent Usage' })).toBeVisible();

    // Verify Users section UI
    await page.locator('a').filter({ hasText: 'Users' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ConsultForm Create Device ID' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'UserAdd Invite users' })).toBeVisible();
    await page.getByTestId('table').waitFor({ state: 'visible' });
    await expect(page.getByTestId('table')).toBeVisible();

    // Verify Institution settings tab
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await expect(page.getByTestId('tabs')).toBeVisible();

    // Verify Data reporting tab and dashboard links again
    await page.locator('a').filter({ hasText: 'Data reporting' }).click();
    await expect(page.locator('a').filter({ hasText: 'Dashboard' }).nth(1)).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Calls' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Encounters' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Total Appointments' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Concurrent Usage' })).toBeVisible();

    // Verify Data Reporting section navigation and headings
    await page.locator('a').filter({ hasText: 'Dashboard' }).nth(1).click();
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Total Calls' }).click();
    await expect(page.getByRole('heading', { name: 'Total Calls' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Total Encounters' }).click();
    await expect(page.getByRole('heading', { name: 'Total Encounters' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Total Appointments' }).click();
    await expect(page.getByRole('heading', { name: 'Total Appointments' })).toBeVisible();
    await page.locator('a').filter({ hasText: 'Concurrent Usage' }).click();
    await expect(page.getByRole('heading', { name: 'Concurrent Usage' }).first()).toBeVisible();

    // Verify Dashboard section UI
    await page.locator('a').filter({ hasText: 'Dashboard' }).first().click();
    await expect(page.getByRole('button', { name: 'CalendarPlus Schedule session' })).toBeVisible();

    // Change institution settings and verify edit permissions
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await page.getByRole('button', { name: 'Configuration' }).click();
    await page.locator('label').filter({ hasText: 'Enable Chat Appointment Types' }).getByTestId('switch-div').click();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();

    // Change account settings and verify edit permissions
    await page.getByTestId('popover-trigger').getByTestId('avatar').locator('div').filter({ hasText: 'CC' }).locator('div').click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();
    await page.getByRole('button', { name: 'Edit Edit' }).click();

    // reset state if needed
    const spanishChip = page.locator('div').filter({ hasText: /^Spanish$/ });
    const isVisible = await spanishChip.isVisible();
    if (isVisible) {
      await spanishChip.getByRole('button').click();
      await page.getByRole('button', { name: 'Save changes' }).click();
      await expect(page.getByText('SuccessProfile updated')).toBeVisible();
      await page.getByRole('button', { name: 'Edit Edit' }).click();
    }

    await page
      .getByRole('dialog')
      .locator('div')
      .filter({ hasText: /^Languages spokenEnglish$/ })
      .getByTestId('custom-select-item-wrapper')
      .click();
    await page.getByTestId('custom-dropdown-item-Spanish').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await page.getByText('SuccessProfile updated').waitFor({ state: 'visible' });
    await expect(page.getByText('SuccessProfile updated')).toBeVisible();
    await expect(page.getByText('English, Spanish')).toBeVisible();
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Spanish$/ })
      .getByRole('button')
      .click();
    await page.waitForTimeout(1000); // wait for a second
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('SuccessProfile updated').first()).toBeVisible();

    // goto {PROD_URL}/past-sessions
    await page.goto(process.env.UAT_URL + '/past-sessions');

    // Verify Past sessions section UI
    await page.getByRole('heading', { name: 'Past sessions' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Past sessions' })).toBeVisible();
    await expect(page.getByTestId('table')).toBeVisible();

    // Verify Providers section
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await expect(page.getByRole('heading', { name: 'Providers' })).toBeVisible();
    await expect(page.getByTestId('filter-panel')).toBeVisible();
    await expect(page.getByTestId('table')).toBeVisible();

    // Verify Patients section
    await page.locator('a').filter({ hasText: 'Patients' }).click();
    await expect(page.getByRole('heading', { name: 'Patients' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by name, email or' })).toBeVisible();
    await expect(page.getByTestId('table')).toBeVisible();
  });
});
