import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../../../models/pages/patient/patient-my-account.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Patient My Account pt2 - Total Tests 1

test.describe('Patient My Account - Pt2 @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let patientMyAccountPage;

  test.beforeEach(async ({ page }) => {
    patientMyAccountPage = new MyAccountPage(page);
    await patientMyAccountPage.gotoAccountSettings();
  });

  test('Verify Patient View Additional Fields and Content Display on Account Settings Page @[118042] @patient @ui', async ({ page }) => {
    await expect(patientMyAccountPage.taxIdText).toBeVisible();
    await expect(patientMyAccountPage.insuranceText).toBeVisible();
    await expect(patientMyAccountPage.insurancePolicyNumberText).toBeVisible();
  });
});
