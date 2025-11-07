import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
import { AdminDataReportingPage } from '../../models/pages/admin/admin-data-reporting.page.js';
import { useRole, ROLES } from '../../utils/auth-helpers.js';

// Admin Reporting - Total tests 26 (including 5 skipped)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let usersTablePage;
  let adminDataReportingPage;

  test.beforeEach(async ({ page }) => {
    usersTablePage = new UsersTablePage(page);
    adminDataReportingPage = new AdminDataReportingPage(page);

    // Navigate to reporting page and prepare test environment
    await usersTablePage.gotoUsersTable();
    await adminDataReportingPage.navigateToDataReporting();
    await adminDataReportingPage.navigateToTotalCalls();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.waitForSpinnerToDisappear();
  });

  test('Verify Navigation to Total Calls Report @[115413] @admin @functional', async ({ page }) => {
    // Hover over info tooltip and verify help text appears
    await adminDataReportingPage.alertCircleTooltip.hover();
    await expect(
      page.getByText(
        "This report displays information about 'Calls' where a 'Call' is defined as 1 or more people have joined a session. " +
          'This could apply to a scheduled appointment of type Video Call, Chat or to an unscheduled meeting accessed via a link or meeting ID.',
        { exact: true }
      )
    ).toBeVisible();
  });

  // flaky
  test.skip('Verify data in Total Calls Bar Chart @[115414] @admin @functional', async ({ page }) => {});

  test('Verify Legend Descriptions for Total Calls Metrics @[115415] @admin @ui', async ({ page }) => {
    // Verify "Calls Scheduled" legend tooltip
    await adminDataReportingPage.callsScheduledLegend.hover();
    await page.getByText('Calls Scheduled').waitFor({ state: 'visible' });
    await expect(
      page.getByText('This is a count of all Scheduled appointments for this reporting period group.', { exact: true })
    ).toBeVisible();

    // Verify "Calls Occurred" legend tooltip
    await adminDataReportingPage.callsOccurredLegend.hover();
    await expect(
      page.getByText(
        'This is a count of all Scheduled appointments where a Call occurred for this reporting period group (1 or more participants joined); ' +
          'this would include Encounters where 2 or more participants joined.',
        { exact: true }
      )
    ).toBeVisible();

    // Verify "Calls Did Not Occur" legend tooltip
    await adminDataReportingPage.callsDidNotOccurLegend.hover();
    await expect(
      page.getByText(
        'This is a count of all Scheduled appointments where a Call did not occur for this reporting period group (0 participants joined).',
        { exact: true }
      )
    ).toBeVisible();
  });

  test('Verify Filters Single Select functionality @[115416] @admin @functional', async ({ page }) => {
    // Test total calls filters - apply multiple filters and verify display
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyReportingPeriodFilter('Week');
    await adminDataReportingPage.applyReportingLevelFilter('Coordinators');
    await adminDataReportingPage.applyAppointmentTypeFilter('Video');
    await expect(page.getByText('Cody TestWeekCoordinatorsVideo')).toBeVisible();

    // Test filter removal and clearing functionality
    await adminDataReportingPage.removeFilterTag('Video');
    await expect(page.getByText('Cody TestWeekCoordinators')).toBeVisible();
    await adminDataReportingPage.clearReportingLevelFilter();
    await adminDataReportingPage.clearReportingPeriodFilter();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();

    // total encounters
    await adminDataReportingPage.navigateToTotalEncounters();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyReportingPeriodFilter('Week');
    await adminDataReportingPage.applyReportingLevelFilter('Coordinators');
    await adminDataReportingPage.applyAppointmentTypeFilter('Video');
    await expect(page.getByText('Cody TestWeekCoordinatorsVideo')).toBeVisible();
    await adminDataReportingPage.removeFilterTag('Video');
    await expect(page.getByText('Cody TestWeekCoordinators')).toBeVisible();
    await adminDataReportingPage.clearReportingLevelFilter();
    await adminDataReportingPage.clearReportingPeriodFilter();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();

    // total appointments
    await adminDataReportingPage.navigateToTotalAppointments();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyReportingPeriodFilter('Week');
    await adminDataReportingPage.applyReportingLevelFilter('Coordinators');
    await adminDataReportingPage.applyAppointmentTypeFilter('Video');
    await expect(page.getByText('Cody TestWeekCoordinatorsVideo')).toBeVisible();
    await adminDataReportingPage.removeFilterTag('Video');
    await expect(page.getByText('Cody TestWeekCoordinators')).toBeVisible();
    await adminDataReportingPage.clearReportingLevelFilter();
    await adminDataReportingPage.clearReportingPeriodFilter();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();
  });

  test('Verify data in Total Calls Summary Report @[115589] @admin @ui', async ({ page }) => {
    // Navigate to calls summary report
    await adminDataReportingPage.navigateToTotalCallsSummary();

    // Verify all summary report headings are visible
    await adminDataReportingPage.totalCallsHeading.waitFor({ state: 'visible' });
    await expect(adminDataReportingPage.totalCallsHeading).toBeVisible();
    await expect(adminDataReportingPage.totalCountHeading).toBeVisible();
    await expect(adminDataReportingPage.averageLengthHeading).toBeVisible();
    await expect(adminDataReportingPage.longestCallHeading).toBeVisible();
    await expect(adminDataReportingPage.totalParticipantsHeading).toBeVisible();
    await expect(adminDataReportingPage.averageParticipantsHeading).toBeVisible();
    await expect(adminDataReportingPage.largestParticipantsHeading).toBeVisible();
  });

  test('Verify data in Total Encounters Summary Report @[120182] @admin @ui', async ({ page }) => {
    // Navigate to encounters summary report
    await adminDataReportingPage.navigateToTotalEncountersSummary();

    // Verify all encounters summary report headings are visible
    await adminDataReportingPage.totalEncountersHeading.waitFor({ state: 'visible' });
    await expect(adminDataReportingPage.totalEncountersHeading).toBeVisible();
    await expect(adminDataReportingPage.totalCountHeading).toBeVisible();
    await expect(adminDataReportingPage.averageLengthHeading).toBeVisible();
    await expect(adminDataReportingPage.longestCallHeading).toBeVisible();
    await expect(adminDataReportingPage.totalParticipantsHeading).toBeVisible();
    await expect(adminDataReportingPage.averageParticipantsHeading).toBeVisible();
    await expect(adminDataReportingPage.largestParticipantsHeading).toBeVisible();
  });

  // flaky
  test.skip('Total Calls/Encounters - Verify data in Detailed Report/Show details @[115596] @admin @functional', async ({ page }) => {});

  test('[Negative] Verify that Institution filter is mandatory @[115598] @admin @functional', async ({ page }) => {
    // Verify institution filter is present and mandatory
    await expect(
      adminDataReportingPage.filterPanel
        .locator('div')
        .filter({ hasText: /^Cody Test$/ })
        .first()
    ).toBeVisible();

    // Attempt to change institution filter and verify it persists
    await page.getByRole('link', { name: 'Institution 1 ChevronDown' }).click();
    await page.getByTestId('item Cody Test').click();
    await adminDataReportingPage.applyFilterButton.click();
    await expect(
      adminDataReportingPage.filterPanel
        .locator('div')
        .filter({ hasText: /^Cody Test$/ })
        .first()
    ).toBeVisible();

    // Close filter and verify institution remains selected
    await page.getByRole('button', { name: 'XClose' }).click();
    await expect(
      adminDataReportingPage.filterPanel
        .locator('div')
        .filter({ hasText: /^Cody Test$/ })
        .first()
    ).toBeVisible();
  });

  test('Verify PDF downloading and validating - Total Calls @[115599] @admin @functional', async ({ page }) => {
    // Navigate to Total Calls report and prepare for download
    await adminDataReportingPage.navigateToTotalCalls();
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');

    // Download report and verify file generation
    const download = await adminDataReportingPage.downloadReport();
    const fileName = download.suggestedFilename();
    const filePath = './downloads/' + fileName;
    await download.saveAs(filePath);
    expect(fileName).toBeTruthy();
  });

  test('Verify PDF downloading and validating - Total Encounters @[120185] @admin @functional', async ({ page }) => {
    // Download for Total Encounters
    await adminDataReportingPage.navigateToTotalEncounters();
    await page.waitForTimeout(5000); // wait for 5 seconds before next download
    await page.waitForLoadState('networkidle'); // Wait for network requests to complete
    const encountersDownload = await adminDataReportingPage.downloadReport();
    const encountersFileName = await encountersDownload.suggestedFilename();
    const encountersFilePath = './downloads/' + encountersFileName;
    await encountersDownload.saveAs(encountersFilePath);
    expect(encountersFileName).toBeTruthy();
  });

  test('Verify PDF downloading and validating - Total Appointments @[120186] @admin @functional', async ({ page }) => {
    // Download for Total Appointments
    await adminDataReportingPage.navigateToTotalAppointments();
    await page.waitForTimeout(5000); // wait for 5 seconds before next download
    await page.waitForLoadState('networkidle'); // Wait for network requests to complete
    const appointmentsDownload = await adminDataReportingPage.downloadReport();
    const appointmentsFileName = await appointmentsDownload.suggestedFilename();
    const appointmentsFilePath = './downloads/' + appointmentsFileName;
    await appointmentsDownload.saveAs(appointmentsFilePath);
    expect(appointmentsFileName).toBeTruthy();
  });

  test('Verify Filter buttons Save/Refresh/Clear functionality - Total Calls @[115600] @admin @functional', async ({ page }) => {
    // Apply and save custom filter values
    await adminDataReportingPage.applyReportingPeriodFilter('Day');
    await adminDataReportingPage.applyReportingLevelFilter('Patients');
    await adminDataReportingPage.saveFilterValues();

    // Navigate away and back to verify saved filters persist
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await adminDataReportingPage.dataReportingLink.click();
    await adminDataReportingPage.totalCallsTab.click();
    await expect(page.getByText('Cody TestDayPatients')).toBeVisible();

    // Test refresh functionality
    await adminDataReportingPage.refreshButton.click();
    await adminDataReportingPage.waitForSpinnerToDisappear();

    // Test reset to default filters functionality
    await adminDataReportingPage.defaultFiltersButton.click();
    await page.getByText('SuccessFilters reset to').waitFor({ state: 'visible' });
    await expect(page.getByText('WeekAllAllAllCody Test')).toBeVisible();

    // Test clear all filters functionality
    await adminDataReportingPage.clearAllFilters();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();
  });

  test('Verify Filter buttons Save/Refresh/Clear functionality - Total Encounters @[120189] @admin @functional', async ({ page }) => {
    // total encounters
    await adminDataReportingPage.navigateToTotalEncounters();
    await adminDataReportingPage.clearAllFilters();

    // save filter values
    await adminDataReportingPage.applyReportingPeriodFilter('Day');
    await adminDataReportingPage.applyReportingLevelFilter('Patients');
    await adminDataReportingPage.saveFilterValues();

    // click on different tab and back to check if values are saved
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await adminDataReportingPage.dataReportingLink.click();
    await adminDataReportingPage.totalEncountersTab.click();
    await page.getByText('Cody TestDayPatients').waitFor({ state: 'visible' });
    await expect(page.getByText('Cody TestDayPatients')).toBeVisible();

    // refresh filter values
    await adminDataReportingPage.refreshButton.click();
    await adminDataReportingPage.waitForSpinnerToDisappear();

    // reset to default filters values
    await adminDataReportingPage.defaultFiltersButton.click();
    await page.getByText('SuccessFilters reset to').waitFor({ state: 'visible' });
    await expect(page.getByText('WeekAllAllAllCody Test')).toBeVisible();
  });

  test('Verify Filter buttons Save/Refresh/Clear functionality - Total Appointments @[120190] @admin @functional', async ({ page }) => {
    // total appointments
    await adminDataReportingPage.navigateToTotalAppointments();
    await adminDataReportingPage.clearAllFilters();

    // save filter values
    await adminDataReportingPage.applyReportingPeriodFilter('Day');
    await adminDataReportingPage.applyReportingLevelFilter('Patients');
    await adminDataReportingPage.saveFilterValues();

    // click on different tab and back to check if values are saved
    await page.locator('a').filter({ hasText: 'Institution settings' }).click();
    await adminDataReportingPage.dataReportingLink.click();
    await adminDataReportingPage.totalAppointmentsTab.click();
    await expect(page.getByText('Cody TestDayPatients')).toBeVisible();

    // refresh filter values
    await adminDataReportingPage.refreshButton.click();
    await adminDataReportingPage.waitForSpinnerToDisappear();

    // reset to default filters values
    await adminDataReportingPage.defaultFiltersButton.click();
    await page.getByText('SuccessFilters reset to').waitFor({ state: 'visible' });
    await expect(page.getByText('WeekAllAllAllCody Test')).toBeVisible();
  });

  test('Verify Filters Multi select functionality - Total Calls @[115614] @admin @functional', async ({ page }) => {
    // Test appointment type filter with "All" selection
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyAppointmentTypeFilter('All');
    await expect(page.getByText('Cody TestAll')).toBeVisible();
    await expect(page.getByText('Calls did not occur').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    // Test multiple appointment type selection
    await adminDataReportingPage.applyMultipleAppointmentTypes(['Video', 'Chat']);
    await expect(page.getByText('Cody TestVideoChat')).toBeVisible();
    await expect(page.getByText('Calls did not occur').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    // Test request type filter with "All" selection
    await adminDataReportingPage.applyRequestTypeFilter('All');
    await expect(page.getByText('Cody TestAll')).toBeVisible();
    await expect(page.getByText('Calls did not occur').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    // Test multiple request type selection and tag removal
    await adminDataReportingPage.applyMultipleRequestTypes(['Scheduled', 'On-Demand']);
    await expect(page.getByText('Cody TestScheduledOn')).toBeVisible();
    await expect(page.getByText('Calls did not occur').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleRequestTypes(['Scheduled', 'On-Demand']);
    await expect(page.getByText('Cody TestScheduledOn-Demand')).toBeVisible();
    await expect(page.getByText('Calls did not occur').first()).toBeVisible({ timeout: 15000 });

    // Test filter tag removal functionality
    await adminDataReportingPage.removeFilterTag('On-Demand');
    await expect(page.getByText('Cody TestScheduled')).toBeVisible();
  });

  test('Verify Filters Multiselect functionality - Total Encounters @[120192] @admin @functional', async ({ page }) => {
    // total encounters
    await adminDataReportingPage.navigateToTotalEncounters();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyAppointmentTypeFilter('All');
    await expect(page.getByText('Cody TestAll')).toBeVisible();
    await expect(page.getByText('Calls Only').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleAppointmentTypes(['Video', 'Chat']);
    await expect(page.getByText('Cody TestVideoChat')).toBeVisible();
    await expect(page.getByText('Calls Only').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyRequestTypeFilter('All');
    await expect(page.getByText('Cody TestAll')).toBeVisible();
    await expect(page.getByText('Calls Only').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleRequestTypes(['Scheduled', 'On-Demand']);
    await expect(page.getByText('Cody TestScheduledOn')).toBeVisible();
    await expect(page.getByText('Calls Only').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleRequestTypes(['Scheduled', 'On-Demand']);
    await expect(page.getByText('Cody TestScheduledOn-Demand')).toBeVisible();
    await expect(page.getByText('Calls Only').first()).toBeVisible({ timeout: 15000 });

    await adminDataReportingPage.removeFilterTag('On-Demand');
    await expect(page.getByText('Cody TestScheduled')).toBeVisible();
  });

  test('Verify Filters Multiselect functionality - Total Appointments @[120193] @admin @functional', async ({ page }) => {
    // total appointments
    await adminDataReportingPage.navigateToTotalAppointments();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyAppointmentTypeFilter('All');
    await expect(page.getByText('Cody TestAll')).toBeVisible();
    await expect(page.getByText('Appointments scheduled').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleAppointmentTypes(['Video', 'Chat']);
    await expect(page.getByText('Cody TestVideoChat')).toBeVisible();
    await expect(page.getByText('Appointments scheduled').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyRequestTypeFilter('All');
    await expect(page.getByText('Cody TestAll')).toBeVisible();
    await expect(page.getByText('Appointments scheduled').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleRequestTypes(['Scheduled', 'On-Demand']);
    await expect(page.getByText('Cody TestScheduledOn')).toBeVisible();
    await expect(page.getByText('Appointments scheduled').first()).toBeVisible({ timeout: 15000 });
    await adminDataReportingPage.clearAllFilters();

    await adminDataReportingPage.applyMultipleRequestTypes(['Scheduled', 'On-Demand']);
    await expect(page.getByText('Cody TestScheduledOn-Demand')).toBeVisible();
    await expect(page.getByText('Appointments scheduled').first()).toBeVisible({ timeout: 15000 });

    await adminDataReportingPage.removeFilterTag('On-Demand');
    await expect(page.getByText('Cody TestScheduled')).toBeVisible();
  });

  // flaky / data dependent
  test.skip('Total Calls/Encounters - Verify Detailed Report sorting @[115616] @admin @functional', async ({ page }) => {});

  // this workflow is so complecated will need to revert it to the previous version of the code w.o. trying to use POM
  test.skip('Verify Time Period calendar filter functionality @[115699] @admin @functional', async ({ page }) => {
    // total calls - test date range and calendar functionality
    await adminDataReportingPage.timePeriodFilter.click();
    await expect(adminDataReportingPage.popoverContent).toBeVisible();
    await expect(page.locator('.sc-TezEC')).toBeVisible();
    await expect(page.getByText('-Clear FilterApply Filter')).toBeVisible();
    await expect(page.getByText('This weekThis monthThis')).toBeVisible();

    // Test manual date range entry
    await adminDataReportingPage.applyDateRangeFilter('05/23/2025', '05/30/2025');
    await expect(page.getByText('Cody Test05/23/2025')).toBeVisible();

    // Test calendar navigation and date selection
    await adminDataReportingPage.applyCalendarDateSelection('Choose Thursday, May 22nd,');
    await expect(page.getByText('Cody Test05/22/2025')).toBeVisible();

    // Test clearing filter and disabled states
    await adminDataReportingPage.clearTimePeriodFilter();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();
    await adminDataReportingPage.timePeriodFilter.click();
    await expect(adminDataReportingPage.popoverContent.getByRole('button', { name: 'Clear Filter' })).toBeDisabled();
    await expect(adminDataReportingPage.popoverContent.getByRole('button', { name: 'Apply Filter' })).toBeDisabled();

    // total encounters - repeat same tests
    await adminDataReportingPage.navigateToTotalEncounters();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.timePeriodFilter.click();
    await expect(adminDataReportingPage.popoverContent).toBeVisible();
    await expect(page.locator('.sc-TezEC')).toBeVisible();
    await expect(page.getByText('-Clear FilterApply Filter')).toBeVisible();
    await expect(page.getByText('This weekThis monthThis')).toBeVisible();

    await adminDataReportingPage.applyDateRangeFilter('05/23/2025', '05/30/2025');
    await expect(page.getByText('Cody Test05/23/2025')).toBeVisible();

    await adminDataReportingPage.applyCalendarDateSelection('Choose Thursday, May 22nd,');
    await expect(page.getByText('Cody Test05/22/2025')).toBeVisible();

    await adminDataReportingPage.clearTimePeriodFilter();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();
    await adminDataReportingPage.timePeriodFilter.click();
    await expect(adminDataReportingPage.popoverContent.getByRole('button', { name: 'Clear Filter' })).toBeDisabled();
    await expect(adminDataReportingPage.popoverContent.getByRole('button', { name: 'Apply Filter' })).toBeDisabled();

    // total appointments - repeat same tests
    await adminDataReportingPage.navigateToTotalAppointments();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.timePeriodFilter.click();
    await expect(adminDataReportingPage.popoverContent).toBeVisible();
    await expect(page.locator('.sc-TezEC')).toBeVisible();
    await expect(page.getByText('-Clear FilterApply Filter')).toBeVisible();
    await expect(page.getByText('This weekThis monthThis')).toBeVisible();

    await adminDataReportingPage.applyDateRangeFilter('05/23/2025', '05/30/2025');
    await expect(page.getByText('Cody Test05/23/2025')).toBeVisible();

    await adminDataReportingPage.applyCalendarDateSelection('Choose Thursday, May 22nd,');
    await expect(page.getByText('Cody Test05/22/2025')).toBeVisible();

    await adminDataReportingPage.clearTimePeriodFilter();
    await expect(adminDataReportingPage.filterPanel.locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();
    await adminDataReportingPage.timePeriodFilter.click();
    await expect(adminDataReportingPage.popoverContent.getByRole('button', { name: 'Clear Filter' })).toBeDisabled();
    await expect(adminDataReportingPage.popoverContent.getByRole('button', { name: 'Apply Filter' })).toBeDisabled();
  });

  test('Verify Users filter functionality @[115700] @admin @functional', async ({ page }) => {
    // Test users filter in Total Calls report
    await adminDataReportingPage.applyReportingLevelFilter('Users');
    await expect(page.getByRole('link', { name: 'Users ChevronDown' })).toBeVisible();
    await adminDataReportingPage.applyUsersFilter('cody test provider Cody Test Institution');
    await expect(page.getByText('Cody TestUserscody test provider Cody Test Institution')).toBeVisible();

    // Test users filter in Total Encounters report
    await adminDataReportingPage.navigateToTotalEncounters();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyReportingLevelFilter('Users');
    await expect(page.getByText('Cody TestUsers')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Users ChevronDown' })).toBeVisible();
    await adminDataReportingPage.applyUsersFilter('cody test provider Cody Test Institution');
    await expect(page.getByText('Cody TestUserscody test provider Cody Test Institution')).toBeVisible();

    // Test users filter in Total Appointments report
    await adminDataReportingPage.navigateToTotalAppointments();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.applyReportingLevelFilter('Users');
    await expect(page.getByText('Cody TestUsers')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Users ChevronDown' })).toBeVisible();
    await adminDataReportingPage.applyUsersFilter('cody test provider Cody Test Institution');
    await expect(page.getByText('Cody TestUserscody test provider Cody Test Institution')).toBeVisible();
  });

  test('Verify Navigation to Total Encounters Report @[115701] @admin @ui', async ({ page }) => {
    // Navigate to Total Encounters report and verify tooltip
    await page.locator('a').filter({ hasText: 'Total Encounters' }).click();
    await page.getByRole('link', { name: 'AlertCircle' }).hover();
    await expect(
      page.getByText(
        "This report displays information about 'Encounters' where an 'Encounter' is defined as 2 or more people have joined a session. " +
          'This could apply to a scheduled appointment of type Video Call, Chat, or to an unscheduled meeting accessed via a link or meeting ID. ' +
          "The term 'Calls' refers to a session where 1 person has joined. Some Calls will also be Encounters (2 or more joined) and some will be only a Call (1 person joined, but no others did).",
        { exact: true }
      )
    ).toBeVisible();
  });

  test('Verify Navigation to Total Appointments Report @[115702] @admin @ui', async ({ page }) => {
    // Navigate to Total Appointments report and verify tooltip
    await page.locator('a').filter({ hasText: 'Total Appointments' }).click();
    await page.getByRole('link', { name: 'AlertCircle' }).hover();
    await expect(
      page.getByText(
        'This report displays information about scheduled appointments where an appointment can be of type Video Call or Chat. ' +
          "For each scheduled appointment, the report displays information about 'Encounters' where an 'Encounter' is defined as 2 or more people have joined an appointment, " +
          "and information about 'Calls' where a 'Call' is defined as 1 or more people have joined an appointment.",
        { exact: true }
      )
    ).toBeVisible();
  });

  test('Verify Legend Descriptions for Total Encounters Metrics @[115703] @admin @ui', async ({ page }) => {
    // Navigate to Total Encounters report
    await page.locator('a').filter({ hasText: 'Total Encounters' }).click();

    // Verify "Encounters Scheduled" legend tooltip
    await expect(page.getByText('Total Encounters').nth(1)).toBeVisible();
    await page.getByText('Encounters Scheduled').hover();
    await expect(
      page.getByText('This is a count of all Scheduled appointments for this reporting period group.', { exact: true })
    ).toBeVisible();

    // Verify "Encounters that Occurred" legend tooltip
    await page.getByText('Encounters that Occurred').hover();
    await expect(
      page.getByText(
        'This is a count of all Scheduled appointments where an Encounter occurred for this reporting period group (2 or more participants joined).',
        { exact: true }
      )
    ).toBeVisible();

    // Verify "Encounters that Did Not Occur" legend tooltip
    await page.getByText('Encounters that Did Not Occur').hover();
    await expect(
      page.getByText(
        'This is a count of all Scheduled appointments where an Encounter did not occur for this reporting period group (fewer than 2 participants joined).',
        { exact: true }
      )
    ).toBeVisible();

    // Verify "Calls Only" legend tooltip
    await page.getByText('Calls Only').hover();
    await expect(
      page.getByText(
        'This is a count of all Scheduled appointments where only a Call occurred for this reporting period group (1 participant joined).',
        { exact: true }
      )
    ).toBeVisible();
  });

  test('Verify Legend Descriptions for Total Appointments Metrics @[115704] @admin @ui', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Total Appointments' }).click();

    await expect(page.getByText('Total Appointments').nth(1)).toBeVisible();
    await page.getByText('Appointments Scheduled').hover();
    await expect(
      page.getByText('This is a count of all Scheduled appointments for this reporting period group.', { exact: true })
    ).toBeVisible();

    await page.getByText('Encounters that Occurred').hover();
    await expect(
      page.getByText(
        'This is a count of all appointments where an Encounter occurred for this reporting period group (2 or more participants joined).',
        { exact: true }
      )
    ).toBeVisible();

    await page.getByText('Encounters that Did Not Occur').hover();
    await expect(
      page.getByText(
        'This is a count of all appointments where an Encounter did not occur for this reporting period group (fewer than 2 participants joined).',
        { exact: true }
      )
    ).toBeVisible();

    await page.getByText('Calls occurred').hover();
    await expect(
      page.getByText(
        'This is a count of all appointments where a Call occurred for this reporting period group (1 or more participants).',
        { exact: true }
      )
    ).toBeVisible();

    await page.getByText('Calls did not occur').hover();
    await expect(
      page.getByText(
        'This is a count of all appointments where a Call did not occur for this reporting period group (0 participants joined).',
        { exact: true }
      )
    ).toBeVisible();
  });

  test('Verify UI and data in Dashboard @[115716] @admin @ui', async ({ page }) => {
    // Navigate to Dashboard and verify basic elements
    await page.locator('a').filter({ hasText: 'Dashboard' }).click();
    await page.getByText('Dashboard').nth(1).waitFor({ state: 'visible' });
    await expect(page.getByText('Dashboard').nth(1)).toBeVisible();

    // Verify dashboard tooltip information
    await page.getByRole('link', { name: 'AlertCircle' }).hover();
    await expect(
      page.getByText(
        "This dashboard provides an overview of your Institution including some values from other reports and some unique to this dashboard. It displays scheduled Encounter information where an 'Encounter' is defined as 2 or more people have joined a session.",
        { exact: true }
      )
    ).toBeVisible();

    // Verify Year to Date section elements
    await page.getByRole('heading', { name: 'Year to Date', exact: true }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Year to Date', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Encounters' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Average Length' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Participants' }).first()).toBeVisible();

    // Verify Month to Date section elements
    await expect(page.getByRole('heading', { name: 'Month to Date' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Encounters' }).nth(1)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Average Length' }).nth(1)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Participants' }).nth(1)).toBeVisible();

    // Verify Usage section elements
    await expect(page.getByRole('heading', { name: 'Usage', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Concurrent Usage' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Encounters per Month, Year to' })).toBeVisible();
  });

  test('Verify data and UI in Concurrent Usage @[115717] @admin @ui', async ({ page }) => {
    // Navigate to Concurrent Usage report and verify default filters
    await page.locator('a').filter({ hasText: 'Concurrent Usage' }).click();
    await expect(page.getByText('AllAllCody Test')).toBeVisible();

    // Test reporting level filter functionality
    await page.getByRole('link', { name: 'Reporting Level 1 ChevronDown' }).click();
    await page.getByTestId('item Providers').click();
    await page.getByRole('button', { name: 'Apply Filter' }).click();
    await expect(page.getByText('AllCody TestProviders')).toBeVisible();

    // Test clear filters functionality
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByTestId('filter-panel').locator('div').filter({ hasText: 'Cody Test' }).first()).toBeVisible();

    // Verify concurrent usage tooltip information
    await page.getByRole('link', { name: 'AlertCircle' }).hover();
    await expect(
      page.getByText(
        'This report displays the number of currently active Encounters (2 or more participants are on a call); it is updated every 1 minute.',
        { exact: true }
      )
    ).toBeVisible();
  });
});
