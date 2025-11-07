import { BasePage } from '../../base-page.js';

export class AdminDataReportingPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation Links
    this.dataReportingLink = this.page.getByText('Data reporting');
    this.dashboardLink = this.page.getByText('Dashboard');
    this.totalCallsTab = this.page.locator('a').filter({ hasText: 'Total Calls' });
    this.totalEncountersTab = this.page.locator('a').filter({ hasText: 'Total Encounters' });
    this.totalAppointmentsTab = this.page.locator('a').filter({ hasText: 'Total Appointments' });
    this.concurrentUsageTab = this.page.locator('a').filter({ hasText: 'Concurrent Usage' });

    // Filter Elements
    this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear filters' });
    this.saveFilterButton = this.page.getByRole('button', { name: 'Save filter values' });
    this.refreshButton = this.page.getByRole('link', { name: 'Refresh' });
    this.applyFilterButton = this.page.getByRole('button', { name: 'Apply Filter' });
    this.defaultFiltersButton = this.page.getByRole('link', { name: 'ClockRewind' });

    // Filter Dropdowns
    this.reportingPeriodFilter = this.page.getByRole('link', { name: 'Reporting Period ChevronDown' });
    this.reportingLevelFilter = this.page.getByRole('link', { name: 'Reporting Level ChevronDown' });
    this.appointmentTypeFilter = this.page.getByRole('link', { name: 'Appointment Type ChevronDown' });
    this.serviceFilter = this.page.getByRole('link', { name: 'Service ChevronDown' });
    this.timePeriodFilter = this.page.getByRole('link', { name: 'Time Period ChevronDown' });
    this.usersFilter = this.page.getByRole('link', { name: 'Users ChevronDown' });
    this.requestTypeFilter = this.page.getByRole('link', { name: 'Request Type ChevronDown' });

    // Filter Items Container
    this.itemsWrapper = this.page.getByTestId('items-wrapper');
    this.popoverContent = this.page.getByTestId('popover-content');

    // Filter Panel
    this.filterPanel = this.page.getByTestId('filter-panel');

    // Date Filter Elements
    this.dateInputFirst = this.page.getByRole('textbox', { name: 'MM/DD/YYYY' }).first();
    this.dateInputSecond = this.page.getByRole('textbox', { name: 'MM/DD/YYYY' }).nth(1);

    // Calendar Navigation
    this.calendarLeftButton = this.page.getByRole('button', { name: 'ChevronLeft' });
    this.calendarRightButton = this.page.getByRole('button', { name: 'ChevronRight' });

    // Report Elements
    this.alertCircleTooltip = this.page.getByRole('link', { name: 'AlertCircle' });
    this.showDetailsLink = this.page.getByRole('link', { name: 'Show details' });

    // Success Messages
    this.filtersSavedMessage = this.page.getByText('SuccessFilters saved');
    this.filtersRefreshedMessage = this.page.getByText('SuccessFilters refreshed');

    // Download Elements
    this.downloadButton = this.page.getByRole('link', { name: 'Download' });

    // Table Elements
    this.reportTable = this.page.locator('table');
    this.tableRows = this.page.locator('tbody tr');

    // Legend Elements for Tooltips
    this.callsScheduledLegend = this.page.getByText('Calls Scheduled');
    this.callsOccurredLegend = this.page.getByText('Calls Occurred');
    this.callsDidNotOccurLegend = this.page.getByText('Calls Did Not Occur');
    this.encountersScheduledLegend = this.page.getByText('Encounters Scheduled');
    this.encountersOccurredLegend = this.page.getByText('Encounters Occurred');
    this.encountersDidNotOccurLegend = this.page.getByText('Encounters Did Not Occur');
    this.appointmentsScheduledLegend = this.page.getByText('Appointments Scheduled');
    this.appointmentsOccurredLegend = this.page.getByText('Appointments Occurred');
    this.appointmentsDidNotOccurLegend = this.page.getByText('Appointments Did Not Occur');
    this.appointmentsRescheduledLegend = this.page.getByText('Appointments Rescheduled');
    this.appointmentsCancelledLegend = this.page.getByText('Appointments Cancelled');

    // Report Headings
    this.totalCallsHeading = this.page.getByRole('heading', { name: 'Total Calls' });
    this.totalEncountersHeading = this.page.getByRole('heading', { name: 'Total Encounters' });
    this.totalAppointmentsHeading = this.page.getByRole('heading', { name: 'Total Appointments' });
    this.dashboardHeading = this.page.getByRole('heading', { name: 'Dashboard' });

    // Dashboard Section Headings - Year to Date
    this.yearToDateHeading = this.page.getByRole('heading', { name: 'Year to Date', exact: true });
    this.ytdTotalEncountersHeading = this.page.getByRole('heading', { name: 'Total Encounters' }).first();
    this.ytdAverageLengthHeading = this.page.getByRole('heading', { name: 'Average Length' }).first();
    this.ytdTotalParticipantsHeading = this.page.getByRole('heading', { name: 'Total Participants' }).first();

    // Dashboard Section Headings - Month to Date
    this.monthToDateHeading = this.page.getByRole('heading', { name: 'Month to Date' });
    this.mtdTotalEncountersHeading = this.page.getByRole('heading', { name: 'Total Encounters' }).nth(1);
    this.mtdAverageLengthHeading = this.page.getByRole('heading', { name: 'Average Length' }).nth(1);
    this.mtdTotalParticipantsHeading = this.page.getByRole('heading', { name: 'Total Participants' }).nth(1);

    // Dashboard Section Headings - Usage
    this.usageHeading = this.page.getByRole('heading', { name: 'Usage', exact: true });
    this.concurrentUsageHeading = this.page.getByRole('heading', { name: 'Concurrent Usage' });
    this.encountersPerMonthHeading = this.page.getByRole('heading', { name: 'Encounters per Month, Year to' });

    // Summary Report Elements
    this.totalCountHeading = this.page.getByRole('heading', { name: 'Total Count of Calls/Encounters' });
    this.averageLengthHeading = this.page.getByRole('heading', { name: 'Average Length of Calls/Encounters' });
    this.longestCallHeading = this.page.getByRole('heading', { name: 'Longest Call/Encounter' });
    this.totalParticipantsHeading = this.page.getByRole('heading', { name: 'Total # of Participants' });
    this.averageParticipantsHeading = this.page.getByRole('heading', { name: 'Average per Call # of Participants' });
    this.largestParticipantsHeading = this.page.getByRole('heading', { name: 'Largest # of Participants' });
  }

  // Navigation Methods
  async navigateToDataReporting() {
    await this.dataReportingLink.click();
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDataReportingDashboard() {
    await this.dataReportingLink.click();
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalCalls() {
    await this.totalCallsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalEncounters() {
    await this.totalEncountersTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalAppointments() {
    await this.totalAppointmentsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToConcurrentUsage() {
    await this.concurrentUsageTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Direct URL Navigation for Detail Pages
  async navigateToTotalCallsDetails() {
    await this.page.goto('https://xj9.sandbox-encounterservices.com/data-reporting/total-calls-details');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalEncountersDetails() {
    await this.page.goto('https://xj9.sandbox-encounterservices.com/data-reporting/total-encounters-details');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalAppointmentsDetails() {
    await this.page.goto('https://xj9.sandbox-encounterservices.com/data-reporting/total-appointments-details');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalCallsSummary() {
    await this.page.goto('https://xj9.sandbox-encounterservices.com/data-reporting/total-calls-summary');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTotalEncountersSummary() {
    await this.page.goto('https://xj9.sandbox-encounterservices.com/data-reporting/total-encounters-summary');
    await this.page.waitForLoadState('networkidle');
  }

  // Filter Management Methods
  async clearAllFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.waitForSpinnerToDisappear();
  }

  async saveFilterValues() {
    await this.saveFilterButton.click();
    await this.filtersSavedMessage.waitFor({ state: 'visible' });
  }

  async refreshFilters() {
    await this.refreshButton.click();
    await this.filtersRefreshedMessage.waitFor({ state: 'visible' });
  }

  // Single Filter Selection Methods (3+ steps each)
  async applyReportingPeriodFilter(period) {
    await this.reportingPeriodFilter.click();
    await this.page.getByTestId(`item ${period}`).click();
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(300);
  }

  async applyReportingLevelFilter(level) {
    await this.reportingLevelFilter.click();
    await this.page.getByTestId(`item ${level}`).click();
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(300);
  }

  async applyAppointmentTypeFilter(type) {
    await this.appointmentTypeFilter.click();
    await this.page.getByTestId(`item ${type}`).click();
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(300);
  }

  async applyServiceFilter(service) {
    await this.serviceFilter.click();
    await this.page.getByTestId(`item ${service}`).click();
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(300);
  }

  async applyUsersFilter(user) {
    await this.usersFilter.click();
    await this.page.getByTestId(`item ${user}`).click();
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(300);
  }

  async applyRequestTypeFilter(requestType) {
    await this.requestTypeFilter.click();
    await this.page.getByTestId(`item ${requestType}`).click();
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(300);
  }

  // Multi-Select Filter Methods (3+ steps each)
  async applyMultipleServices(services) {
    await this.serviceFilter.click();
    await this.page.waitForTimeout(500);

    for (const service of services) {
      await this.page.getByTestId(`item ${service}`).click();
      await this.page.waitForTimeout(500);
    }

    await this.applyFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  async applyMultipleAppointmentTypes(types) {
    await this.appointmentTypeFilter.click();
    await this.page.waitForTimeout(500);

    for (const type of types) {
      await this.page.getByTestId(`item ${type}`).click();
      await this.page.waitForTimeout(500);
    }

    await this.applyFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  async applyMultipleRequestTypes(requestTypes) {
    await this.requestTypeFilter.click();
    await this.page.waitForTimeout(500);

    for (const requestType of requestTypes) {
      await this.page.getByTestId(`item ${requestType}`).click();
      await this.page.waitForTimeout(500);
    }

    await this.applyFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  // Date Range Filter Methods (3+ steps each)
  async applyDateRangeFilter(startDate, endDate) {
    await this.timePeriodFilter.click();
    await this.dateInputFirst.click();
    await this.dateInputFirst.fill(startDate);
    await this.dateInputSecond.click();
    await this.dateInputSecond.fill(endDate);
    await this.applyFilterButton.click();
  }

  async applyCalendarDateSelection(dayOption) {
    await this.timePeriodFilter.click();
    await this.calendarLeftButton.first().click();
    await this.calendarRightButton.first().click();
    await this.calendarRightButton.nth(1).click();
    await this.calendarLeftButton.nth(1).click();
    await this.page.getByRole('option', { name: dayOption }).click();
    await this.applyFilterButton.click();
  }

  // Clear Individual Filter Methods (3+ steps each)
  async clearReportingPeriodFilter() {
    await this.page.getByRole('link', { name: 'Reporting Period 1 ChevronDown' }).click();
    await this.popoverContent.getByRole('button', { name: 'Clear Filter' }).click();
    await this.page.waitForTimeout(300);
  }

  async clearReportingLevelFilter() {
    await this.page.getByRole('link', { name: 'Reporting Level 1 ChevronDown' }).click();
    await this.popoverContent.getByRole('button', { name: 'Clear Filter' }).click();
    await this.page.waitForTimeout(300);
  }

  async clearTimePeriodFilter() {
    await this.page.getByRole('link', { name: 'Time Period 1 ChevronDown' }).click();
    await this.popoverContent.getByRole('button', { name: 'Clear Filter' }).click();
    await this.page.waitForTimeout(300);
  }

  // Remove Individual Filter Tags (3+ steps each)
  async removeFilterTag(filterText) {
    const filterTag = this.page.locator('div').filter({ hasText: new RegExp(`^${filterText}$`) });
    await filterTag.waitFor({ state: 'visible' });
    await filterTag.getByRole('button').click();
    await this.page.waitForTimeout(300);
  }

  // Download Methods (3+ steps each)
  async downloadReport() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadButton.click();
    const download = await downloadPromise;
    return download;
  }

  // Wait for Spinner to Disappear
  async waitForSpinnerToDisappear(spinnerSelector = '[data-testid="spinner"]', timeout = 120000) {
    try {
      await this.page.waitForSelector(spinnerSelector, { state: 'detached', timeout });
    } catch (e) {
      console.log('Spinner did not disappear within timeout or was not found.');
    }
  }
}
