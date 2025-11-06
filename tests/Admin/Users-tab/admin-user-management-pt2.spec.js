import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
import { useRole, ROLES } from '../../utils/auth-helpers.js';

// Admin User Management pt2 - Total Tests 12 (including 2 skipped)

// ========================================
// TEST DATA CONSTANTS
// ========================================
// All test data should be defined here in a centralized manner
// Use this pattern for consistent data management across tests
const TEST_DATA = {
  // Device creation test data
  DEVICE: {
    NAME: 'Automation Test Device',
    EMAIL_PREFIX: 'test',
    ID_PREFIX: 'device',
    DUPLICATE_ID: '911',
  },
  INSTITUTION: {
    NAME: 'Cody Test',
  },
};

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let userTablePage;

  test.beforeEach(async ({ page }) => {
    userTablePage = new UsersTablePage(page);
    await userTablePage.gotoUsersTable();
  });

  test('Verify Create Device ID Button is Displayed on Users Screen @[115004] @admin @ui', async () => {
    // Wait for and verify Create Device ID button is visible
    await userTablePage.createDeviceIdButton.waitFor({ state: 'visible' });
    await expect(userTablePage.createDeviceIdButton).toBeVisible();
  });

  test('Verify Filter Dropdown Includes Device Role and Correct Filtering @[115005] @admin @functional', async () => {
    // Open filter dropdown and verify all role options are visible
    await userTablePage.filterByRoleDropdown.click();
    await expect(userTablePage.filterByRoleDropdownOptions).toBeVisible();
    await expect(userTablePage.filterByRoleDropdownOptionAll).toBeVisible();
    await expect(userTablePage.filterByRoleDropdownOptionAdmin).toBeVisible();
    await expect(userTablePage.filterByRoleDropdownOptionPatient).toBeVisible();
    await expect(userTablePage.filterByRoleDropdownOptionProvider).toBeVisible();
    await expect(userTablePage.filterByRoleDropdownOptionCoordinator).toBeVisible();
    await expect(userTablePage.filterByRoleDropdownOptionDevice).toBeVisible();

    // Select Device role filter and verify selection
    await userTablePage.filterByRoleDropdownOptionDevice.click();
    await expect(userTablePage.selectedRoleFilterDevice).toBeVisible();
  });

  test('Verify Create Device ID Popup and Required Fields @[115006] @admin @ui', async () => {
    // Open Create Device ID modal
    await userTablePage.createDeviceIdButton.click();

    // Verify modal and header are visible
    await expect(userTablePage.createDeviceIdModal).toBeVisible();
    await expect(userTablePage.createDeviceIdModalHeader).toBeVisible();

    // Verify all form fields and labels are visible
    await expect(userTablePage.createDeviceIdNameText).toBeVisible();
    await expect(userTablePage.createDeviceIdNameField).toBeVisible();
    await expect(userTablePage.createDeviceIdEmailText).toBeVisible();
    await expect(userTablePage.createDeviceIdEmailField).toBeVisible();
    await expect(userTablePage.createDeviceIdDeviceIDText).toBeVisible();
    await expect(userTablePage.createDeviceIdDeviceIDField).toBeVisible();
    await expect(userTablePage.createDeviceIdInstitutionText).toBeVisible();
    await expect(userTablePage.createDeviceIdInstitutionDropdown).toBeVisible();

    // Verify action buttons and initial disabled state
    await expect(userTablePage.createDeviceIdCancelButton).toBeVisible();
    await expect(userTablePage.createDeviceIdSendInviteButton).toBeVisible();
    await expect(userTablePage.createDeviceIdSendInviteButton).toBeDisabled();
  });

  test('[Negative] Verify Cancel Button on Create Device ID Popup @[115007] @admin @functional', async () => {
    // Open Create Device ID modal and fill out form
    await userTablePage.createDeviceIdButton.click();
    await userTablePage.createDeviceIdNameField.fill(TEST_DATA.DEVICE.NAME);
    await userTablePage.createDeviceIdEmailField.fill(`${TEST_DATA.DEVICE.EMAIL_PREFIX}-${Date.now()}@example.com`);
    await userTablePage.createDeviceIdDeviceIDField.fill(`${TEST_DATA.DEVICE.ID_PREFIX}-${Date.now()}`);

    // Select institution to complete form
    await userTablePage.selectCreateDeviceIdInstitution(TEST_DATA.INSTITUTION.NAME);
    await expect(userTablePage.createDeviceIdSendInviteButton).toBeEnabled();

    // Cancel form and verify modal closes
    await userTablePage.createDeviceIdCancelButton.click();
    await expect(userTablePage.createDeviceIdModal).not.toBeVisible();

    // Reopen modal and verify fields are cleared
    await userTablePage.createDeviceIdButton.click();
    await expect(userTablePage.createDeviceIdNameField).toHaveValue('');
    await expect(userTablePage.createDeviceIdEmailField).toHaveValue('');
  });

  test.skip('Verify Device ID User is Created Successfully @[115008] @admin @functional', async () => {
    // Generate unique email and device ID for this test run
    const deviceIdUserEmail = `${TEST_DATA.DEVICE.EMAIL_PREFIX}-${Date.now()}@example.com`;
    const deviceId = `${TEST_DATA.DEVICE.ID_PREFIX}-${Date.now()}`;

    // Use comprehensive helper method that encapsulates all device creation steps
    await userTablePage.createDeviceId(TEST_DATA.DEVICE.NAME, deviceIdUserEmail, deviceId, TEST_DATA.INSTITUTION.NAME);

    // Explicit assertions make the test's purpose clear
    await userTablePage.invitationSentMessage.waitFor({ state: 'visible' });
    await expect(userTablePage.invitationSentMessage).toBeVisible();

    console.log(`Device created: ${TEST_DATA.DEVICE.NAME} (${deviceIdUserEmail})`);
  });

  test('[Negative] Verify Duplicate Device ID Is Not Allowed @[115009] @admin @functional', async () => {
    // Generate unique email for test
    const deviceIdUserEmail = `${TEST_DATA.DEVICE.EMAIL_PREFIX}-${Date.now()}@example.com`;

    // Use comprehensive helper method with known duplicate Device ID
    await userTablePage.createDeviceId(TEST_DATA.DEVICE.NAME, deviceIdUserEmail, TEST_DATA.DEVICE.DUPLICATE_ID, TEST_DATA.INSTITUTION.NAME);

    // Verify duplicate ID error is displayed
    await expect(userTablePage.deviceIdExistsError).toBeVisible({ timeout: 15000 });
  });

  test('[Negative] Verify Invalid Email Format Blocks Submission @[115010] @admin @functional', async () => {
    // Generate unique device ID for test
    const deviceId = `${TEST_DATA.DEVICE.ID_PREFIX}-${Date.now()}`;

    // Use comprehensive helper method with invalid email format
    await userTablePage.createDeviceId(TEST_DATA.DEVICE.NAME, 'invalid-email-format', deviceId, TEST_DATA.INSTITUTION.NAME);

    // Verify email format error is displayed
    await expect(userTablePage.emailValidationError).toBeVisible();
  });

  test('[Negative] Verify Submission Is blocked When Fields are Missing @[115011] @admin @functional', async () => {
    // Open Create Device ID modal
    await userTablePage.createDeviceIdButton.click();

    // Fill only some fields, deliberately leaving out the device name
    await userTablePage.createDeviceIdEmailField.fill(`${TEST_DATA.DEVICE.EMAIL_PREFIX}-${Date.now()}@example.com`);
    await userTablePage.createDeviceIdDeviceIDField.fill(`${TEST_DATA.DEVICE.ID_PREFIX}-${Date.now()}`);
    await userTablePage.selectCreateDeviceIdInstitution(TEST_DATA.INSTITUTION.NAME);

    // Verify submit button remains disabled due to missing required fields
    await expect(userTablePage.createDeviceIdSendInviteButton).toBeDisabled();
  });

  test('Verify Header Text on Create Device ID Popup @[115341] @admin @ui', async () => {
    // Open Create Device ID modal
    await userTablePage.createDeviceIdButton.click();

    // Verify modal header displays correct text
    await expect(userTablePage.createDeviceIdModalHeader).toHaveText('Create Device ID');
  });

  test('[Negative] Verify Fields Are Cleared After Canceling Create Device ID Popup @[115342] @admin @functional', async () => {
    // Open Create Device ID modal and fill out form
    await userTablePage.createDeviceIdButton.click();
    await userTablePage.createDeviceIdNameField.fill(TEST_DATA.DEVICE.NAME);
    await userTablePage.createDeviceIdEmailField.fill(`${TEST_DATA.DEVICE.EMAIL_PREFIX}-${Date.now()}@example.com`);
    await userTablePage.createDeviceIdDeviceIDField.fill(`${TEST_DATA.DEVICE.ID_PREFIX}-${Date.now()}`);

    // Complete form by selecting institution
    await userTablePage.selectCreateDeviceIdInstitution(TEST_DATA.INSTITUTION.NAME);
    await expect(userTablePage.createDeviceIdSendInviteButton).toBeEnabled();

    // Cancel form and verify modal closes
    await userTablePage.createDeviceIdCancelButton.click();
    await expect(userTablePage.createDeviceIdModal).not.toBeVisible();

    // Reopen modal and verify all fields are cleared
    await userTablePage.createDeviceIdButton.click();
    await expect(userTablePage.createDeviceIdNameField).toHaveValue('');
    await expect(userTablePage.createDeviceIdEmailField).toHaveValue('');
  });

  test('[Negative] Verify Device ID Role Cannot Be Assigned with Other Roles @[115343] @admin @functional', async () => {
    // Navigate to page where Add Roles button is visible
    if (!(await userTablePage.addRolesButton.isVisible())) {
      while (!(await userTablePage.addRolesButton.isVisible())) {
        await userTablePage.paginationNextButton.click();
        await userTablePage.page.waitForTimeout(500);
      }
    }

    // Open Add Roles modal and verify Device role is not available
    await userTablePage.addRolesButton.click();
    await expect(userTablePage.deviceRoleOption).not.toBeVisible();
  });

  // want to mock/intercept API here
  test.skip('Verify Email Notification is Sent After Creating Device ID @[115344] @admin @functional', async () => {});
});
