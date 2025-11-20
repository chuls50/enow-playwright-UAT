import { BasePage } from '../../base-page.js';

export class CoordinatorDashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Dashboard Elements
    this.scheduleHeading = page.getByRole('heading', { name: 'Your schedule for today' });

    // Navigation
    this.navigation = page.getByTestId('navigation');
    this.dashboardLink = page.locator('a').filter({ hasText: 'Dashboard' });
    this.pastSessionsLink = page.locator('a').filter({ hasText: 'Past sessions' });
    this.providersLink = page.locator('a').filter({ hasText: 'Providers' });
    this.patientsLink = page.locator('a').filter({ hasText: 'Patients' });
    this.waitingRoomsLink = page.locator('a').filter({ hasText: 'Waiting rooms' });

    // Action Buttons
    this.scheduleSession = page.getByRole('button', { name: 'CalendarPlus Schedule session' });
    this.notificationBell = page.getByRole('link', { name: 'Bell' });

    // Provider Tab
    this.providersTab = page.getByText('Providers');
  }

  // Navigation Methods
  async gotoCoordinatorDashboard() {
    await this.page.goto(`${process.env.UAT_URL}/dashboard`);
    await this.waitForSpinnerToDisappear();
    await this.scheduleSession.waitFor({ state: 'visible' });
  }
}
