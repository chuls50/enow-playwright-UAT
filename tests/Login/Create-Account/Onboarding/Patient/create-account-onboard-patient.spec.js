import { test, expect } from '@playwright/test';
import { BasePage } from '../../../../models/base-page.js';
import { EndUserLicenseAgreementPage } from '../../../../models/pages/shared/end-user-license-agreement.page.js';
import { BeforeWeGetStartedPage } from '../../../../models/pages/shared/before-we-get-started.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Create Account Onboard Patient - Total tests 6

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let basePage;
  let eulaPage;
  let onboardingPage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    eulaPage = new EndUserLicenseAgreementPage(page);
    onboardingPage = new BeforeWeGetStartedPage(page);
  });

  test('Verify Accept Button on User License Agreement @[111190] @patient @functional', async ({ page }) => {
    // navigate to EULA page
    await eulaPage.navigateToEula();

    // verify EULA page is visible
    await expect(eulaPage.pageTitle).toBeVisible();

    // accept EULA
    await eulaPage.acceptEula();

    // verify redirect to /dashboard
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  // Skip license test for patients - this functionality is provider-specific
  test.skip('Verify License Button with Country and State Inputs for Providers @[111187] @provider @functional', async ({ page }) => {
    // This test is not applicable to patients as they don't have license management functionality
  });

  test('Verify Content on Before we get started Page @[111192] @patient @ui', async ({ page }) => {
    // navigate to onboarding page
    await onboardingPage.navigateToOnboarding();

    // Verify page elements using POM
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.firstNameLabel).toBeVisible();
    await expect(onboardingPage.lastNameLabel).toBeVisible();
    await expect(onboardingPage.dobLabel).toBeVisible();
    await expect(onboardingPage.dobInput).toBeVisible();
    await expect(onboardingPage.sexAssignedAtBirthLabel).toBeVisible();
    await expect(onboardingPage.timezoneHeading).toBeVisible();
    await expect(onboardingPage.changeTimezoneLink).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeVisible();
  });

  // mailanator account
  test.skip('Verify Successful User Invitation Flow @[111777] @multi-user @functional', async ({ page }) => {});

  // decline EULA will log us out so we need to run it last
  test.skip('Verify Decline Button User License Agreement Modal @[111186] @patient @functional', async ({ page }) => {
    // navigate to EULA page
    await eulaPage.navigateToEula();

    // decline EULA
    await eulaPage.declineEula();

    // verify redirect to login page
    await page.getByRole('heading', { name: 'Login' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});
