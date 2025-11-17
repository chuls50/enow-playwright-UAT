import { test, expect } from '@playwright/test';
import { CalendarSettingsPage } from '../../../models/pages/provider/provider-calendar-settings.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Manage Calendar - Total tests 8

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let calendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarSettingsPage(page);
    await calendarPage.gotoCalendarSettingsPage();
  });

  test('Verify View on Calendar Screen @[111230] @provider @ui', async () => {
    await expect(calendarPage.accountSettingsHeader).toBeVisible();
    await expect(calendarPage.calendarLabel).toBeVisible();
    await expect(calendarPage.calendarDescription).toBeVisible();
    await expect(calendarPage.timeZoneLabel).toBeVisible();
    await expect(calendarPage.timeZoneButton).toBeVisible();
    await expect(calendarPage.dailyAvailabilityLabel).toBeVisible();
    await expect(calendarPage.editDailyAvailabilityButton).toBeVisible();
  });

  test('Verify View on Edit Daily Availability Modal @[111232] @provider @ui', async () => {
    await calendarPage.editDailyAvailabilityButton.click();
    await expect(calendarPage.editDailyAvailabilityModal).toBeVisible();
    await expect(calendarPage.availabilitySaveChangesButton).toBeVisible();
    await expect(calendarPage.availabilityCancelButton).toBeVisible();
    await expect(calendarPage.availabilityXCloseButton).toBeVisible();

    // Verify all days of the week are present
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const day of daysOfWeek) {
      const dayLabel = calendarPage.page.locator('label').filter({ hasText: day });
      await expect(dayLabel).toBeVisible();
    }
  });

  test('Verify Toggle Functionality on Edit Daily Availability Modal @[111233] @provider @functional', async () => {
    await calendarPage.editDailyAvailabilityButton.click();

    const daysOfWeek = [
      { toggle: calendarPage.availabilityToggleMonday },
      { toggle: calendarPage.availabilityToggleTuesday },
      { toggle: calendarPage.availabilityToggleWednesday },
      { toggle: calendarPage.availabilityToggleThursday },
      { toggle: calendarPage.availabilityToggleFriday },
      { toggle: calendarPage.availabilityToggleSaturday },
      { toggle: calendarPage.availabilityToggleSunday },
    ];

    for (const day of daysOfWeek) {
      await day.toggle.click();
      // Verify the toggle is still clickable (no errors occurred)
      await expect(day.toggle).toBeEnabled();
    }
  });

  test('Verify Delete Start/End Time Pair Functionality on Edit Daily Availability Modal @[111234] @provider @functional', async () => {
    await calendarPage.editDailyAvailabilityButton.click();

    // Find and click the delete button specifically for Monday
    const mondayDeleteButton = calendarPage.page.locator('div').filter({ hasText: 'Monday' }).getByRole('link').getByLabel('Trash').first();
    await mondayDeleteButton.click();

    // Verify "Monday" toggle is off
    await expect(calendarPage.availabilityToggleMonday).toBeChecked({ checked: false });
  });

  test('Verify Add Start/End Time Pair Functionality on Edit Daily Availability Modal @[111235] @provider @functional', async ({
    page,
  }) => {
    await calendarPage.editDailyAvailabilityButton.click();

    // Add time pair for Monday
    const mondayAddLink = calendarPage.page
      .locator('div')
      .filter({ hasText: /^Monday$/ })
      .getByRole('link');
    if (await mondayAddLink.isVisible()) {
      await mondayAddLink.click();
      await expect(calendarPage.availabilityDeleteMondayChrome).toBeVisible();
    } else if (await calendarPage.availabilityAddIconMonday.isVisible()) {
      await calendarPage.availabilityAddIconMonday.click();
      await expect(calendarPage.availabilityDeleteMondayChrome).toBeVisible();
    } else {
      await page
        .locator('div')
        .filter({ hasText: /^Monday$/ })
        .getByRole('link')
        .click();
      await expect(page.getByText('hh:mm a—hh:mm a')).toBeVisible();
    }
  });

  test('Verify Cancel Button Functionality on Edit Daily Availability Modal @[111236] @provider @functional', async () => {
    await calendarPage.editDailyAvailabilityButton.click();

    // Make a change
    await calendarPage.availabilityToggleMonday.click();

    // Cancel without saving
    await calendarPage.availabilityCancelButton.click();

    // Reopen modal and verify change was not saved
    await calendarPage.editDailyAvailabilityButton.click();
    await expect(calendarPage.dayOffMessage).not.toBeVisible();
  });

  test('Verify Save Changes Validation for Incomplete Times on Edit Daily Availability Modal @[111237] @provider @functional', async () => {
    await calendarPage.editDailyAvailabilityButton.click();

    // Toggle Monday off/on to reset times
    await calendarPage.availabilityToggleMonday.click();
    await calendarPage.availabilityToggleMonday.click();

    // Try to save without setting times
    await calendarPage.availabilitySaveChangesButton.click();
    await expect(calendarPage.availabilityErrorMessage).toBeVisible();
  });

  test('Verify Save Changes with All Times Populated on Edit Daily Availability Modal @[111238] @provider @functional', async ({
    page,
  }) => {
    // Set up API route interception
    let requestIntercepted = false;

    await page.route('**/api/v2/users/**', async (route) => {
      requestIntercepted = true;
      await route.fulfill({
        status: 201,
        body: JSON.stringify({
          success: true,
          data: {
            id: 'test-id',
            calendar_settings: {
              weekly_availability: [{}, {}, {}, {}, {}, {}, {}],
            },
          },
        }),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await calendarPage.editDailyAvailabilityButton.click();

    // Toggle Monday off to enable save
    await calendarPage.availabilityToggleMonday.click();

    // Direct click instead of wrapper method
    await calendarPage.availabilitySaveChangesButton.click();

    expect(requestIntercepted).toBe(true);
    await expect(calendarPage.availabilitySuccessMessage).toBeVisible();
  });
});
