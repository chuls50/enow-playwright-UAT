import { BasePage } from '../../base-page.js';

export class UsersTablePage extends BasePage {
  constructor(page) {
    super(page);

    // Page Elements
    this.header = page.getByText('Users').first();
    this.navigationBar = page.getByTestId('navigation');

    // Search Elements
    this.searchInputText = page.getByText('Search by name');
    this.searchInput = page.getByRole('textbox', { name: 'John Doe' });

    // Filter by role
    this.filterByRoleText = page.getByText('Filter by role');
    this.filterByRoleDropdown = page.getByTestId('custom-select-item-wrapper');
    this.filterByRoleDropdownOptions = page.getByTestId('custom-dropdown');
    this.filterByRoleDropdownOptionAll = page.getByTestId('custom-dropdown-item-All');
    this.filterByRoleDropdownOptionAdmin = page.getByTestId('custom-dropdown-item-Admin');
    this.filterByRoleDropdownOptionPatient = page.getByTestId('custom-dropdown-item-Patient');
    this.filterByRoleDropdownOptionProvider = page.getByTestId('custom-dropdown-item-Provider');
    this.filterByRoleDropdownOptionCoordinator = page.getByTestId('custom-dropdown-item-Coordinator');
    this.filterByRoleDropdownOptionDevice = page.getByTestId('custom-dropdown-item-Device');

    // Table Elements
    this.table = page.getByTestId('table');
    this.tableUsername = page.getByRole('cell', { name: 'User Name' });
    this.tableEmail = page.getByRole('cell', { name: 'Email' });
    this.tableAssignedRoles = page.getByRole('cell', { name: 'Assigned Roles' });
    this.tableStatus = page.getByRole('cell', { name: 'Active?' });
    this.tableLastUpdated = page.getByRole('cell', { name: 'Last Updated' });
    this.tableSortByLastUpdated = page.getByTestId('sort-button-updated_at');

    this.addRolesButton = page.getByRole('link', { name: 'Plus Add roles' }).first();
    this.activeToggleSwitch = page.getByTestId('switch-div').first();

    // Pagination Elements
    this.pagination = page.getByTestId('pagination');
    this.paginationPreviousButton = page.getByRole('button', { name: 'ArrowNarrowLeft Previous' });
    this.paginationNextButton = page.getByRole('button', { name: 'Next ArrowNarrowRight' });

    // Invite Users Elements
    this.inviteUsersButton = page.getByRole('button', { name: 'UserAdd Invite users' });
    this.inviteUsersModal = page.getByTestId('modal');
    this.inviteUsersModalHeader = page.getByTestId('modal').getByText('Invite user');
    this.inviteUsersFirstNameText = page.getByText('First name*');
    this.inviteUsersFirstNameField = page.getByRole('textbox', { name: 'John' });
    this.inviteUsersLastNameText = page.getByText('Last name*');
    this.inviteUsersLastNameField = page.getByRole('textbox', { name: 'Doe' });
    this.inviteUsersEmailText = page.getByText('Email*');
    this.inviteUsersEmailField = page.getByRole('textbox', { name: 'example@mail.com' });
    this.inviteUsersInstitutionText = page.getByText('Institution', { exact: true });
    this.inviteUsersInstitutionDropdown = page.getByTestId('modal').getByTestId('custom-select-item-wrapper');
    this.inviteUsersInstitutionDropdownOptions = page.getByTestId('custom-dropdown');
    this.inviteUsersInstitutionDropdownOptionCodyTest = page.getByTestId('custom-dropdown-item-Cody Test');
    this.inviteUsersRoleText = page.getByTestId('modal').getByText('Role');
    this.inviteUsersRoleDropdown = page.getByRole('textbox', { name: 'Patient, Provider...' });
    this.inviteUsersRoleDropdownOptions = page.getByTestId('items-wrapper');
    this.inviteUsersRoleDropdownOptionAdmin = page.getByTestId('item Admin');
    this.inviteUsersRoleDropdownOptionPatient = page.getByTestId('item Patient');
    this.inviteUsersRoleDropdownOptionProvider = page.getByTestId('item Provider');
    this.inviteUsersRoleDropdownOptionCoordinator = page.getByTestId('item Coordinator');
    this.inviteUsersCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.inviteUsersSendInviteButton = page.getByRole('button', { name: 'Send invite' });

    // Create Device ID Elements
    this.createDeviceIdButton = page.getByRole('button', { name: 'ConsultForm Create Device ID' });
    this.createDeviceIdModal = page.getByTestId('modal');
    this.createDeviceIdModalHeader = page.getByTestId('modal').getByText('Create Device ID').first();
    this.createDeviceIdNameText = page.getByText('Name*');
    this.createDeviceIdNameField = page.getByRole('textbox', { name: 'John' });
    this.createDeviceIdDeviceIDText = page.getByText('Device ID*');
    this.createDeviceIdDeviceIDField = page.getByRole('textbox', { name: '123' });
    this.createDeviceIdEmailText = page.getByText('Email*');
    this.createDeviceIdEmailField = page.getByRole('textbox', { name: 'example@mail.com' });
    this.createDeviceIdInstitutionText = page.getByText('Institution', { exact: true });
    this.createDeviceIdInstitutionDropdown = page.getByTestId('modal').getByTestId('custom-select-item-wrapper');
    this.createDeviceIdCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.createDeviceIdSendInviteButton = page.getByRole('button', { name: 'Create Device ID' });

    // Missing locators for test assertions
    this.selectedRoleFilterAdmin = page.getByTestId('custom-select-item-wrapper').getByText('Admin');
    this.selectedRoleFilterProvider = page.getByTestId('custom-select-item-wrapper').getByText('Provider');
    this.selectedRoleFilterAll = page.getByTestId('custom-select-item-wrapper').getByText('All');
    this.selectedRoleFilterDevice = page.getByTestId('custom-select-item-wrapper').getByText('Device');

    // Status messages
    this.userInactiveMessage = page.getByText('User is now inactive');
    this.userActiveMessage = page.getByText('User is now active');
    this.invitationSentMessage = page.getByText('Invitation sent');
    this.deviceIdExistsError = page.getByText('This Device ID already exists').first();

    // Validation error messages
    this.firstNameValidationError = page.getByText('First name must contain at');
    this.lastNameValidationError = page.getByText('Last name must contain at');
    this.emailValidationError = page.getByText('Email fields can only include alphanumeric characters');

    // Additional elements accessed directly in tests
    this.deviceRoleOption = page.getByTestId('item Device');
  }

  async gotoUsersTable() {
    await this.page.goto(`${process.env.UAT_URL}/users-table`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    // Wait for Users table to load
    await this.header.waitFor({ state: 'visible' });
    await this.table.waitFor({ state: 'visible' });
  }

  /**
   * Helper method to fill the Create Device ID form
   */
  async fillCreateDeviceIdForm(deviceName, email, deviceId) {
    await this.createDeviceIdNameField.fill(deviceName);
    await this.createDeviceIdEmailField.fill(email);
    await this.createDeviceIdDeviceIDField.fill(deviceId);
  }

  /**
   * Helper method to select institution in the Create Device ID form
   */
  async selectCreateDeviceIdInstitution(institutionName) {
    await this.createDeviceIdInstitutionDropdown.click();

    // Use a dynamic locator based on the institution name
    const institutionOption = this.page.getByTestId(`custom-dropdown-item-${institutionName}`);
    await institutionOption.click();
    await this.createDeviceIdInstitutionDropdown.click();
  }

  /**
   * Helper method to fill the Invite User form
   */
  async fillInviteUserForm(firstName, lastName, email) {
    await this.inviteUsersFirstNameField.fill(firstName);
    await this.inviteUsersLastNameField.fill(lastName);
    await this.inviteUsersEmailField.fill(email);
  }

  /**
   * Helper method to select institution in Invite User form
   */
  async selectInviteUserInstitution(institutionName) {
    await this.inviteUsersInstitutionDropdown.click();

    // Use a dynamic locator based on the institution name
    const institutionOption = this.page.getByTestId(`custom-dropdown-item-${institutionName}`);
    await institutionOption.click();
    await this.inviteUsersInstitutionDropdown.click();
  }

  /**
   * Helper method to select role in Invite User form
   */
  async selectInviteUserRole(role) {
    await this.inviteUsersRoleDropdown.click();

    switch (role.toLowerCase()) {
      case 'admin':
        await this.inviteUsersRoleDropdownOptionAdmin.click();
        break;
      case 'patient':
        await this.inviteUsersRoleDropdownOptionPatient.click();
        break;
      case 'provider':
        await this.inviteUsersRoleDropdownOptionProvider.click();
        break;
      case 'coordinator':
        await this.inviteUsersRoleDropdownOptionCoordinator.click();
        break;
      default:
        await this.inviteUsersRoleDropdownOptionPatient.click();
    }
  }

  /**
   * Complete helper method to invite a user (multi-step action)
   * Encapsulates the entire invitation process as recommended by POM best practices
   */
  async inviteUser(firstName, lastName, email, institutionName, role) {
    await this.inviteUsersButton.click();
    await this.fillInviteUserForm(firstName, lastName, email);
    await this.selectInviteUserInstitution(institutionName);
    await this.selectInviteUserRole(role);
    await this.inviteUsersSendInviteButton.click();
  }

  /**
   * Complete helper method to create a device ID (multi-step action)
   * Encapsulates the entire device creation process as recommended by POM best practices
   */
  async createDeviceId(deviceName, email, deviceId, institutionName) {
    await this.createDeviceIdButton.click();
    await this.fillCreateDeviceIdForm(deviceName, email, deviceId);
    await this.selectCreateDeviceIdInstitution(institutionName);
    await this.createDeviceIdSendInviteButton.click();
  }
}
