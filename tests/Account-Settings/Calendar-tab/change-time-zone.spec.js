import { test, expect } from '@playwright/test';
import { CalendarSettingsPage } from '../../models/pages/provider/provider-calendar-settings.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Change Time Zone - Total tests 8

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let calendarSettingsPage;

  test.beforeEach(async ({ page }) => {
    calendarSettingsPage = new CalendarSettingsPage(page);
    await calendarSettingsPage.gotoCalendarSettingsPage();
  });

  test('Verify Content of Time zone sub-section @[115559] @provider @ui', async () => {
    // wait for Time zone section to be visible
    await calendarSettingsPage.accountSettingsHeader.waitFor({ state: 'visible' });

    // Verify all elements in Time zone section are visible
    await expect(calendarSettingsPage.timeZoneLabel).toBeVisible();
    await expect(calendarSettingsPage.timeZoneButton).toBeVisible();
  });

  test('Verify Content of Change time zone modal @[115563] @provider @ui', async () => {
    // Open change time zone modal
    await calendarSettingsPage.openChangeTimeZoneModal();

    // Verify all elements in Change time zone modal are visible
    await expect(calendarSettingsPage.timeZoneModalTitle).toBeVisible();
    await expect(calendarSettingsPage.timeZoneModalCloseButton).toBeVisible();
    await expect(calendarSettingsPage.automaticTimeZoneText).toBeVisible();
    await expect(calendarSettingsPage.timeZoneSaveChangesButton).toBeDisabled();
    await expect(calendarSettingsPage.timeZoneCancelButton).toBeVisible();
  });

  test('Verify initial state of Change time zone modal @[115565] @provider @ui', async () => {
    // Open change time zone modal
    await calendarSettingsPage.openChangeTimeZoneModal();

    // Verify initial states of elements in Change time zone modal
    await expect(calendarSettingsPage.timeZoneModalTitle).toBeVisible();
    await expect(calendarSettingsPage.timeZoneModalCloseButton).toBeVisible();
    await expect(calendarSettingsPage.modalTimeZone).toBeVisible();
    await expect(calendarSettingsPage.timeZoneSaveChangesButton).toBeDisabled();
    await expect(calendarSettingsPage.timeZoneCancelButton).toBeEnabled();
  });

  test('Verify Automatic Time Zone toggle functionality - toggle ON @[111240] @provider @functional', async ({ page }) => {
    // 3. Click on "Change Time Zone" link
    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.waitForTimeZoneModal();

    // 4. Wait for the toggle to be visible and check its state
    await calendarSettingsPage.automaticTimeZoneToggle.waitFor({ state: 'visible' });
    const isAutomaticOn = await calendarSettingsPage.isAutomaticToggleChecked();

    if (isAutomaticOn) {
      // If it's already ON, turn it OFF first
      await calendarSettingsPage.automaticTimeZoneText.click();
      await page.waitForTimeout(500);
      await expect(calendarSettingsPage.automaticTimeZoneToggle).not.toBeChecked();
      // Now turn it back ON for the actual test
      await calendarSettingsPage.automaticTimeZoneText.click();
      await page.waitForTimeout(500);
    } else {
      // If it's OFF, just turn it ON
      await calendarSettingsPage.automaticTimeZoneText.click();
      await page.waitForTimeout(500);
    }

    // 5. Wait for toggle state to update and verify it's ON
    await expect(calendarSettingsPage.automaticTimeZoneToggle).toBeChecked();

    // 6. Explicit verification instead of hidden method
    await expect(calendarSettingsPage.mountainStandardTime).toBeVisible();
    await expect(calendarSettingsPage.automaticTimeZoneToggle).toBeChecked();

    // 7. Verify Mountain Standard Time is displayed
    await expect(calendarSettingsPage.mountainStandardTime).toBeVisible();
  });

  test('Verify Automatic Time Zone toggle functionality - toggle OFF @[111241] @provider @functional', async ({ page }) => {
    // Click on "Change Time Zone" link
    await calendarSettingsPage.openChangeTimeZoneModal();

    // Check current state first
    const isAutomaticOn = await calendarSettingsPage.isAutomaticToggleChecked();

    if (!isAutomaticOn) {
      // If it's already OFF, turn it ON first so we can test turning it OFF
      await calendarSettingsPage.automaticTimeZoneText.click();
      await page.waitForTimeout(500);

      // Verify it's ON with explicit assertions
      await expect(calendarSettingsPage.mountainStandardTime).toBeVisible();
      await expect(calendarSettingsPage.automaticTimeZoneToggle).toBeChecked();
    }

    // Now toggle it OFF for the actual test
    await calendarSettingsPage.automaticTimeZoneText.click();
    await page.waitForTimeout(500);

    await expect(
      calendarSettingsPage.page
        .locator('div')
        .filter({ hasText: /\(GMT-07:00\) Mountain Standard Time - Phoenix/ })
        .first()
    ).toBeVisible();
    await expect(calendarSettingsPage.automaticTimeZoneToggle).not.toBeChecked();
  });

  test('Verify Time Zone Dropdown Functionality on Change Time Zone Modal @[111242] @provider @functional', async ({ page }) => {
    // 3. Click on "Change Time Zone" link
    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.waitForTimeZoneModal();

    // Ensure automatic timezone is OFF (toggle it off if it's currently on)
    const isAutomaticOn = await calendarSettingsPage.isAutomaticToggleChecked();
    if (isAutomaticOn) {
      await calendarSettingsPage.automaticTimeZoneText.click();
      // Wait for UI to update
      await page.waitForTimeout(500);
    }

    // 4. Verify dropdown is enabled and clickable
    const dropdown = calendarSettingsPage.timeZoneDropdown;
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toBeEnabled();
  });

  test('Verify Cancel Button Functionality on Change Time Zone Modal @[111243] @provider @functional', async ({}) => {
    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.waitForTimeZoneModal();

    // Store the initial state of the toggle
    const initialToggleState = await calendarSettingsPage.isAutomaticToggleChecked();

    // 4. Click the Cancel button with no changes made - direct click instead of wrapper
    await calendarSettingsPage.timeZoneCancelButton.click();

    // Explicit verification instead of hidden method
    await expect(calendarSettingsPage.timeZoneModalTitle).not.toBeVisible();
    await expect(calendarSettingsPage.timeZoneSuccessMessage).not.toBeVisible();

    // 5. Click on "Change Time Zone" link again and make changes
    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.waitForTimeZoneModal();

    // Toggle to the opposite state (make a change) - direct click instead of wrapper
    await calendarSettingsPage.automaticTimeZoneText.click();

    // Confirm the toggle is now in the opposite state
    if (initialToggleState) {
      await expect(calendarSettingsPage.automaticTimeZoneToggle).not.toBeChecked();
    } else {
      await expect(calendarSettingsPage.automaticTimeZoneToggle).toBeChecked();
    }

    // Click Cancel to discard changes - direct click instead of wrapper
    await calendarSettingsPage.timeZoneCancelButton.click();

    // 6. Verify that the changes are not saved
    await expect(calendarSettingsPage.timeZoneModalTitle).not.toBeVisible();
    await expect(calendarSettingsPage.timeZoneSuccessMessage).not.toBeVisible();

    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.waitForTimeZoneModal();

    // Verify the toggle reverted to its initial state
    if (initialToggleState) {
      await expect(calendarSettingsPage.automaticTimeZoneToggle).toBeChecked();
    } else {
      await expect(calendarSettingsPage.automaticTimeZoneToggle).not.toBeChecked();
    }
  });

  test('Verify Save Changes Button Functionality on Change Time Zone Modal @[111244] @provider @functional', async ({}) => {
    // Change timezone and click save - this will trigger our mock response
    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.automaticTimeZoneText.click();

    // Direct click instead of wrapper method
    await calendarSettingsPage.timeZoneSaveChangesButton.click();

    // // Verify the request was actually intercepted
    // expect(requestIntercepted).toBe(true);

    // Verify success message is shown
    await calendarSettingsPage.timeZoneSuccessMessage.waitFor({ state: 'visible' });
    await expect(calendarSettingsPage.timeZoneSuccessMessage).toBeVisible();

    // Change timezone and click save - this will trigger our mock response
    await calendarSettingsPage.openChangeTimeZoneModal();
    await calendarSettingsPage.automaticTimeZoneText.click();

    // Direct click instead of wrapper method
    await calendarSettingsPage.timeZoneSaveChangesButton.click();
  });
});
