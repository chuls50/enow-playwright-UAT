import { test, expect } from '@playwright/test';
import { InstitutionSettingsProfilePage } from '../../../../models/pages/admin/institution-settings-profile.page.js';
import { useRole, ROLES } from '../../../../utils/auth-helpers.js';

// Admin Institution Profile pt2 - Total tests 5
test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let institutionSettingsProfilePage;

  test.beforeEach(async ({ page }) => {
    institutionSettingsProfilePage = new InstitutionSettingsProfilePage(page);
    await institutionSettingsProfilePage.gotoInstitutionSettingsProfile();
  });

  test('Verify Device ID Access Link Is Displayed on Institution Profile Tab @[115012] @admin @ui', async () => {
    // Verify device ID access link elements are visible and enabled
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkText).toBeVisible();
    await expect(institutionSettingsProfilePage.deviceIDAccessLink).toBeEnabled();
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkCopyButton).toBeVisible();
  });

  test('Verify Copy Link button copies Device ID Access URL to Clipboard @[115013] @admin @functional', async ({ context }) => {
    // Grant clipboard permissions for copy functionality
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click copy button for device ID link
    await institutionSettingsProfilePage.page.waitForTimeout(1000);
    await expect(institutionSettingsProfilePage.deviceIDAccessLink).toBeVisible();
    await institutionSettingsProfilePage.deviceIDAccessLinkCopyButton.click();
    await institutionSettingsProfilePage.page.waitForTimeout(1000);
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkCopiedMessage).toBeVisible();

    // Verify correct device ID URL was copied to clipboard
    const clipboardContent = await institutionSettingsProfilePage.page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    expect(clipboardContent).toContain('https://xj9.sandbox-encounterservices.com/login/device');
  });

  test('Verify Link Format Includes Proper White-Label Subdomain @[115014] @admin @functional', async ({ context }) => {
    // Grant clipboard permissions for copy functionality
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Copy device ID link and verify success message
    await institutionSettingsProfilePage.page.waitForTimeout(1000);
    await expect(institutionSettingsProfilePage.deviceIDAccessLink).toBeVisible();
    await institutionSettingsProfilePage.deviceIDAccessLinkCopyButton.click();
    await institutionSettingsProfilePage.page.waitForTimeout(1000);
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkCopiedMessage).toBeVisible();

    // Verify clipboard contains proper white-label subdomain format
    const clipboardContent = await institutionSettingsProfilePage.page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    expect(clipboardContent).toContain('https://xj9.sandbox-encounterservices.com/login/device');
  });

  test('Verify User Feedback After Copy Link Action @[115015] @admin @ui', async ({ context }) => {
    // Grant clipboard permissions for copy functionality
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click copy button to trigger user feedback
    await institutionSettingsProfilePage.deviceIDAccessLinkCopyButton.click();

    // Verify success message appears with correct text
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkCopiedMessage).toBeVisible();
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkCopiedMessage).toHaveText('Link successfully copied');
  });

  test('Verify Device ID Access Link Is Displayed in the Same Format and Location as the Patient Registration Link @[115347] @admin @ui', async () => {
    // Verify device ID access link elements and format
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkText).toBeVisible();
    await expect(institutionSettingsProfilePage.deviceIDAccessLink).toHaveText('https://xj9.sandbox-encounterservices.com/login/device');
    await expect(institutionSettingsProfilePage.deviceIDAccessLinkCopyButton).toBeVisible();

    // Verify patient registration link elements and format for comparison
    await expect(institutionSettingsProfilePage.registrationLinkText).toBeVisible();
    await expect(institutionSettingsProfilePage.registrationLink).toHaveText(
      'https://xj9.sandbox-encounterservices.com/signup/INSFDJUBZOIFOQCIIAUWXPQ'
    );
    await expect(institutionSettingsProfilePage.registrationLinkCopyButton).toBeVisible();
  });
});
