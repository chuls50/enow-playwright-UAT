import { BasePage } from '../../base-page.js';

export class CalendarSettingsPage extends BasePage {
  constructor(page) {
    super(page);

    // Main page elements
    this.accountSettingsHeader = page.getByRole('heading', {
      name: 'Account settings',
    });
    this.calendarLabel = page
      .getByRole('paragraph')
      .filter({ hasText: 'Calendar' })
      .first();
    this.calendarDescription = page.getByText('Manage your time zone and');

    // Time Zone section elements
    this.timeZoneLabel = page.getByText('Time Zone').first();
    this.timeZoneButton = page.getByRole('link', { name: 'Change time zone' });

    // Time Zone Modal elements
    this.timeZoneModalTitle = page.getByText('Change time zone').nth(1);
    this.timeZoneModalCloseButton = page.getByRole('button', {
      name: 'XClose',
    });
    this.modalTimeZone = page
      .locator('span')
      .filter({ hasText: /^Time zone$/ });

    // Time Zone Toggle and form elements
    this.automaticTimeZoneText = page.getByText('Automatic time zone');
    this.automaticTimeZoneToggle = page
      .getByTestId('switch-div')
      .locator('div')
      .first();

    // Time Zone Dropdown elements
    this.timeZoneDropdown = page.getByTestId('custom-select-item-wrapper');
    this.timeZoneDropdownIcon = page
      .getByRole('img', { name: 'ChevronDown' })
      .getByTestId('icon');

    // Time Zone Action buttons
    this.timeZoneCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.timeZoneSaveChangesButton = page.getByRole('button', {
      name: 'Save changes',
    });

    // Time Zone Success/Error messages
    this.timeZoneSuccessMessage = page.getByText('Time zone updated');

    // Common timezone display elements
    this.mountainStandardTime = page
      .getByText('(GMT-07:00) Mountain Standard')
      .first();

    // Daily Availability section elements
    this.dailyAvailabilityLabel = page.getByText('Daily Availability').first();
    this.editDailyAvailabilityButton = page.getByRole('button', {
      name: 'Edit',
    });

    // Edit Daily Availability Modal elements
    this.editDailyAvailabilityModal = page.getByText('Edit Daily Availability');
    this.availabilitySaveChangesButton = page.getByRole('button', {
      name: 'Save Changes',
    });
    this.availabilityCancelButton = page.getByRole('button', {
      name: 'Cancel',
    });
    this.availabilityXCloseButton = page.getByRole('button', { name: 'X' });
    this.dayOffMessage = page.getByText('Day off');

    // Weekly availability toggles - only the ones actually used in tests
    this.availabilityToggleMonday = page
      .locator('label')
      .filter({ hasText: 'Monday' })
      .getByTestId('switch-div');
    this.availabilityToggleTuesday = page
      .locator('label')
      .filter({ hasText: 'Tuesday' })
      .getByTestId('switch-div');
    this.availabilityToggleWednesday = page
      .locator('label')
      .filter({ hasText: 'Wednesday' })
      .getByTestId('switch-div');
    this.availabilityToggleThursday = page
      .locator('label')
      .filter({ hasText: 'Thursday' })
      .getByTestId('switch-div');
    this.availabilityToggleFriday = page
      .locator('label')
      .filter({ hasText: 'Friday' })
      .getByTestId('switch-div');
    this.availabilityToggleSaturday = page
      .locator('label')
      .filter({ hasText: 'Saturday' })
      .getByTestId('switch-div');
    this.availabilityToggleSunday = page
      .locator('label')
      .filter({ hasText: 'Sunday' })
      .getByTestId('switch-div');

    // Monday-specific elements used in tests
    this.availabilityAddIconMonday = page
      .locator('div')
      .filter({ hasText: /^Monday:—:$/ })
      .getByRole('link')
      .nth(1);
    this.availabilityDeleteMondayChrome = page
      .locator('div')
      .filter({ hasText: /^:—::—:$/ })
      .getByRole('link')
      .nth(1);
    this.availabilityDeleteMondayMobile = page
      .locator('div')
      .filter({ hasText: /^12:00 AM—11:59 PMhh:mm a—hh:mm a$/ })
      .getByRole('link')
      .nth(1);

    // Availability Success/Error messages
    this.availabilitySuccessMessage = page.getByText(
      'Profile updated successfully!'
    );
    this.availabilityErrorMessage = page.getByText(
      'All times must have a value selected.'
    );
  }

  // Navigation methods
  async gotoCalendarSettingsPage() {
    await this.page.goto(`${process.env.UAT_URL}/account-settings/calendar`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    // Wait for Calendar settings page to load
    await this.accountSettingsHeader.waitFor({ state: 'visible' });
  }

  // Helper methods for complex multi-step actions
  async openChangeTimeZoneModal() {
    await this.timeZoneButton.waitFor({ state: 'visible' });
    await this.timeZoneButton.click();
  }

  async waitForTimeZoneModal() {
    await this.timeZoneModalTitle.waitFor();
  }

  async isAutomaticToggleChecked() {
    await this.automaticTimeZoneToggle.waitFor({ state: 'visible' });
    return await this.automaticTimeZoneToggle.isChecked();
  }
}
