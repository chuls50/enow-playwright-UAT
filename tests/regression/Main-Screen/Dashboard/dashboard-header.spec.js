import { test, expect } from '@playwright/test';
import { DashboardPage as PatientDashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { DashboardPage as ProviderDashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Dashboard Header - Total tests 6 (including 1 skipped)

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let providerDashboardPage;

  test.beforeEach(async ({ page }) => {
    providerDashboardPage = new ProviderDashboardPage(page);
    await providerDashboardPage.gotoProviderDashboard();
  });

  test('Verify the Presence of the Top Navigation Bar for Providers @[112563] @provider @ui', async () => {
    // Verify navigation bar is visible
    await expect(providerDashboardPage.page.getByTestId('navigation')).toBeVisible();
  });

  test.skip('Verify Institution Dropdown Functionality @[112565] @provider @functional', async () => {
    // This test is skipped and will be implemented in the future
  });

  test('Verify Availability Toggle Functionality For Providers @[112566] @provider @functional', async () => {
    // Turn on availability toggle
    await providerDashboardPage.toggleAvailabilityOn();

    // Reopen panel and verify toggle is enabled
    await providerDashboardPage.openOnDemandPanel();
    await expect(providerDashboardPage.availabilitySwitch).toBeVisible();
    await expect(providerDashboardPage.availabilitySwitch).toBeChecked();
    await providerDashboardPage.closeOnDemandPanel();

    // Turn off availability toggle and verify it's disabled
    await providerDashboardPage.toggleAvailabilityOff();
    await expect(providerDashboardPage.availabilitySwitch).toBeVisible();
    await expect(providerDashboardPage.availabilitySwitch).not.toBeChecked();
  });

  test('Verify Notification Icon Functionality For Providers @[112567] @provider @functional', async () => {
    // Verify notification bell is visible
    await expect(providerDashboardPage.notificationBell).toBeVisible();

    // Open notification panel and verify all elements display
    await providerDashboardPage.openNotificationPanel();
    await expect(providerDashboardPage.notificationPopover).toBeVisible();
    await expect(providerDashboardPage.notificationsClearAllButton).toBeVisible();
    await expect(providerDashboardPage.notificationsXClose).toBeVisible();
  });
});

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));

  let patientDashboardPage;

  test.beforeEach(async ({ page }) => {
    patientDashboardPage = new PatientDashboardPage(page);
    await patientDashboardPage.gotoPatientDashboard();
  });

  test('Verify the Presence of the Top Navigation Bar for Patients @[112564] @patient @ui', async () => {
    // Verify navigation bar elements are visible
    await expect(patientDashboardPage.navbarInstitutionLogo).toBeVisible();
    await expect(patientDashboardPage.navbarDashboard).toBeVisible();

    // Open user profile menu and verify it displays
    await patientDashboardPage.openUserProfileMenu();
    await expect(patientDashboardPage.userProfileSection).toBeVisible();
  });

  test('Verify User Profile Menu Functionality @[112568] @patient @functional', async () => {
    // Open user profile menu
    await patientDashboardPage.openUserProfileMenu();

    // Verify all menu options are visible
    await expect(patientDashboardPage.userProfileSection).toBeVisible();
    await expect(patientDashboardPage.userProfileAccountSettings).toBeVisible();
    await expect(patientDashboardPage.userProfileHelp).toBeVisible();
    await expect(patientDashboardPage.userProfilePrivacyPolicy).toBeVisible();
    await expect(patientDashboardPage.userProfileLogout).toBeVisible();
  });
});
