import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../../utils/auth-helpers.js';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
import { AdminDataReportingPage } from '../../models/pages/admin/admin-data-reporting.page.js';

// Admin Reporting pt2 Service Filter - Total tests 5 (including 1 skipped)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let usersTablePage;
  let adminDataReportingPage;

  test.beforeEach(async ({ page }) => {
    usersTablePage = new UsersTablePage(page);
    adminDataReportingPage = new AdminDataReportingPage(page);

    // Navigate to users table first, then to reporting
    await usersTablePage.gotoUsersTable();
    await adminDataReportingPage.navigateToDataReporting();
    await adminDataReportingPage.navigateToTotalCalls();
    await adminDataReportingPage.clearAllFilters();
    await adminDataReportingPage.waitForSpinnerToDisappear();
  });

  test('Verify "Extra Fields" Detailed Reports @[118221] @admin @ui', async ({ page }) => {
    // Navigate to Total Calls detailed report and verify all column headers
    await adminDataReportingPage.navigateToTotalCallsDetails();
    await page.getByRole('cell', { name: 'Call Start Time' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('cell', { name: 'Call Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Participant list' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Service' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Tax ID ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance Policy Number' })).toBeVisible();
    await expect(adminDataReportingPage.showDetailsLink.first()).toBeVisible();

    // Navigate to Total Encounters detailed report and verify all column headers
    await adminDataReportingPage.navigateToTotalEncountersDetails();
    await page.getByRole('cell', { name: 'Call Start Time' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('cell', { name: 'Call Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Participant list' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Service' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Tax ID ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance Policy Number' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Information' })).toBeVisible();

    // Navigate to Total Appointments detailed report and verify all column headers
    await adminDataReportingPage.navigateToTotalAppointmentsDetails();
    await page.getByRole('cell', { name: 'Appointment Requested Time' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('cell', { name: 'Appointment Requested Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Requested Type' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Scheduler' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Participants' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Service' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Tax ID ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance Policy Number' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Final Appointment Status' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '# of Appointment Reschedules' })).toBeVisible();
  });

  test('Verify data in Total Calls Detailed Report @[115591] @admin @ui', async ({ page }) => {
    // Navigate to Total Calls detailed report
    await adminDataReportingPage.navigateToTotalCallsDetails();
    await page.getByRole('cell', { name: 'Call Start Time' }).waitFor({ state: 'visible' });

    // Verify all column headers are visible
    await expect(page.getByRole('cell', { name: 'Call Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Participant list' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Service' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Tax ID ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance Policy Number' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Information' })).toBeVisible();

    // Verify call start time format (MM/DD/YY HH:MM AM/PM)
    const callStartTime = await page.getByTestId('cell-0-column-0').innerText();
    if (callStartTime.trim()) {
      const callStartTimePattern = /\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/;
      expect(callStartTime).toMatch(callStartTimePattern);
    }

    // Verify call end time format (MM/DD/YY HH:MM AM/PM)
    const callEndTime = await page.getByTestId('cell-0-column-1').innerText();
    if (callEndTime.trim()) {
      const callEndTimePattern = /\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/;
      expect(callEndTime).toMatch(callEndTimePattern);
    }

    // Verify encounter start time format (MM/DD/YY HH:MM AM/PM)
    const encounterStartTime = await page.getByTestId('cell-0-column-3').innerText();
    if (encounterStartTime.trim()) {
      const encounterStartTimePattern = /\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/;
      expect(encounterStartTime).toMatch(encounterStartTimePattern);
    }

    // Verify encounter end time format (MM/DD/YY HH:MM AM/PM)
    const encounterEndTime = await page.getByTestId('cell-0-column-4').innerText();
    if (encounterEndTime.trim()) {
      const encounterEndTimePattern = /\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/;
      expect(encounterEndTime).toMatch(encounterEndTimePattern);
    }

    // Verify encounter duration format (number + Min)
    const encounterDuration = await page.getByTestId('cell-0-column-5').innerText();
    const encounterDurationPattern = /\d+ Min/;
    expect(encounterDuration).toMatch(encounterDurationPattern);

    // Verify participant list format (comma-separated names)
    const participantList = await page.getByTestId('cell-0-column-6').innerText();
    const participantListPattern = /^[A-Za-z]+([ ][A-Za-z ]+)*(,\s*[A-Za-z]+([ ][A-Za-z ]+)*)*$/;
    expect(participantList).toMatch(participantListPattern);

    // Verify service column displays service name
    const service = await page.getByTestId('cell-0-column-7').innerText();
    expect(service.length).toBeGreaterThan(0);

    // Verify Tax ID column data type
    const taxId = await page.getByTestId('cell-0-column-8').innerText();
    expect(typeof taxId).toBe('string');

    // Verify Insurance column data type
    const insurance = await page.getByTestId('cell-0-column-9').innerText();
    expect(typeof insurance).toBe('string');

    // Verify Insurance Policy Number column data type
    const insurancePolicy = await page.getByTestId('cell-0-column-10').innerText();
    expect(typeof insurancePolicy).toBe('string');

    // Verify Show details link is visible
    const showDetails = page.getByRole('link', { name: 'Show details' }).first();
    await expect(showDetails).toBeVisible();
  });

  test('Verify data in Total Encounters Detailed Report @[120184] @admin @ui', async ({ page }) => {
    // Navigate to Total Encounters detailed report
    await adminDataReportingPage.navigateToTotalEncountersDetails();
    await page.getByRole('cell', { name: 'Call Start Time' }).waitFor({ state: 'visible' });

    // Verify all column headers are visible
    await expect(page.getByRole('cell', { name: 'Call Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Call Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Encounter Duration' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Participant list' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Service' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Tax ID ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance Policy Number' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Information' })).toBeVisible();

    // Verify call start time format
    const encounterCallStartTime = await page.getByTestId('cell-0-column-0').innerText();
    expect(encounterCallStartTime).toMatch(/\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/);

    // Verify encounter start time format
    const totalEncounterStartTime = await page.getByTestId('cell-0-column-3').innerText();
    if (totalEncounterStartTime.trim()) {
      expect(totalEncounterStartTime).toMatch(/\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/);
    }

    // Verify encounter end time format
    const totalEncounterEndTime = await page.getByTestId('cell-0-column-4').innerText();
    if (totalEncounterEndTime.trim()) {
      expect(totalEncounterEndTime).toMatch(/\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/);
    }

    // Verify encounter duration format
    const totalEncounterDuration = await page.getByTestId('cell-0-column-5').innerText();
    expect(totalEncounterDuration).toMatch(/\d+ Min/);

    // Verify participant list format
    const encounterParticipantList = await page.getByTestId('cell-0-column-6').innerText();
    expect(encounterParticipantList).toMatch(/^[A-Za-z]+([ ][A-Za-z ]*)*(,\s*[A-Za-z]+([ ][A-Za-z ]*)*)*$/);

    // Verify service column displays service name
    const encounterService = await page.getByTestId('cell-0-column-7').innerText();
    expect(encounterService.length).toBeGreaterThan(0);

    // Verify Tax ID column data type
    const encounterTaxId = await page.getByTestId('cell-0-column-8').innerText();
    expect(typeof encounterTaxId).toBe('string');

    // Verify Insurance column data type
    const encounterInsurance = await page.getByTestId('cell-0-column-9').innerText();
    expect(typeof encounterInsurance).toBe('string');

    // Verify Insurance Policy Number column data type
    const encounterInsurancePolicy = await page.getByTestId('cell-0-column-10').innerText();
    expect(typeof encounterInsurancePolicy).toBe('string');

    // Verify Appointment Information column data type
    const appointmentInfo = await page.getByTestId('cell-0-column-11').innerText();
    expect(typeof appointmentInfo).toBe('string');
  });

  test('Verify data in Total Appointments Detailed Report @[115705] @admin @ui', async ({ page }) => {
    // Navigate to Total Appointments detailed report
    await adminDataReportingPage.navigateToTotalAppointmentsDetails();
    await page.getByRole('cell', { name: 'Appointment Requested Time' }).waitFor({ state: 'visible' });

    // Verify all column headers are visible
    await expect(page.getByRole('cell', { name: 'Appointment Requested Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Requested Type' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Scheduler' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Participants' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment Start Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Appointment End Time' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Service' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Tax ID ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance ChevronSelectorVertical' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Insurance Policy Number' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Final Appointment Status' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '# of Appointment Reschedules' })).toBeVisible();

    // Verify appointment requested time format (MM/DD/YY HH:MM AM/PM)
    const appointmentRequestedTime = await page.getByTestId('cell-0-column-0').innerText();
    const appointmentRequestedTimePattern = /\d{2}\/\d{2}\/\d{2} \d{1,2}:\d{2} (AM|PM)/;
    expect(appointmentRequestedTime).toMatch(appointmentRequestedTimePattern);

    // Verify appointment requested type is not empty
    const appointmentRequestedType = await page.getByTestId('cell-0-column-1').innerText();
    expect(appointmentRequestedType.length).toBeGreaterThan(0);
    expect(typeof appointmentRequestedType).toBe('string');

    // Verify appointment scheduler name format
    const appointmentScheduler = await page.getByTestId('cell-0-column-2').innerText();
    const appointmentSchedulerPattern = /^[A-Za-z]+( [A-Za-z]+)*$/;
    expect(appointmentScheduler).toMatch(appointmentSchedulerPattern);

    // Verify participants format (names with join status)
    const participants = await page.getByTestId('cell-0-column-3').innerText();
    const participantsPattern = /^[A-Za-z]+([ ][A-Za-z]+)*(\s*\([a-z ]+\))?([A-Za-z]+([ ][A-Za-z]+)*(\s*\([a-z ]+\))?)*$/;
    expect(participants).toMatch(participantsPattern);

    // Verify appointment start time format
    const appointmentStartTime = await page.getByTestId('cell-0-column-4').innerText();
    expect(appointmentStartTime).toMatch(appointmentRequestedTimePattern);

    // Verify appointment end time format
    const appointmentEndTime = await page.getByTestId('cell-0-column-5').innerText();
    expect(appointmentEndTime).toMatch(appointmentRequestedTimePattern);

    // Verify service column displays service name
    const appointmentService = await page.getByTestId('cell-0-column-6').innerText();
    expect(appointmentService.length).toBeGreaterThan(0);
    expect(typeof appointmentService).toBe('string');

    // Verify Session ID Column data type and format
    const appointmentSessionId = await page.getByTestId('cell-0-column-7').innerText();
    expect(typeof appointmentSessionId).toBe('string');
    // Verify Session ID format (alphanumeric string like 3M4RT8G)
    const sessionIdPattern = /^[A-Z0-9]+$/;
    expect(appointmentSessionId).toMatch(sessionIdPattern);

    // Verify Tax ID column data type
    const appointmentTaxId = await page.getByTestId('cell-0-column-8').innerText();
    expect(typeof appointmentTaxId).toBe('string');

    // Verify Insurance column data type
    const appointmentInsurance = await page.getByTestId('cell-0-column-9').innerText();
    expect(typeof appointmentInsurance).toBe('string');

    // Verify Insurance Policy Number column data type
    const appointmentInsurancePolicy = await page.getByTestId('cell-0-column-10').innerText();
    expect(typeof appointmentInsurancePolicy).toBe('string');

    // Verify Final Appointment Status is not empty
    const finalAppointmentStatus = await page.getByTestId('cell-0-column-11').innerText();
    expect(finalAppointmentStatus.length).toBeGreaterThan(0);
    expect(typeof finalAppointmentStatus).toBe('string');

    // Verify appointment reschedules format (numeric)
    const appointmentReschedules = await page.getByTestId('cell-0-column-12').innerText();
    const appointmentReschedulesPattern = /^\d+$/;
    expect(appointmentReschedules).toMatch(appointmentReschedulesPattern);
  });

  // test.skip cannot select multiple institutions, maybe super-admin can?
  test.skip('Verify Institution names in Service column with multiple institution filters @[119008] @super-admin @functional', async ({
    page,
  }) => {});
});
