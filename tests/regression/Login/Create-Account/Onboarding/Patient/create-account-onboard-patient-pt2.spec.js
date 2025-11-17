import { test, expect } from '@playwright/test';
import { EndUserLicenseAgreementPage } from '../../../../../models/pages/shared/end-user-license-agreement.page.js';
import { BeforeWeGetStartedPage } from '../../../../../models/pages/shared/before-we-get-started.page.js';
import { ROLES, useRole } from '../../../../../utils/auth-helpers.js';

// Create Account Onboard Patient - Total tests 1

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let eulaPage;
  let onboardingPage;

  test.beforeEach(async ({ page }) => {
    eulaPage = new EndUserLicenseAgreementPage(page);
    onboardingPage = new BeforeWeGetStartedPage(page);
  });

  test('Verify Additional Content on "Before we get started" Page @[118057] @patient @ui', async ({ page }) => {
    // navigate to onboarding page
    await onboardingPage.navigateToOnboarding();

    // Verify insurance information section using POM
    await expect(onboardingPage.insuranceInfoHeading).toBeVisible();
    await expect(onboardingPage.taxIdLabel).toBeVisible();
    await expect(onboardingPage.insurancePolicyNumberLabel).toBeVisible();
    await expect(onboardingPage.insuranceLabel).toBeVisible();
    await expect(onboardingPage.taxIdInput).toBeVisible();
    await expect(onboardingPage.insurancePolicyNumberInput).toBeVisible();
    await expect(onboardingPage.insuranceInput).toBeVisible();
  });
});
