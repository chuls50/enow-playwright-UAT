import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

test.describe('Device_ID @regression', () => {
  test.use(useRole(ROLES.DEVICE_USER));
  test.beforeEach(async ({ page }) => {
    await page.goto('https://xj9.sandbox-encounterservices.com/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('Verify My Account View for Device ID User Displays Correct Fields @[115333] @device @ui', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // verify fields
    await expect(page.getByRole('paragraph').filter({ hasText: 'My account' })).toBeVisible();
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Device ID')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Zip code')).toBeVisible();
    await expect(page.getByText('Address 1')).toBeVisible();
    await expect(page.getByText('Address 2')).toBeVisible();

    // confirm absence of fields
    await expect(page.getByText('First name')).not.toBeVisible();
    await expect(page.getByText('Last name')).not.toBeVisible();
    await expect(page.getByText('DOB')).not.toBeVisible();
    await expect(page.getByText('Sex Assigned at Birth')).not.toBeVisible();
  });

  test('Verify Edit Profile View for Device ID User Displays Correct Fields @[115334] @device @ui', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit profile details')).toBeVisible();

    // verify fields
    await expect(page.getByText('Name*')).toBeVisible();
    await expect(page.getByText('Device ID*')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('City')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('Zip code')).toBeVisible();
    await expect(page.getByText('Address line 1')).toBeVisible();
    await expect(page.getByText('Address line 2')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('Country')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('State')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('Phone number')).toBeVisible();

    // confirm absence of fields
    await expect(page.getByText('First name')).not.toBeVisible();
    await expect(page.getByText('Last name')).not.toBeVisible();
    await expect(page.getByText('DOB')).not.toBeVisible();
    await expect(page.getByText('Sex Assigned at Birth')).not.toBeVisible();
  });

  test('Verify Default Avatar Displays First Letter of Device ID Name When No Photo Is Uploaded @[115335] @device @functional', async ({
    page,
  }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // verify avatar
    // Check if the avatar with the first letter is visible
    await expect(page.getByTestId('avatar').locator('div').filter({ hasText: 'H' }).locator('div')).toBeVisible();
  });

  test('Verify Validation for Name and Device ID in Edit Profile View @[115336]', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // open edit profile
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit profile details')).toBeVisible();

    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('');
    await page.getByRole('textbox', { name: 'Device ID' }).click();
    await page.getByRole('textbox', { name: 'Device ID' }).fill('');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Device ID is required')).toBeVisible();
    await page.getByRole('textbox', { name: 'Device ID' }).click();
    await page.getByRole('textbox', { name: 'Device ID' }).fill('33255419');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Hatsune Mikuuuu');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Failed to update profile.')).toBeVisible();
    await expect(page.getByText('This Device ID already exists.')).toBeVisible();
  });

  test('Verify Optional Address Fields Are Displayed and Editable @[115337] @device @functional', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // open edit profile
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit profile details')).toBeVisible();

    // Check current city value and toggle between Scottsdale and Phoenix
    const currentCity = await page.getByRole('textbox', { name: 'City' }).inputValue();
    const newCity = currentCity === 'Scottsdale' ? 'Phoenix' : 'Scottsdale';

    await page.getByRole('textbox', { name: 'City' }).click();
    await page.getByRole('textbox', { name: 'City' }).fill(newCity);
    await page.getByRole('textbox', { name: 'Zip code' }).click();
    await page.getByRole('textbox', { name: 'Zip code' }).fill('85032');
    await page.getByRole('textbox', { name: 'Address line 1' }).click();
    await page.getByRole('textbox', { name: 'Address line 1' }).fill('3325 e waltann ln');
    await page.getByRole('textbox', { name: 'Address line 2' }).click();
    await page.getByRole('textbox', { name: 'Address line 2' }).fill('5416 e emile zola');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Profile updated successfully!')).toBeVisible();

    await expect(page.getByText(newCity)).toBeVisible();
    await expect(page.getByText('85032')).toBeVisible();
    await expect(page.getByText('3325 e waltann ln')).toBeVisible();
    await expect(page.getByText('5416 e emile zola')).toBeVisible();

    //reset state
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await page.getByRole('textbox', { name: 'City' }).click();
    await page.getByRole('textbox', { name: 'City' }).fill('');
    await page.getByRole('textbox', { name: 'Zip code' }).click();
    await page.getByRole('textbox', { name: 'Zip code' }).fill('');
    await page.getByRole('textbox', { name: 'Address line 1' }).click();
    await page.getByRole('textbox', { name: 'Address line 1' }).fill('');
    await page.getByRole('textbox', { name: 'Address line 2' }).click();
    await page.getByRole('textbox', { name: 'Address line 2' }).fill('');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Profile updated successfully!')).toBeVisible();
  });

  test('Verify Time Zone and Application Language Are Displayed and Editable @[115338] @device @functional', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // application language
    await expect(page.getByText('Application language')).toBeVisible();
    await expect(page.getByText('English')).toBeVisible();
    await page.getByRole('link', { name: 'Change language' }).click();
    await page.getByTestId('custom-select-item-wrapper').click();
    await page.getByTestId('custom-dropdown-item-Spanish').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Se actualizó el idioma de la')).toBeVisible();
    await expect(page.getByText('Español')).toBeVisible();
    await page.getByRole('link', { name: 'Cambiar idioma' }).click();
    await page.getByTestId('custom-select-item-wrapper').click();
    await page.getByTestId('custom-dropdown-item-Inglés').click();
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await expect(page.getByText('Application language updated')).toBeVisible();

    // change time zone
    await expect(page.getByText('Time zone', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change time zone' })).toBeVisible();
    await page.getByRole('link', { name: 'Change time zone' }).click();
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Time zone updated')).toBeVisible();
    await page.getByRole('link', { name: 'Change time zone' }).click();
    await page.getByTestId('switch-div').click();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Time zone updated')).toBeVisible();
  });

  test('[Negative] Verify "Delete Account" Option Is Not Available for Device ID Users @[115339] @device @ui', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // verify absence of delete account option
    await expect(page.getByRole('button', { name: 'Delete Account' })).not.toBeVisible();
  });

  test('Verify Notifications Section Displays for Device ID Users @[115340] @device @ui', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // verify notifications
    await page.getByRole('button', { name: 'Notifications' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Notifications' })).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('SMS')).toBeVisible();
    await expect(page.getByText('In-app')).toBeVisible();

    await page.getByTestId('switch-div').first().click();
    await expect(page.getByTestId('toast').getByText('Notification preferences').first()).toBeVisible();
    await page.getByTestId('switch-div').nth(2).click();
    await expect(page.getByTestId('toast').getByText('Notification preferences').first()).toBeVisible();
    await page.getByTestId('switch-div').first().click();
    await expect(page.getByTestId('toast').getByText('Notification preferences').first()).toBeVisible();
    await page.getByTestId('switch-div').nth(2).click();
    await expect(page.getByTestId('toast').getByText('Notification preferences').first()).toBeVisible();
  });

  test('Verify Avatar Dropdown Displays Device ID Name and ID @[115539] @device @ui', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();

    // verify avatar dropdown
    await expect(page.getByText('Hatsune Mikuuuu 911272679')).toBeVisible();
    await expect(page.getByText('chuls+devicecodytest')).toBeVisible();
  });

  test('Verify Device ID User Can Upload Profile Photo from My Account Screen @[115540] @device @functional', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // upload photo images/profile-icon.jpg
    // use a hidden input file element that should be near the upload button
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Download Upload photo' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/images/profile-icon.jpg');
    await expect(page.getByTestId('toast').getByText('Profile picture uploaded')).toBeVisible();
    await page.getByRole('button', { name: 'Trash Delete photo' }).click();
    await expect(page.getByText('Profile picture deleted')).toBeVisible();
  });

  test('Verify Device ID User Can Delete Profile Photo from My Account Screen @[115541] @device @functional', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // upload photo images/profile-icon.jpg
    // use a hidden input file element that should be near the upload button
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Download Upload photo' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/images/profile-icon.jpg');
    await expect(page.getByTestId('toast').getByText('Profile picture uploaded')).toBeVisible();
    await page.getByRole('button', { name: 'Trash Delete photo' }).click();
    await expect(page.getByText('Profile picture deleted')).toBeVisible();
  });

  test('[Negative] Verify Error When Device ID Already Exists @[115542] @device @functional', async ({ page }) => {
    // open my account
    await page.getByTestId('popover-trigger').first().click();
    await page.getByRole('button', { name: 'SettingsGear Account settings' }).click();

    // open edit profile
    await page.getByRole('button', { name: 'Edit Edit' }).click();
    await expect(page.getByText('Edit profile details')).toBeVisible();

    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('');
    await page.getByRole('textbox', { name: 'Device ID' }).click();
    await page.getByRole('textbox', { name: 'Device ID' }).fill('');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Device ID is required')).toBeVisible();
    await page.getByRole('textbox', { name: 'Device ID' }).click();
    await page.getByRole('textbox', { name: 'Device ID' }).fill('911');
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Hatsune Mikuuuu');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Failed to update profile.')).toBeVisible();
    await expect(page.getByText('This Device ID already exists.')).toBeVisible();
  });
});
