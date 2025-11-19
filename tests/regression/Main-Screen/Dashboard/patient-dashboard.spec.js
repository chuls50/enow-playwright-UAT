import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Patient Dashboard - total tests 5/12

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let patientDashboardPage;

  test.beforeEach(async ({ page }) => {
    patientDashboardPage = new DashboardPage(page);
    await patientDashboardPage.gotoPatientDashboard();
  });

  test('Verify Content on Patient Dashboard @[111462] @patient @ui', async () => {
    // Verify UI Elements on Patient Dashboard
    await expect(patientDashboardPage.upcomingAppointments).toBeVisible();
    await expect(patientDashboardPage.pastAppointments).toBeVisible();
    await expect(patientDashboardPage.scheduleAppointment).toBeVisible();
    await expect(patientDashboardPage.seeProviderNow).toBeVisible();
  });

  test('Verify Schedule an Appointment button on Patient Dashboard @[111463] @patient @functional', async () => {
    // Click Schedule an Appointment
    await expect(patientDashboardPage.scheduleAppointment).toBeVisible();
    await patientDashboardPage.clickScheduleAppointment();

    // Verify URL
    await expect(patientDashboardPage.page).toHaveURL(/\/dashboard\/schedule-appointment/);
  });

  test('Verify See a Provider Now button on Patient Dashboard @[111464] @patient @functional', async () => {
    // Click See a Provider Now
    await expect(patientDashboardPage.seeProviderNow).toBeVisible();
    await patientDashboardPage.clickSeeProviderNow();

    // Verify URL
    await expect(patientDashboardPage.page).toHaveURL(/\/dashboard\/see-provider-now/);
  });

  test('Verify Navigation to Session Details Screen from Appointment Modules on Patient Dashboard @[111465] @patient @functional', async () => {
    // Verify clicking view details navigates to session details
    await expect(patientDashboardPage.pastAppointments).toBeVisible();

    // Click view details link
    await patientDashboardPage.pastAppointmentsViewDetailsLink.click();

    // Verify session details heading is visible
    await expect(patientDashboardPage.sessionDetailsHeading).toBeVisible();
  });

  test('Check Year Filter on Past Appointments Table on Patient Dashboard @[111469] @patient @functional', async () => {
    // Verify Year filter dropdown on Past Appointments
    await expect(patientDashboardPage.pastAppointments).toBeVisible();

    // Click year dropdown
    await patientDashboardPage.yearDropdownLink.click();

    // Verify items wrapper is visible
    await expect(patientDashboardPage.itemsWrapper).toBeVisible();
  });

  test('Verify Redirection to Manual Intake on Click of Schedule Appointment With Triage Disabled @[114044] @patient @functional', async () => {
    // Triage is always disabled on Cody Test Institution - UAT

    // Navigate to Schedule Appointment
    await patientDashboardPage.clickScheduleAppointment();

    // Verify Manual Intake Header (i.e 'My symptoms')
    await expect(patientDashboardPage.manualIntakeHeader).toBeVisible();
  });

  test('Verify Redirection to Manual Intake on Click of See a Provider Now With Triage Disabled @[114045] @patient @functional', async () => {
    // Triage is always disabled on Cody Test Institution - UAT

    // Navigate to See a Provider Now
    await patientDashboardPage.clickSeeProviderNow();

    // Verify Manual Intake Header (i.e 'My symptoms')
    await expect(patientDashboardPage.symptomCheckerHeading).toBeVisible();
  });

  test.skip('Verify Redirection to Symptom Checker When Scheduling Appointment Without Pending Triage @[114036] @patient @functional', async () => {});
});

test.describe('Multi-User @regression', () => {
  let basePage;

  test.beforeEach(async ({ page }) => {
    basePage = patientDashboardPage = new DashboardPage(page);
  });

  test.skip('Check Join Chat Session from Dashboard @[114035] @multi-user @functional', async () => {});

  test.skip('Verify Join Session Action on Confirmed Appointment on Patient Dashboard @[111466] @multi-user @functional', async () => {});

  test.skip('Verify Appointment Confirmation via “Check” Button on Patient Dashboard @[111467] @multi-user @functional', async () => {});

  test.skip('Verify Appointment Cancellation via "Cancel session" Button on Patient Dashboard @[111468] @multi-user @functional', async () => {});

  // removed
  test.skip('Verify Triage Popup and Routing Options on Click of Schedule Appointment With Pending Triage @[114042] @patient @functional', async () => {});

  // removed
  test.skip('Check Triage Popup and Routing Options on Click of See a Provider Now With Pending Triage @[114043] @patient @functional', async () => {});
});
