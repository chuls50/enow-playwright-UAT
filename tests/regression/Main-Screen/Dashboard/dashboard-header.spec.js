import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';
import { DashboardPage as PatientDashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { DashboardPage as ProviderDashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';

// Dashboard Header - Total tests 6 (including 1 skipped)

test.describe('Multi-user @regression', () => {
  let basePage;
  let patientDashboardPage;
  let providerDashboardPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    providerDashboardPage = new ProviderDashboardPage(page);
    patientDashboardPage = new PatientDashboardPage(page);
  });

  test('Verify the Presence of the Top Navigation Bar for Providers @[112563] @provider @ui', async () => {
    // Login as provider and navigate to dashboard
    await basePage.performUATProviderLogin();
    await providerDashboardPage.gotoProviderDashboard();

    // Verify navigation bar is visible
    await expect(providerDashboardPage.page.getByTestId('navigation')).toBeVisible();
  });

  test('Verify the Presence of the Top Navigation Bar for Patients @[112564] @patient @ui', async ({ page, browser }) => {
    // Login as patient and navigate to dashboard
    await basePage.performUATPatientLogin();
    await patientDashboardPage.gotoPatientDashboard();

    // Verify navigation bar elements are visible
    await expect(patientDashboardPage.navbarInstitutionLogo).toBeVisible();
    await expect(patientDashboardPage.navbarDashboard).toBeVisible();

    // Open user profile menu and verify it displays
    await patientDashboardPage.openUserProfileMenu();
    await expect(patientDashboardPage.userProfileSection).toBeVisible();
  });

  test.skip('Verify Institution Dropdown Functionality @[112565] @provider @multi-institution', async () => {
    // This test is skipped and will be implemented in the future
  });

  test('Verify Availability Toggle Functionality For Providers @[112566] @provider @functional', async () => {
    // Login as provider and navigate to dashboard
    await basePage.performUATProviderLogin();
    await providerDashboardPage.gotoProviderDashboard();

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
    // Login as provider and navigate to dashboard
    await basePage.performUATProviderLogin();
    await providerDashboardPage.gotoProviderDashboard();

    // Verify notification bell is visible
    await expect(providerDashboardPage.notificationBell).toBeVisible();

    // Open notification panel and verify all elements display
    await providerDashboardPage.openNotificationPanel();
    await expect(providerDashboardPage.notificationPopover).toBeVisible();
    await expect(providerDashboardPage.notificationsClearAllButton).toBeVisible();
    await expect(providerDashboardPage.notificationsXClose).toBeVisible();
  });

  test('Verify User Profile Menu Functionality @[112568] @patient @functional', async ({ page, browser }) => {
    // Login as patient and navigate to dashboard
    await basePage.performUATPatientLogin();
    await patientDashboardPage.gotoPatientDashboard();

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
