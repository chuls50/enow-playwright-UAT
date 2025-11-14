import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../utils/auth-helpers.js';

// Invite External Participants 16 (including 10 skipped)

const TEST_DATA = {
  PATIENT_NAME: 'cody test patient',
};

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Verify “Invite External User” UI Elements and Clipboard Copy on Menu Click @[114449] @provider @functional', async ({ page }) => {
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
    await expect(page.getByTestId('toast')).toBeHidden({ timeout: 10000 });

    await page.getByText('Session scheduled').click();
    await expect(page.getByRole('link', { name: 'Add participant(s) ChevronDown' })).toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await expect(page.getByTestId('custom-dropdown-item-Add existing user(s)')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Invite external user')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Copy invitation link')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite external user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via SMS' })).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByText('Phone number*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XClose' }).click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify “Cancel” Button Functionality on Invite External User Screen @[114452] @provider @functional', async ({ page }) => {
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
    await expect(page.getByTestId('toast')).toBeHidden({ timeout: 10000 });

    await page.getByText('Session scheduled').click();
    await expect(page.getByRole('link', { name: 'Add participant(s) ChevronDown' })).toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await expect(page.getByTestId('custom-dropdown-item-Add existing user(s)')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Invite external user')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Copy invitation link')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite external user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via SMS' })).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByText('Phone number*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // verify cancel button functionality
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('cody');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('hully');
    await page.getByRole('textbox', { name: '(555) 000-' }).click();
    await page.getByRole('textbox', { name: '(555) 000-' }).fill('125878456698');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toHaveValue('');

    // reset state
    await page.getByRole('button', { name: 'XClose' }).click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('[Negative] Verify Validation of Required Fields on Invite External User Screen @[114453] @provider @functional', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
    await expect(page.getByTestId('toast')).toBeHidden({ timeout: 10000 });

    await page.getByText('Session scheduled').click();
    await expect(page.getByRole('link', { name: 'Add participant(s) ChevronDown' })).toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await expect(page.getByTestId('custom-dropdown-item-Add existing user(s)')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Invite external user')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Copy invitation link')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite external user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via SMS' })).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByText('Phone number*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // verify required field validation
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('@#$%^&*(');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('#$%^&*(');
    await page.getByRole('textbox', { name: '(555) 000-' }).click();
    await page.getByRole('textbox', { name: '(555) 000-' }).fill('((___) ___ - ____');
    await page.getByRole('button', { name: 'Invite user' }).click();
    await expect(page.getByText('First name must contain at')).toBeVisible();
    await expect(page.getByText('Last name must contain at')).toBeVisible();
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('');
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await page.getByRole('button', { name: 'Invite via email' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill('@$%^&*');
    await page.getByRole('button', { name: 'Invite user' }).click();
    await expect(page.getByText('Email fields can only include')).toBeVisible();
    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill('');
    await expect(page.getByText('Email is required')).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XClose' }).click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('[Negative] Verify Validation of Invalid Input on Invite External User Screen @[114454] @provider @functional', async ({ page }) => {
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
    await expect(page.getByTestId('toast')).toBeHidden({ timeout: 10000 });

    await page.getByText('Session scheduled').click();
    await expect(page.getByRole('link', { name: 'Add participant(s) ChevronDown' })).toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await expect(page.getByTestId('custom-dropdown-item-Add existing user(s)')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Invite external user')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Copy invitation link')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite external user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via SMS' })).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByText('Phone number*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // verify required field validation
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('@#$%^&*(');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('#$%^&*(');
    await page.getByRole('textbox', { name: '(555) 000-' }).click();
    await page.getByRole('textbox', { name: '(555) 000-' }).fill('((___) ___ - ____');
    await page.getByRole('button', { name: 'Invite user' }).click();
    await expect(page.getByText('First name must contain at')).toBeVisible();
    await expect(page.getByText('Last name must contain at')).toBeVisible();
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('');
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await page.getByRole('button', { name: 'Invite via email' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill('@$%^&*');
    await page.getByRole('button', { name: 'Invite user' }).click();
    await expect(page.getByText('Email fields can only include')).toBeVisible();
    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill('');
    await expect(page.getByText('Email is required')).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XClose' }).click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify External User Invitation Sent and Invite Modal Closed for Valid Input @[114455] @provider @functional', async ({ page }) => {
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
    await expect(page.getByTestId('toast')).toBeHidden({ timeout: 10000 });

    await page.getByText('Session scheduled').click();
    await expect(page.getByRole('link', { name: 'Add participant(s) ChevronDown' })).toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await expect(page.getByTestId('custom-dropdown-item-Add existing user(s)')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Invite external user')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Copy invitation link')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite external user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via SMS' })).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByText('Phone number*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // invite external user with valid info
    await page.getByRole('button', { name: 'Invite via email' }).click();
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('James');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('Davin');
    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    const timestamp = new Date().getTime();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill(`jamesdavin${timestamp}@gmail.com`);
    await page.getByRole('button', { name: 'Invite user' }).click();
    await expect(page.getByText('Invitation sent to')).toBeVisible();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XClose' }).click();
    await page.getByText('Session scheduled').click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });

  test('Verify Toast Message Displayed After Successful Invite @[114459] @provider @functional', async ({ page }) => {
    await page.getByRole('button', { name: 'CalendarPlus Schedule session' }).click();
    await page.getByRole('link', { name: 'Change patient' }).click();
    await page.getByText(TEST_DATA.PATIENT_NAME).click();
    await page.getByRole('button', { name: 'Save' }).click();
    // click the first class="_container_1hd2b_1"
    await page.locator('._container_1hd2b_1').first().click();
    await page.getByRole('button', { name: 'Schedule visit' }).click();
    await expect(page.getByTestId('toast').getByText('Session scheduled', { exact: true })).toBeVisible();
    await expect(page.getByTestId('toast')).toBeHidden({ timeout: 10000 });

    await page.getByText('Session scheduled').click();
    await expect(page.getByRole('link', { name: 'Add participant(s) ChevronDown' })).toBeVisible();
    await page.getByRole('link', { name: 'Add participant(s) ChevronDown' }).click();
    await expect(page.getByTestId('custom-dropdown-item-Add existing user(s)')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Invite external user')).toBeVisible();
    await expect(page.getByTestId('custom-dropdown-item-Copy invitation link')).toBeVisible();
    await page.getByTestId('custom-dropdown-item-Invite external user').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite external user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via email' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite via SMS' })).toBeVisible();
    await expect(page.getByText('First name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(page.getByText('Last name*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(page.getByText('Email*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'example@mail.com' })).toBeVisible();
    await page.getByRole('button', { name: 'Invite via SMS' }).click();
    await expect(page.getByText('Phone number*')).toBeVisible();
    await expect(page.getByRole('textbox', { name: '(555) 000-' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // invite external user with valid info
    await page.getByRole('button', { name: 'Invite via email' }).click();
    await page.getByRole('textbox', { name: 'First name' }).click();
    await page.getByRole('textbox', { name: 'First name' }).fill('James');
    await page.getByRole('textbox', { name: 'Last name' }).click();
    await page.getByRole('textbox', { name: 'Last name' }).fill('Davin');
    await page.getByRole('textbox', { name: 'example@mail.com' }).click();
    const timestamp = new Date().getTime();
    await page.getByRole('textbox', { name: 'example@mail.com' }).fill(`jamesdavin${timestamp}@gmail.com`);
    await page.getByRole('button', { name: 'Invite user' }).click();
    await expect(page.getByText('Invitation sent to')).toBeVisible();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'XClose' }).click();
    await page.getByText('Session scheduled').click();
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'XCircle Cancel session' }).click();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('Session canceled')).toBeVisible();
  });
});

test.describe('Multi-User @regression', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('Verify External User Entry into Session via Invite Link @[114456] @multi-user @functional', async ({ page }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('Verify Layout and Feature Visibility for Guest Users in Chat/Video Session @[114457] @multi-user @functional', async ({
    page,
  }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('Verify Guest Can View Documents Shared Before and During the Session @[114458] @multi-user @functional', async ({
    page,
  }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('[Negative] Verify Guest Cannot See Visit Notes Tab @[114460] @multi-user @functional', async ({ page }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('[Negative] Verify Guest Cannot See “Add Participants” Button @[114461] @multi-user @functional', async ({ page }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('[Negative] Verify Guest Cannot See “End Meeting for All” Button @[114462] @multi-user @functional', async ({ page }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('Verify Guest Appointment Appears in History After External User Registers @[114463] @multi-user @functional', async ({
    page,
  }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('Verify Inviting Internal User as External Workflow @[117664] @multi-user @functional', async ({ page }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('[Negative] Verify Message and Functionality for Non-Available Meetings @[117671] @multi-user @functional', async ({
    page,
  }) => {});

  // Skipping tests that require external email/SMS handling or complex interactions
  test.skip('Verify End Meeting for All message for Guest @[117672] @multi-user @functional', async ({ page }) => {});
});
