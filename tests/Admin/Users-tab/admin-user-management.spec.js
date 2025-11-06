import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
// Admin User Management - Total Tests 13 (including 1 skipped)

// Use stored auth for admin user
test.use({ storageState: 'playwright/.auth/admin.json' });

// ========================================
// TEST DATA CONSTANTS
// ========================================
// All test data should be defined here in a centralized manner
// Use this pattern for consistent data management across tests
const TEST_DATA = {
  // User invitation test data
  USER: {
    FIRST_NAME: 'John',
    LAST_NAME: 'Doe',
    EMAIL_PREFIX: 'john.doe',
    ROLE: 'Patient',
    INSTITUTION: 'Cody Test',
  },
  // Device creation test data
  DEVICE: {
    NAME: 'Automation Test Device',
    EMAIL_PREFIX: 'test',
    ID_PREFIX: 'device',
    DUPLICATE_ID: '911',
  },
  // Search and filter test data
  SEARCH: {
    USER_SEARCH_TERM: 'cody test provider-',
  },
  // Form validation test data
  VALIDATION: {
    VALID_FIRST_NAME: 'John',
    VALID_LAST_NAME: 'Doe',
    VALID_EMAIL: 'example@domain.com',
    INVALID_CHARACTERS: '%^&*',
  },
  // Roles and institutions
  ROLES: {
    ADMIN: 'Admin',
    PATIENT: 'Patient',
    PROVIDER: 'Provider',
    COORDINATOR: 'Coordinator',
  },
  INSTITUTIONS: {
    CODY_TEST: 'Cody Test',
  },
};

test.describe('Admin User Managment @regression', () => {
  let userTablePage;

  test.beforeEach(async ({ page }) => {
    userTablePage = new UsersTablePage(page);
    await userTablePage.gotoUsersTable();
  });

  test('Verify content on Users Tab displays correctly @[111335] @admin @ui', async () => {
    await expect(userTablePage.header).toBeVisible();
    await expect(userTablePage.navigationBar).toBeVisible();
    await expect(userTablePage.searchInputText).toBeVisible();
    await expect(userTablePage.searchInput).toBeVisible();
    await expect(userTablePage.filterByRoleText).toBeVisible();
    await expect(userTablePage.filterByRoleDropdown).toBeVisible();
    await expect(userTablePage.table).toBeVisible();
    await expect(userTablePage.inviteUsersButton).toBeVisible();

    // Verify Users Table Content
    await expect(userTablePage.tableUsername).toBeVisible();
    await expect(userTablePage.tableEmail).toBeVisible();
    await expect(userTablePage.tableAssignedRoles).toBeVisible();
    await expect(userTablePage.tableStatus).toBeVisible();
    await expect(userTablePage.tableLastUpdated).toBeVisible();
    await expect(userTablePage.tableSortByLastUpdated).toBeVisible();
    await expect(userTablePage.activeToggleSwitch).toBeVisible();
  });

  test('Verify Search functionality on Users Tab @[111336] @admin @functional', async () => {
    // search by name
    await userTablePage.searchInput.fill(TEST_DATA.SEARCH.USER_SEARCH_TERM);

    // capture the inner text of cell-0
    const firstUsername = await userTablePage.page.getByTestId('cell-0-name').innerText();

    // verify the search result contains the search term
    expect(firstUsername.toLowerCase()).toContain(TEST_DATA.SEARCH.USER_SEARCH_TERM.toLowerCase());
  });

  test('Verify Role filtering functionality on Users Tab @[111337] @admin @functional', async () => {
    // click filter dropdown
    await userTablePage.filterByRoleDropdown.click();

    // select admin role and verify
    await userTablePage.filterByRoleDropdownOptionAdmin.click();
    await expect(userTablePage.selectedRoleFilterAdmin).toBeVisible();

    // select provider role and verify
    await userTablePage.filterByRoleDropdownOptionProvider.click();
    await expect(userTablePage.selectedRoleFilterAdmin).toBeVisible();
    await expect(userTablePage.selectedRoleFilterProvider).toBeVisible();

    // select all roles and verify
    await userTablePage.filterByRoleDropdownOptionAll.click();
    await expect(userTablePage.selectedRoleFilterAll).toBeVisible();
    await expect(userTablePage.selectedRoleFilterAdmin).not.toBeVisible();
    await expect(userTablePage.selectedRoleFilterProvider).not.toBeVisible();
  });

  // one way door
  test.skip('Verify Assigned roles management on Users Tab @[111338] @admin @functional', async () => {});

  test('Verify Active toggle behavior on Users Tab @[111339] @admin @functional', async () => {
    // Search for specific user to test toggle behavior
    await userTablePage.searchInput.fill(TEST_DATA.SEARCH.USER_SEARCH_TERM);

    // Toggle user to inactive state
    await userTablePage.activeToggleSwitch.click();
    await userTablePage.page.waitForTimeout(1000);
    await userTablePage.page.waitForSelector('text=User is now inactive', {
      state: 'visible',
    });
    await expect(userTablePage.userInactiveMessage).toBeVisible();

    // Toggle user back to active state
    await userTablePage.activeToggleSwitch.click();
    await expect(userTablePage.userActiveMessage).toBeVisible();
  });

  test('Verify Last Updated column filteriung functionality on Users Tab @[111340] @admin @functional', async () => {
    // Click the Last Updated column header to sort
    await userTablePage.tableSortByLastUpdated.click();
    await userTablePage.page.waitForTimeout(500);

    // Extract date values from the Last Updated column (6th column)
    const dates = await userTablePage.page.$$eval('tbody tr td:nth-child(6)', (cells) => {
      return cells.map((cell) => new Date(cell.textContent.trim()));
    });

    // Verify ascending order (oldest to newest)
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i].getTime()).toBeLessThanOrEqual(dates[i + 1].getTime());
    }
  });

  test('Verify Pagination in Users tab @[111520] @admin @functional', async () => {
    // Click next button to navigate to page 2
    await userTablePage.paginationNextButton.click();
    await expect(userTablePage.paginationPreviousButton).toBeEnabled();

    // Click previous button to return to page 1
    await userTablePage.paginationPreviousButton.click();
    await expect(userTablePage.paginationPreviousButton).toBeDisabled();
  });

  test('Verify Content of Invite Users Modal on Users Tab @[111695] @admin @ui', async () => {
    // Open the invite users modal
    await userTablePage.inviteUsersButton.click();

    // Verify modal and header are visible
    await expect(userTablePage.inviteUsersModal).toBeVisible();
    await expect(userTablePage.inviteUsersModalHeader).toBeVisible();

    // Verify all form fields and labels are visible
    await expect(userTablePage.inviteUsersFirstNameText).toBeVisible();
    await expect(userTablePage.inviteUsersFirstNameField).toBeVisible();
    await expect(userTablePage.inviteUsersLastNameText).toBeVisible();
    await expect(userTablePage.inviteUsersLastNameField).toBeVisible();
    await expect(userTablePage.inviteUsersEmailText).toBeVisible();
    await expect(userTablePage.inviteUsersEmailField).toBeVisible();
    await expect(userTablePage.inviteUsersInstitutionText).toBeVisible();
    await expect(userTablePage.inviteUsersInstitutionDropdown).toBeVisible();
    await expect(userTablePage.inviteUsersRoleText).toBeVisible();
    await expect(userTablePage.inviteUsersRoleDropdown).toBeVisible();

    // Verify action buttons and initial state
    await expect(userTablePage.inviteUsersCancelButton).toBeVisible();
    await expect(userTablePage.inviteUsersSendInviteButton).toBeVisible();
    await expect(userTablePage.inviteUsersSendInviteButton).toBeDisabled();
  });

  test('Validate Entering First Name, Last Name, and Email on Invite Users Modal @[111696] @admin @functional', async () => {
    // Open the invite users modal
    await userTablePage.inviteUsersButton.click();

    // Fill valid names and verify button remains disabled without complete form
    await userTablePage.inviteUsersFirstNameField.fill(TEST_DATA.VALIDATION.VALID_FIRST_NAME);
    await userTablePage.inviteUsersLastNameField.fill(TEST_DATA.VALIDATION.VALID_LAST_NAME);
    await expect(userTablePage.inviteUsersSendInviteButton).toBeDisabled();

    // Fill invalid characters in name fields
    await userTablePage.inviteUsersFirstNameField.click();
    await userTablePage.inviteUsersFirstNameField.fill(TEST_DATA.VALIDATION.INVALID_CHARACTERS);
    await userTablePage.inviteUsersLastNameField.click();
    await userTablePage.inviteUsersLastNameField.fill(TEST_DATA.VALIDATION.INVALID_CHARACTERS);

    // Fill invalid characters in email field
    await userTablePage.inviteUsersEmailField.click();
    await userTablePage.inviteUsersEmailField.fill(TEST_DATA.VALIDATION.INVALID_CHARACTERS);

    // Select institution and role to complete form
    await userTablePage.selectInviteUserInstitution(TEST_DATA.INSTITUTIONS.CODY_TEST);
    await userTablePage.selectInviteUserRole(TEST_DATA.ROLES.PATIENT);

    // Submit form and verify validation errors
    await userTablePage.inviteUsersSendInviteButton.click();
    await expect(userTablePage.firstNameValidationError).toBeVisible();
    await expect(userTablePage.lastNameValidationError).toBeVisible();
    await expect(userTablePage.emailValidationError).toBeVisible();
  });

  test('Verify Institution Dropdown selection in Invite Users Modal @[111697] @admin @functional', async () => {
    // Open the invite users modal
    await userTablePage.inviteUsersButton.click();

    // Click institution dropdown and verify options are visible
    await userTablePage.inviteUsersInstitutionDropdown.click();
    await expect(userTablePage.inviteUsersInstitutionDropdownOptions).toBeVisible();
    await expect(userTablePage.inviteUsersInstitutionDropdownOptionCodyTest).toBeVisible();

    // Select Cody Test option and verify selection
    await userTablePage.inviteUsersInstitutionDropdownOptionCodyTest.click();
    await expect(userTablePage.inviteUsersInstitutionDropdownOptionCodyTest).toBeVisible();
  });

  test('Verify Role dropdown selection in Invite Users Modal @[111698] @admin @functional', async () => {
    // Open the invite users modal
    await userTablePage.inviteUsersButton.click();

    // Click role dropdown and verify all role options are visible
    await userTablePage.inviteUsersRoleDropdown.click();
    await expect(userTablePage.inviteUsersRoleDropdownOptions).toBeVisible();
    await expect(userTablePage.inviteUsersRoleDropdownOptionAdmin).toBeVisible();
    await expect(userTablePage.inviteUsersRoleDropdownOptionPatient).toBeVisible();
    await expect(userTablePage.inviteUsersRoleDropdownOptionProvider).toBeVisible();
    await expect(userTablePage.inviteUsersRoleDropdownOptionCoordinator).toBeVisible();

    // Select Admin role and verify dropdown closes
    await userTablePage.inviteUsersRoleDropdownOptionAdmin.click();
    await expect(userTablePage.inviteUsersRoleDropdownOptions).not.toBeVisible();
  });

  test('Validate Clicking Cancel button on Invite Users Modal @[111699] @admin @functional', async () => {
    // Open the invite users modal and fill out form
    await userTablePage.inviteUsersButton.click();
    await userTablePage.inviteUsersFirstNameField.fill(TEST_DATA.VALIDATION.VALID_FIRST_NAME);
    await userTablePage.inviteUsersLastNameField.fill(TEST_DATA.VALIDATION.VALID_LAST_NAME);
    await userTablePage.inviteUsersEmailField.fill(TEST_DATA.VALIDATION.VALID_EMAIL);

    // Select institution and role
    await userTablePage.selectInviteUserInstitution(TEST_DATA.INSTITUTIONS.CODY_TEST);
    await userTablePage.selectInviteUserRole(TEST_DATA.ROLES.PATIENT);

    // Cancel the form and verify modal closes
    await userTablePage.inviteUsersCancelButton.click();
    await expect(userTablePage.inviteUsersModal).not.toBeVisible();

    // Reopen modal and verify fields are cleared
    await userTablePage.inviteUsersButton.click();
    await expect(userTablePage.inviteUsersFirstNameField).toHaveValue('');
    await expect(userTablePage.inviteUsersLastNameField).toHaveValue('');
    await expect(userTablePage.inviteUsersEmailField).toHaveValue('');
  });

  test('Validate Successful invite Submission on Invite Users Modal @[111700] @admin @functional', async () => {
    // Generate unique email for this test run
    const email = `${TEST_DATA.USER.EMAIL_PREFIX}.${Date.now()}@example.com`;

    // Use comprehensive helper method that encapsulates all invitation steps
    await userTablePage.inviteUser(
      TEST_DATA.USER.FIRST_NAME,
      TEST_DATA.USER.LAST_NAME,
      email,
      TEST_DATA.USER.INSTITUTION,
      TEST_DATA.USER.ROLE
    );

    // Explicit assertions make the test's purpose clear
    await userTablePage.invitationSentMessage.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await expect(userTablePage.invitationSentMessage).toBeVisible();
    console.log(
      `User invited: ${TEST_DATA.USER.FIRST_NAME} ${TEST_DATA.USER.LAST_NAME} (${email}) - Role: ${TEST_DATA.USER.ROLE}`
    );
  });
});
