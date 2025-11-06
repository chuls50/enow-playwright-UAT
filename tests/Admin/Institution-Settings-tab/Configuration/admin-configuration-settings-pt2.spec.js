import { test, expect } from '@playwright/test';
import { InstitutionSettingsConfigurationPage } from '../../../models/pages/admin/institution-settings-configuration.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Admin Configuration Settings pt2 - Total Tests 6 (including 4 skipped)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let configPage;

  test.beforeEach(async ({ page }) => {
    configPage = new InstitutionSettingsConfigurationPage(page);
    await configPage.gotoInstitutionSettingsConfiguration();
    await configPage.ensureWaitingRoomIsOn();
  });

  test('Verify presence and description of waiting room toggle @[117453] @admin @ui', async () => {
    // Verify waiting room toggle and description are visible
    await expect(configPage.waitingRoomOptionToggle).toBeVisible();
    await expect(configPage.waitingRoomOptionDescription).toBeVisible();
  });

  test('Verify "Save Changes" Button Enables When "Waiting Room Option" Toggle Is Modified @[117456] @admin @functional', async () => {
    // Toggle waiting room option off to trigger save button
    const isCurrentlyOn = await configPage.waitingRoomOptionToggle.isChecked();
    if (isCurrentlyOn) {
      await configPage.waitingRoomOptionToggle.click();
    }
    await expect(configPage.saveChangesButton).toBeEnabled();

    await configPage.page.waitForTimeout(1000);

    // Toggle back on to return to original state
    const isCurrentlyOff = await configPage.waitingRoomOptionToggle.isChecked();
    if (!isCurrentlyOff) {
      await configPage.waitingRoomOptionToggle.click();
    }
    await expect(configPage.saveChangesButton).toBeDisabled();
  });

  test('Verify "Insurance & Payments" Tab Unaffected @[117593] @admin @ui', async () => {
    // Verify insurance section is initially visible
    await expect(configPage.insurancePaymentsSection).toBeVisible();

    // Toggle waiting room option and save changes
    const isCurrentlyOn = await configPage.waitingRoomOptionToggle.isChecked();
    if (isCurrentlyOn) {
      await configPage.waitingRoomOptionToggle.click();
    }
    await configPage.saveChangesButton.click();
    await configPage.page.waitForLoadState('networkidle');

    // Verify insurance section remains visible after changes
    await expect(configPage.insurancePaymentsSection).toBeVisible();
  });
});

test.describe('Admin+Coordinator @regression', () => {
  let configPage;

  test.beforeEach(async ({ page }) => {
    configPage = new InstitutionSettingsConfigurationPage(page);
    await configPage.gotoInstitutionSettingsConfiguration();
    await configPage.ensureWaitingRoomIsOn();
  });

  test.skip('[Negative] Verify Waiting Rooms Do Not Reappear Without Saving Toggle Change @[117457] @multi-user @functional', async () => {});

  test.skip('Verify Coordinator View When "Waiting Room Option" Is Toggled ON @[117618] @multi-user @functional', async () => {});

  test.skip('Verify Coordinator View When "Waiting Room Option" Is Toggled OFF @[117619] @multi-user @functional', async () => {});
});
