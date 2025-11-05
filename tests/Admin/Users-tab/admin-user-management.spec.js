import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../../models/pages/admin/admin-users-table.page.js';
// Total tests 13 (including 1 skipped)

// Use stored auth for admin user
test.use({ storageState: 'playwright/.auth/admin.json' });

// Constants for test data
const TEST_DATA = {
  USER: {
    FIRST_NAME: 'John',
    LAST_NAME: 'Doe',
    EMAIL_PREFIX: 'john.doe',
    ROLE: 'Patient',
  },
  DEVICE: {
    NAME: 'Automation Test Device',
    EMAIL_PREFIX: 'test',
    ID_PREFIX: 'device',
    DUPLICATE_ID: '911',
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
    const searchTerm = 'cody test provider-';
    await userTablePage.searchInput.fill(searchTerm);

    // capture the inner text of cell-0
    const firstUsername = await userTablePage.page.getByTestId('cell-0-name').innerText();

    // verify the search result contains the search term
    expect(firstUsername.toLowerCase()).toContain(searchTerm.toLowerCase());
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
    const userToToggle = 'cody test provider-';
    await userTablePage.searchInput.fill(userToToggle);

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
    const validFirstName = 'John';
    const validLastName = 'Doe';
    await userTablePage.inviteUsersFirstNameField.fill(validFirstName);
    await userTablePage.inviteUsersLastNameField.fill(validLastName);
    await expect(userTablePage.inviteUsersSendInviteButton).toBeDisabled();

    // Fill invalid characters in name fields
    const invalidName = '%^&*';
    await userTablePage.inviteUsersFirstNameField.click();
    await userTablePage.inviteUsersFirstNameField.fill(invalidName);
    await userTablePage.inviteUsersLastNameField.click();
    await userTablePage.inviteUsersLastNameField.fill(invalidName);

    // Fill invalid characters in email field
    await userTablePage.inviteUsersEmailField.click();
    await userTablePage.inviteUsersEmailField.fill(invalidName);

    // Select institution and role to complete form
    await userTablePage.inviteUsersInstitutionDropdown.click();
    await userTablePage.inviteUsersInstitutionDropdownOptionCodyTest.click();
    await userTablePage.dropdownField.click();
    await userTablePage.inviteUsersRoleDropdownOptionPatient.click();

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
    await expect(userTablePage.inviteUsersInstitutionDropdownOptionGlobalMed).toBeVisible();

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
    await userTablePage.inviteUsersFirstNameField.fill('John');
    await userTablePage.inviteUsersLastNameField.fill('Doe');
    await userTablePage.inviteUsersEmailField.fill('example@domain.com');

    // Select institution and role
    await userTablePage.inviteUsersInstitutionDropdown.click();
    await userTablePage.inviteUsersInstitutionDropdownOptionGlobalMed.click();
    await userTablePage.inviteUsersRoleDropdown.click();
    await userTablePage.inviteUsersRoleDropdownOptionPatient.click();

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
    // Open the invite users modal
    await userTablePage.inviteUsersButton.click();

    // Generate test data for unique user invitation
    const firstName = TEST_DATA.USER.FIRST_NAME;
    const lastName = TEST_DATA.USER.LAST_NAME;
    const email = `${TEST_DATA.USER.EMAIL_PREFIX}.${Date.now()}@example.com`;
    const role = TEST_DATA.USER.ROLE;

    // Fill out complete form using helper methods
    await userTablePage.fillInviteUserForm(firstName, lastName, email);
    await userTablePage.selectInviteUserInstitution();
    await userTablePage.selectInviteUserRole(role);

    // Submit invitation and verify success
    await expect(userTablePage.inviteUsersSendInviteButton).toBeEnabled();
    await userTablePage.inviteUsersSendInviteButton.click();
    await userTablePage.invitationSentMessage.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await expect(userTablePage.invitationSentMessage).toBeVisible();
    console.log(`User invited: ${firstName} ${lastName} (${email}) - Role: ${role}`);
  });
});
