import { test, expect } from '@playwright/test';
import { InstitutionSettingsServicesPage } from '../../../models/pages/admin/institution-settings-services.page.js';
import { DashboardPage } from '../../../models/pages/patient/patient-dashboard.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Admin User Managment pt 5 - Total tests 5

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));

  let institutionSettingsServicesPage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsServicesPage = new InstitutionSettingsServicesPage(page);
  });

  test('Verify "Allow Encounter now" Toggle is Displayed for Each Service @[115886] @admin @ui', async ({ page }) => {
    // Admin goto institution settings services page
    await institutionSettingsServicesPage.gotoServiceSettings();

    // Check how many services are listed by counting the number of times 'Service name*' appears
    const serviceCount = await page.getByText('Service name*').count();
    expect(serviceCount).toBeGreaterThan(0); // Ensure there is at least one service

    for (let i = 0; i < serviceCount; i++) {
      const toggle = page.getByText("Allow 'See a provider now'", { exact: true }).nth(i);
      await expect(toggle).toBeVisible();
    }
  });

  test('Verify Save Changes Button is Activated When "Allow Encounter now" Toggle is Modified @[115889] @admin @ui', async ({ page }) => {
    // Admin goto institution settings services page
    await institutionSettingsServicesPage.gotoServiceSettings();

    // verify save changes is disabled initially
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeDisabled();

    // toggle the first service's "Allow 'See a provider now'" switch
    await page.getByText("Allow 'See a provider now'").first().click();

    // verify save changes is enabled after toggle
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();
  });

  test('Verify Cancel Button Reverts Unsaved Changes to "Allow Encounter now" Toggle @[115890] @admin @functional', async ({ page }) => {
    // Admin goto institution settings services page
    await institutionSettingsServicesPage.gotoServiceSettings();

    // verify save changes is disabled initially
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeDisabled();

    // capture the initial state of the toggle
    const firstToggle = page.locator('[data-testid="switch-div"]').nth(1);
    const initialState = await firstToggle.isChecked();

    // toggle the first service's "Allow 'See a provider now'" switch
    await page.getByText("Allow 'See a provider now'").first().click();

    // verify save changes is enabled after toggle
    await expect(institutionSettingsServicesPage.saveChangesButton).toBeEnabled();

    // click cancel button
    await institutionSettingsServicesPage.cancelButton.click();

    // verify the toggle state has reverted to its initial state
    const revertedState = await firstToggle.isChecked();
    expect(revertedState).toBe(initialState);
  });
});

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));

  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    // Patient goto dashboard
    await dashboardPage.gotoPatientDashboard();

    await dashboardPage.seeProviderNow.click();
    await dashboardPage.page.waitForLoadState('networkidle');
    await dashboardPage.page.waitForTimeout(1000); // wait for 1 second to ensure page stability

    // Manual symptom checker
    // if continue is visible, then click it
    const continueButton = page.getByRole('button', { name: 'Continue' });
    if (await continueButton.isVisible()) {
      await continueButton.click();
    }

    // Infermetica symptom checker
    // if skip button is visible, then click it
    const skipButton = page.getByRole('button', { name: 'Skip' });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    // Click on Select service link
    await page.getByRole('link', { name: 'Select service' }).click();
  });

  test('Verify Services with Toggle ON Are Shown in "See a Provider Now" Flow @[115887] @patient @functional', async ({ page }) => {
    // Verify that services with the toggle ON are displayed
    const toggledOnService = page.locator('label').filter({ hasText: 'Toxicology' });
    await expect(toggledOnService).toBeVisible();
  });

  test('Verify Services with Toggle OFF Are Not Shown even if Previously Used @[115888] @patient @functional', async ({ page }) => {
    // Verify that services with the toggle OFF are not displayed
    const toggledOffService = page.locator('label').filter({ hasText: 'Pediatrics' });
    await expect(toggledOffService).not.toBeVisible();
  });
});
