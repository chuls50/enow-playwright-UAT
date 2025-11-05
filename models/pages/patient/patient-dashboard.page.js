import { BasePage } from '../../base-page.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Dashboard Elements
    this.profileIcon = page.getByTestId('avatar').nth(1);

    // Navigation Elements
    this.navbar = page.getByTestId('navigation');
    this.navbarInstitutionLogo = page
      .getByTestId('navigation')
      .getByTestId('avatar')
      .locator('div')
      .nth(1);
    this.navbarDashboard = page.locator('a').filter({ hasText: 'Dashboard' });

    // Schedule Appointment
    this.scheduleAppointment = page.getByText('Schedule an appointment');

    // See Provider Now
    this.seeProviderNow = page.getByText('See a provider now');

    // Upcoming appointments
    this.upcomingAppointments = page.getByRole('heading', {
      name: 'Upcoming appointments',
    });

    // Past Appointments
    this.pastAppointments = page.getByRole('heading', {
      name: 'Past appointments',
    });

    // View Details link in Past Appointments
    this.pastAppointmentsViewDetailsLink = page
      .getByTestId('cell-0-actions')
      .getByRole('link', { name: 'View details' });
    this.sessionDetailsHeading = page.getByText('Session Details');

    // Year dropdown
    this.yearDropdownLink = page.getByRole('link', { name: 'ChevronDown' });
    this.itemsWrapper = page.getByTestId('items-wrapper');

    // User profile section Patient
    this.userProfileSection = page.getByTestId('popover-content');
    this.userProfileAccountSettings = page.getByRole('button', {
      name: 'SettingsGear Account settings',
    });
    this.userProfileHelp = page.getByRole('button', {
      name: 'InfoCircle Help',
    });
    this.userProfilePrivacyPolicy = page.getByRole('button', {
      name: 'Policy Privacy policy',
    });
    this.userProfileLogout = page.getByRole('button', {
      name: 'LogOut Log out',
    });

    // Need help modal
    this.needHelp = page.getByTestId('modal');
  }

  // Navigation Methods
  async gotoPatientDashboard() {
    await this.page.goto(`${process.env.UAT_URL}/dashboard`);
    await this.waitForSpinnerToDisappear();
    await this.upcomingAppointments.waitFor({ state: 'visible' });
  }

  // Multi-step actions that warrant POM methods
  async openUserProfileMenu() {
    await this.profileIcon.click();
  }

  async clickScheduleAppointment() {
    await this.scheduleAppointment.click();
    await this.page.waitForURL(/\/dashboard\/schedule-appointment/);
  }

  async clickSeeProviderNow() {
    await this.seeProviderNow.click();
    await this.page.waitForURL(/\/dashboard\/see-provider-now/);
  }

  async navigateToAccountSettings() {
    await this.profileIcon.click();
    await this.userProfileAccountSettings.click();
    await this.page.waitForURL(/\/account-settings\/my-account/);
  }

  async openHelpModal() {
    await this.profileIcon.click();
    await this.userProfileHelp.click();
    await this.needHelp.waitFor();
  }

  async logout() {
    await this.profileIcon.click();
    await this.userProfileLogout.click();
    await this.page.waitForURL(/\/login/);
  }
}
