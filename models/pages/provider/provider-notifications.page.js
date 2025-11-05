import { BasePage } from '../../base-page.js';

export class NotificationsPage extends BasePage {
  constructor(page) {
    super(page);

    // Main page elements
    this.title = page.locator('div').filter({ hasText: /^Account settings$/ });
    this.navbar = page.getByRole('navigation');
    this.header = page.getByRole('paragraph').filter({ hasText: 'Notifications' });
    this.headerText = page.getByText('Manage your notification');
    this.notificationMethods = page.getByText('Notification methods');
    this.emailNotification = page.getByText('Email');
    this.emailNotificationSwitch = page.getByTestId('switch-div').first();
    this.smsNotification = page.getByText('SMS');
    this.smsNotificationSwitch = page.getByTestId('switch-div').nth(1);
    this.pushNotification = page.getByText('In-app');
    this.pushNotificationSwitch = page.getByTestId('switch-div').nth(2);
    this.displayedEmail = page.getByText('chuls+providerprod@globalmed.com');
    this.displayedPhone = page.getByText('US (+1)');
    this.sessionReminder = page.getByText('Session reminder');
    this.sessionReminderText = page.getByText("Set the time you'd like to be");
    this.remindMe = page.getByText('Remind me');

    // More resilient selector for the Change link
    this.changeSessionReminder = page.locator('a:has-text("Change")').first();
    this.defaultReminder = page.getByText('minutes before the session');

    // session reminders page
    this.sessionRemindersModal = page.getByTestId('modal');
    this.sessionRemindersRemindMe = page.getByText('Remind me').nth(1);
    this.sessionRemindersDropdown = page.getByTestId('custom-select-item-wrapper');
    this.sessionRemindersDropdownOptions = page.getByTestId('custom-dropdown');
    this.sessionRemindersDropdownOption1 = page.getByTestId('custom-dropdown-item-5 minutes before');
    this.sessionRemindersDropdownOption3 = page.getByTestId('custom-dropdown-item-15 minutes before');
    this.sessionRemindersDefaultOption = page
      .getByTestId('custom-select-item-wrapper')
      .locator('div')
      .filter({ hasText: 'minutes before' });
    this.sessionRemindersCancelButton = page.getByRole('button', {
      name: 'Cancel',
    });
    this.sessionRemindersSaveButton = page.getByRole('button', {
      name: 'Save',
    });
    this.sessionRemindersXClose = page.getByRole('button', { name: 'XClose' });

    // success message
    this.successMessage = page.getByText('Notification preferences updated successfully.');
  }

  async gotoNotificationsPage() {
    await this.page.goto(`${process.env.UAT_URL}/account-settings/notifications`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    // Wait for Notifications page to load
    await this.header.waitFor({ state: 'visible' });

    // if 5 minutes is not already selected, select it
    const currentReminderText = await this.defaultReminder.textContent();
    if (!currentReminderText || !currentReminderText.trim().match(/^5 minutes before/)) {
      await this.changeSessionReminder.click();
      await this.sessionRemindersModal.waitFor({ state: 'visible' });
      await this.sessionRemindersDropdown.click();
      await this.sessionRemindersDropdownOption1.click();
      await this.sessionRemindersSaveButton.click();
      await this.successMessage.waitFor({ state: 'visible' });
      await this.successMessage.waitFor({ state: 'hidden' });
    }
  }

  async openSessionReminders() {
    // Check if modal is already open and close it first
    const modalCount = await this.sessionRemindersModal.count();
    if (modalCount > 0) {
      await this.sessionRemindersCancelButton.click();
      await this.sessionRemindersModal.waitFor({ state: 'hidden' });
    }
    await this.changeSessionReminder.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.changeSessionReminder.click();
    // await this.sessionRemindersModal.waitFor({ state: 'visible' });
  }
}
