import { BasePage } from '../../base-page.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Dashboard Elements
    this.profileIcon = page.getByTestId('avatar').nth(1);

    // Navigation Elements
    this.navbar = page.getByTestId('navigation');
    this.navbarInstitutionLogo = page.getByTestId('navigation').getByTestId('avatar').locator('div').nth(1);
    this.navbarDashboard = page.locator('a').filter({ hasText: 'Dashboard' });

    // Appointment Scheduling Options
    this.scheduleAppointment = page.getByText('Schedule an appointment');
    this.seeProviderNow = page.getByText('See a provider now');

    // Upcomming/Past Appointments Sections
    this.upcomingAppointments = page.getByRole('heading', { name: 'Upcoming appointments' });
    this.pastAppointments = page.getByRole('heading', { name: 'Past appointments' });

    // View Details link in Past Appointments
    this.pastAppointmentsViewDetailsLink = page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' });
    this.sessionDetailsHeading = page.getByText('Session Details');

    // Year dropdown
    this.yearDropdownLink = page.getByRole('link', { name: 'ChevronDown' });
    this.itemsWrapper = page.getByTestId('items-wrapper');

    // User profile section Patient
    this.userProfileSection = page.getByTestId('popover-content');
    this.userProfileAccountSettings = page.getByRole('button', { name: 'SettingsGear Account settings' });
    this.userProfileHelp = page.getByRole('button', { name: 'InfoCircle Help' });
    this.userProfilePrivacyPolicy = page.getByRole('button', { name: 'Policy Privacy policy' });
    this.userProfileLogout = page.getByRole('button', { name: 'LogOut Log out' });

    // Need help modal
    this.needHelp = page.getByTestId('modal');

    // Session Scheduled
    this.sessionScheduled = page.getByText('Session scheduled').first();
    this.sessionCanceled = page.getByText('Session canceled');
    this.dotsVButton = page.getByRole('button', { name: 'DotsV' });
    this.cancelSessionButton = page.getByRole('button', { name: 'XCircle Cancel session' });
    this.confirmCancelButton = page.getByRole('button', { name: 'Yes, cancel' });
    this.closeButton = page.getByRole('button', { name: 'XClose' });

    // Manual Symptom Checker Skip elements
    this.symptomCheckerHeading = page.getByRole('heading', { name: 'My symptoms' });
    this.symptomCheckerContinueButton = page.getByRole('button', { name: 'Continue' });

    // Infermedica Triage Elements
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

  async resetStateIfSessionScheduled() {
    if (await this.sessionScheduled.isVisible()) {
      await this.sessionScheduled.click();
      await this.dotsVButton.click();
      await this.cancelSessionButton.click();
      await this.confirmCancelButton.click();
      await this.sessionCanceled.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(3000);
      await this.closeButton.click();
    }
  }

  async skipManualSymptomChecker() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    if (await this.symptomCheckerHeading.isVisible()) {
      await this.symptomCheckerContinueButton.click();
    }
  }
}
