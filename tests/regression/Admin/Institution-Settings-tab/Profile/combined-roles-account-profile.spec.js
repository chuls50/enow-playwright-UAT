import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../../../../utils/auth-helpers.js';
import { MyAccountPage } from '../../../../models/pages/admin/admin-my-account.page.js';
import { BasePage } from '../../../../models/base-page.js';

// Combined Roles Account Profiles - Total tests: 5

test.describe('Coordinator @regression', () => {
  // Login as a Coordinator
  test.use(useRole(ROLES.COORDINATOR));

  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoMyAccount();
  });

  test('Verify My Account Settings for Coordinator Role @[117739] @coordinator @ui', async ({ page }) => {
    // Verify standard profile fields are visible
    await expect(page.getByText('Profile details')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Languages spoken')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();

    // Verify provider-specific fields are not visible for coordinator role
    await expect(page.getByText('Medical specialty')).not.toBeVisible();
    await expect(page.getByText('License to practice')).not.toBeVisible();
    await expect(page.getByText('Calendar')).not.toBeVisible();
  });
});

test.describe('Provider+Admin @regression', () => {
  // Login as a Provider + Admin
  test.use(useRole(ROLES.PROVIDER_ADMIN));

  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoMyAccount();
  });

  test('Verify My Account Settings for Provider + Admin Role @[117740] @dual-user @ui', async ({ page }) => {
    // Verify standard profile fields are visible
    await expect(page.getByText('Profile details')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Languages spoken')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();

    // Verify provider-specific fields are visible
    await expect(page.getByText('Medical specialty')).toBeVisible();
    await expect(page.getByText('License to practice')).toBeVisible();

    // Verify calendar section and daily availability
    await expect(page.getByText('Calendar')).toBeVisible();
    await page.getByRole('button', { name: 'Calendar' }).click();
    await expect(page.getByText('Daily availability')).toBeVisible();

    // Verify notifications section is accessible
    await page.getByRole('button', { name: 'Notifications' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Notifications' })).toBeVisible();
  });
});

test.describe('Provider+Coordinator  @regression', () => {
  // Login as a Provider + Coordinator
  test.use(useRole(ROLES.PROVIDER_COORDINATOR));

  let basePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await basePage.goto(`${process.env.UAT_URL}/account-settings/my-account`);
  });

  test('Verify Verify Account Settings screen for Provider + Coordinator combined roles @[117741] @dual-user @ui', async ({ page }) => {
    // Verify standard profile fields are visible
    await expect(page.getByText('Profile details')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Languages spoken')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();

    // Verify provider-specific fields are visible
    await expect(page.getByText('Medical specialty')).toBeVisible();
    await expect(page.getByText('License to practice')).toBeVisible();
  });
});

test.describe('Coordinator+Admin @regression', () => {
  // Login as a Admin + Coordinator
  test.use(useRole(ROLES.ADMIN_COORDINATOR));

  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoMyAccount();
  });

  test('Verify Account Settings screen for Coordinator + Admin combined roles @[117742] @dual-user @ui', async ({ page }) => {
    // Verify standard profile fields are visible
    await expect(page.getByText('Profile details')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Languages spoken')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();

    // Verify provider-specific fields are not visible for coordinator/admin roles
    await expect(page.getByText('Medical specialty')).not.toBeVisible();
    await expect(page.getByText('License to practice')).not.toBeVisible();
    await expect(page.getByText('Calendar')).not.toBeVisible();

    // Verify notifications section is accessible
    await page.getByRole('button', { name: 'Notifications' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Notifications' })).toBeVisible();
  });
});

test.describe('Provider+Admin+Coordinator @regression', () => {
  // Login as a Provider + Coordinator + Admin
  test.use(useRole(ROLES.PROVIDER_ADMIN_COORDINATOR));

  let myAccountPage;

  test.beforeEach(async ({ page }) => {
    myAccountPage = new MyAccountPage(page);
    await myAccountPage.gotoMyAccount();
  });

  test('Verify My Account Settings for user with Provider + Coordinator + Admin roles @[117743] @dual-user @ui', async ({ page }) => {
    // Verify standard profile fields are visible
    await expect(page.getByText('Profile details')).toBeVisible();
    await expect(page.getByText('First name')).toBeVisible();
    await expect(page.getByText('Last name')).toBeVisible();
    await expect(page.getByText('Languages spoken')).toBeVisible();
    await expect(page.getByText('Country')).toBeVisible();
    await expect(page.getByText('State')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();

    // Verify provider-specific fields are visible
    await expect(page.getByText('Medical specialty')).toBeVisible();
    await expect(page.getByText('License to practice')).toBeVisible();
    await expect(page.getByText('Calendar')).toBeVisible();

    // Verify calendar section and daily availability
    await page.getByRole('button', { name: 'Calendar' }).click();
    await expect(page.getByText('Daily availability')).toBeVisible();

    // Verify notifications section is accessible
    await page.getByRole('button', { name: 'Notifications' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Notifications' })).toBeVisible();
  });
});
