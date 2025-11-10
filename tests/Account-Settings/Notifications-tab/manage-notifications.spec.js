import { test, expect } from '@playwright/test';
import { NotificationsPage } from '../../models/pages/provider/provider-notifications.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Total tests 11/12

test.describe('Manage Notifications @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let notificationsPage;

  test.beforeEach(async ({ page }) => {
    notificationsPage = new NotificationsPage(page);
    await notificationsPage.gotoNotificationsPage();
  });

  test('Verify navigation to "Notifications" screen @[111272] @provider @ui', async () => {
    // Wait for the title to be visible
    await notificationsPage.title.waitFor({ state: 'visible' });

    // Verify page elements
    await expect(notificationsPage.title).toBeVisible();
    await expect(notificationsPage.header).toBeVisible();
    await expect(notificationsPage.notificationMethods).toBeVisible();
    await expect(notificationsPage.emailNotification).toBeVisible();
    await expect(notificationsPage.emailNotificationSwitch).toBeVisible();
    await expect(notificationsPage.smsNotification).toBeVisible();
    await expect(notificationsPage.smsNotificationSwitch).toBeVisible();
    await expect(notificationsPage.pushNotification).toBeVisible();
    await expect(notificationsPage.pushNotificationSwitch).toBeVisible();
    await expect(notificationsPage.sessionReminder).toBeVisible();
    await expect(notificationsPage.sessionReminderText).toBeVisible();
    await expect(notificationsPage.remindMe).toBeVisible();
    await expect(notificationsPage.changeSessionReminder).toBeVisible();
  });

  test('Verify toggle behavior for Notification methods @[111273] @provider @functional', async () => {
    // capture the initial state
    const initialEmailState = await notificationsPage.emailNotificationSwitch.isChecked();
    const initialSmsState = await notificationsPage.smsNotificationSwitch.isChecked();
    const initialPushState = await notificationsPage.pushNotificationSwitch.isChecked();

    // click toggle
    await notificationsPage.emailNotificationSwitch.click();
    await notificationsPage.smsNotificationSwitch.click();
    await notificationsPage.pushNotificationSwitch.click();

    // verify final state is opposite of initial state
    await expect(notificationsPage.emailNotificationSwitch).toBeChecked({ checked: !initialEmailState });
    await expect(notificationsPage.smsNotificationSwitch).toBeChecked({ checked: !initialSmsState });
    await expect(notificationsPage.pushNotificationSwitch).toBeChecked({ checked: !initialPushState });

    // reset
    await notificationsPage.emailNotificationSwitch.click();
    await notificationsPage.smsNotificationSwitch.click();
    await notificationsPage.pushNotificationSwitch.click();
  });

  test('Verify navigation to set Session Reminders screen @[111274] @provider @ui', async () => {
    // Desktop Chrome test logic
    await notificationsPage.openSessionReminders();
    await expect(notificationsPage.sessionRemindersModal).toBeVisible();
    await expect(notificationsPage.sessionRemindersRemindMe).toBeVisible();
    await expect(notificationsPage.sessionRemindersDropdown).toBeVisible();
    await expect(notificationsPage.sessionRemindersCancelButton).toBeVisible();
    await expect(notificationsPage.sessionRemindersSaveButton).toBeVisible();
    await expect(notificationsPage.sessionRemindersXClose).toBeVisible();
  });

  test('Verify Remind Me dropdown behavior @[111275] @provider @functional', async ({ page }) => {
    // Desktop Chrome test logic
    await notificationsPage.openSessionReminders();
    await notificationsPage.page.getByTestId('custom-select-item-wrapper').click();
    await expect(page.getByTestId('custom-dropdown')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-15 minutes before').click();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });

  test('Verify Cancel button functionality on Session Reminders screen @[111276] @provider @functional', async () => {
    // Desktop Chrome test logic
    await notificationsPage.openSessionReminders();
    await notificationsPage.sessionRemindersCancelButton.click();
    await expect(notificationsPage.sessionRemindersModal).toBeHidden();
    await notificationsPage.openSessionReminders();
    await expect(notificationsPage.sessionRemindersDropdown).toBeVisible();
    await expect(notificationsPage.sessionRemindersDropdownOptions).toBeHidden();
  });

  test('Verify Save changes button with valid values @[111277] @provider @functional', async ({ page }) => {
    // Desktop Chrome test logic
    await notificationsPage.openSessionReminders();
    await notificationsPage.page.getByTestId('custom-select-item-wrapper').click();
    await notificationsPage.page.getByTestId('custom-dropdown-item-15 minutes before').click();
    await notificationsPage.page.getByRole('button', { name: 'Save changes' }).click();
    await expect(notificationsPage.page.getByText('SuccessNotification')).toBeVisible();
    await notificationsPage.page.getByRole('link', { name: 'Change' }).click();
    await notificationsPage.page.getByTestId('custom-select-item-wrapper').click();
    await notificationsPage.page.getByTestId('custom-dropdown-item-5 minutes before').click();
    await notificationsPage.page.getByRole('button', { name: 'Save changes' }).click();
  });

  test('Validate Session Reminder Settings @[111278] @provider @functional', async () => {
    await expect(notificationsPage.sessionReminder).toBeVisible();
    await expect(notificationsPage.sessionReminderText).toBeVisible();
    await expect(notificationsPage.remindMe).toBeVisible();
    await expect(notificationsPage.defaultReminder).toBeVisible();
    await expect(notificationsPage.changeSessionReminder).toBeVisible();
    await expect(notificationsPage.changeSessionReminder).toBeEnabled();
  });

  test('Verify invalid reminder value handling @[111279] @provider @functional', async () => {
    // Desktop Chrome test logic
    await notificationsPage.openSessionReminders();
    await notificationsPage.page.getByTestId('custom-select-item-wrapper').click();
    await notificationsPage.page.keyboard.type('invalid value');
    const dropdownOptions = await notificationsPage.sessionRemindersDropdownOptions.allTextContents();
    const isInvalidValuePresent = dropdownOptions.some((option) => option.includes('invalid value'));
    expect(isInvalidValuePresent).toBe(false);
    await expect(notificationsPage.sessionRemindersSaveButton).toBeDisabled();
  });

  test('Verify state persistence after page reload @[111280] @provider @functional', async () => {
    // capture the initial state
    const initialEmailState = await notificationsPage.emailNotificationSwitch.isChecked();

    // click toggle
    await notificationsPage.emailNotificationSwitch.click();
    await notificationsPage.page.waitForTimeout(500);

    // verify state persistence
    await notificationsPage.page.reload();
    await notificationsPage.waitForSpinnerToDisappear();
    await notificationsPage.emailNotificationSwitch.waitFor({ state: 'visible' });
    const postReloadEmailState = await notificationsPage.emailNotificationSwitch.isChecked();

    // Verify the state has changed
    expect(postReloadEmailState).toBe(!initialEmailState);

    // reset
    await notificationsPage.emailNotificationSwitch.click();
    await notificationsPage.page.waitForTimeout(1000);
  });

  test('Verify default reminder time display @[111281] @provider', async ({ page }) => {
    await notificationsPage.page.getByText('5 minutes before the session').waitFor({ state: 'visible' });
    await expect(notificationsPage.page.getByText('5 minutes before the session')).toBeVisible();
  });

  test('Verify Notification methods section consistency @[111282] @provider @ui', async () => {
    await notificationsPage.displayedEmail.waitFor({ state: 'visible' });
    await expect(notificationsPage.displayedEmail).toBeVisible();
  });

  test.skip('Verify SMS toggle behavior for missing phone number @[111283]', async () => {});
});
