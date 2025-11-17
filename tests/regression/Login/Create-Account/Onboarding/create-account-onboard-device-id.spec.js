import { test, expect } from '@playwright/test';
import { BasePage } from '../../../../models/base-page.js';
import { EndUserLicenseAgreementPage } from '../../../../models/pages/shared/end-user-license-agreement.page.js';
import { BeforeWeGetStartedPage } from '../../../../models/pages/shared/before-we-get-started.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Create Account Onboard Device ID - Total tests 8

// Test Data Constants
const TEST_DATA = {
  DEVICE_IDS: {
    DEVICE_1: '911272679',
  },
  DEVICE_USERS: {
    MIKU: 'Hatsune Mikuuuu',
  },
  URLS: {
    DEVICE_REDIRECT: 'https://api.encounterservices.com/redirect/kPEWFgwUQPqVxLkXxNryXyGEDyeAYEZR',
    PARTICIPANT_FORM: 'https://xj9.sandbox-encounterservices.com/first-login/participant-form',
  },
};

test.describe('Device_ID @regression', () => {
  test.use(useRole(ROLES.DEVICE_USER));
  let basePage;
  let eulaPage;
  let onboardingPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    eulaPage = new EndUserLicenseAgreementPage(page);
    onboardingPage = new BeforeWeGetStartedPage(page);
  });

  test('Verify First-Time Login Triggers EULA Screen for Device ID @[115317] @device @functional', async ({ page }) => {
    // Navigate to first login and verify EULA
    await eulaPage.navigateToEula();
    await page.waitForLoadState('networkidle');
    await expect(eulaPage.pageTitle).toBeVisible();
  });

  test('Verify EULA Acceptance is Captured in Selected Language @[115318] @device @functional', async ({ page }) => {
    // Navigate to first login and verify EULA
    await eulaPage.navigateToEula();
    await page.waitForLoadState('networkidle');

    // Accept EULA in default language (English)
    await eulaPage.acceptEula();
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');

    // Verify onboarding screen appears after acceptance
    await expect(page.getByText('Upcoming appointments').first()).toBeVisible();
  });

  test('Verify Onboarding Screen Displays Correct Fields for Device ID User @[115319] @device @ui', async ({ page }) => {
    // Navigate to participant form and verify fields using POM
    await onboardingPage.navigateToOnboarding();

    // Verify device ID specific elements
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.descriptionText).toBeVisible();
    await expect(onboardingPage.profileDetailsHeading).toBeVisible();
    await expect(onboardingPage.nameLabel).toBeVisible();
    await expect(onboardingPage.deviceIdLabel).toBeVisible();
    await expect(onboardingPage.timezoneHeading).toBeVisible();
    await expect(onboardingPage.changeTimezoneLink).toBeVisible();

    // verify patient-specific fields are not present
    await expect(page.getByText('First Name')).not.toBeVisible();
    await expect(page.getByText('Last Name')).not.toBeVisible();
    await expect(onboardingPage.dobLabel).not.toBeVisible();
  });

  test('Verify Name and Device ID Fields Are Pre-Filled from Admin Entry @[115320] @device @ui', async ({ page }) => {
    // Navigate to participant form and verify pre-filled fields using POM
    await onboardingPage.navigateToOnboarding();

    // Verify page elements
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.descriptionText).toBeVisible();
    await expect(onboardingPage.profileDetailsHeading).toBeVisible();
    await expect(onboardingPage.nameLabel).toBeVisible();
    await expect(onboardingPage.deviceIdLabel).toBeVisible();
    await expect(onboardingPage.timezoneHeading).toBeVisible();
    await expect(onboardingPage.changeTimezoneLink).toBeVisible();

    // Verify Name and Device ID fields are pre-filled
    await expect(onboardingPage.firstNameInput).toHaveValue(TEST_DATA.DEVICE_USERS.MIKU);
    await expect(onboardingPage.deviceIdInput).toHaveValue(TEST_DATA.DEVICE_IDS.DEVICE_1);
  });

  test('[Negative] Verify Error Message When Name Field Is Left Empty on Onboarding Screen @[115402] @device @functional', async ({}) => {
    // Navigate to participant form and verify validation using POM
    await onboardingPage.navigateToOnboarding();

    // Verify page elements
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.descriptionText).toBeVisible();
    await expect(onboardingPage.profileDetailsHeading).toBeVisible();
    await expect(onboardingPage.nameLabel).toBeVisible();
    await expect(onboardingPage.deviceIdLabel).toBeVisible();
    await expect(onboardingPage.timezoneHeading).toBeVisible();
    await expect(onboardingPage.changeTimezoneLink).toBeVisible();

    // Verify pre-filled values
    await expect(onboardingPage.firstNameInput).toHaveValue(TEST_DATA.DEVICE_USERS.MIKU);
    await expect(onboardingPage.deviceIdInput).toHaveValue(TEST_DATA.DEVICE_IDS.DEVICE_1);

    // Test name field validation using POM
    await onboardingPage.clearDeviceIdName();
    await expect(onboardingPage.nameRequiredError).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeDisabled();
  });

  test('[Negative] Verify Error Message When Device ID Field Is Left Empty on Onboarding Screen @[115403] @device @functional', async ({}) => {
    // Navigate to onboarding screen and verify fields using POM
    await onboardingPage.navigateToOnboarding();

    // Verify page elements using POM
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.descriptionText).toBeVisible();
    await expect(onboardingPage.profileDetailsHeading).toBeVisible();
    await expect(onboardingPage.nameLabel).toBeVisible();
    await expect(onboardingPage.deviceIdLabel).toBeVisible();
    await expect(onboardingPage.timezoneHeading).toBeVisible();
    await expect(onboardingPage.changeTimezoneLink).toBeVisible();

    // Verify Name and Device ID fields are pre-filled using POM
    await expect(onboardingPage.firstNameInput).toHaveValue(TEST_DATA.DEVICE_USERS.MIKU);
    await expect(onboardingPage.deviceIdInput).toHaveValue(TEST_DATA.DEVICE_IDS.DEVICE_1);

    // Verify Error Message when Device ID Field is left empty using POM
    await onboardingPage.clearDeviceId();
    await expect(onboardingPage.deviceIdRequiredError).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeDisabled();
  });

  test('Verify user is redirected to Device ID verification page from invitation link @[118453] @device @ui', async ({ page }) => {
    // Navigate to invitation link and verify device ID using base page method
    await page.goto(TEST_DATA.URLS.DEVICE_REDIRECT);

    // Perform device ID login using POM method
    await page.getByText('Device ID Access').waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
  });

  // declining the eula loggs you out - so this test is skipped
  test.skip('Verify EULA Decline button returns user to Device ID Access Page @[120219] @device @functional', async ({ page }) => {
    // Navigate to first login and verify EULA
    await eulaPage.navigateToEula();
    await page.waitForLoadState('networkidle');

    // Test cancel decline functionality
    await eulaPage.cancelDeclineEula();

    // Test actual decline functionality
    await eulaPage.declineEula();
    await page.waitForLoadState('networkidle');

    // Verify user is returned to Device ID Access Page
    await expect(page.getByRole('heading', { name: 'Device ID Access' })).toBeVisible();
  });
});
