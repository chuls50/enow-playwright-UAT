import { test, expect } from '@playwright/test';
import { DashboardPage as ProviderDashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { CoordinatorDashboardPage } from '../../../models/pages/coordinator/coordinator-dashboard.page.js';
import { ROLES, useRole, createMultiRoleContexts } from '../../../utils/auth-helpers.js';

// Transient Meeting Request Providers Tab - total tests 7 (including 4 skipped)

const TEST_DATA = {
  PROVIDER_NAME: 'cody prov',
  PROVIDER_EMAIL: 'chuls+prov1codytest@globalmed.com',
  OFFLINE_USER: 'chuls+adminc',
};

test.describe('Dual-User @regression', () => {
  test.use(useRole(ROLES.PROVIDER_COORDINATOR));
  let providerDashboardPage;

  test.beforeEach(async ({ page }) => {
    providerDashboardPage = new ProviderDashboardPage(page);
    await providerDashboardPage.gotoProviderDashboard();
  });

  test('Verify UI of Provider/Coordinator List Screen @[114316] @dual-user @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await expect(page.getByRole('heading', { name: 'Providers' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by name, email' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'User type ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Specialty ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Spoken languages ChevronDown' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Status ChevronDown' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Messages' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Video' }).first()).toBeVisible();
  });

  test('Verify Filtering by Status @[114317] @dual-user @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await page.getByRole('link', { name: 'Status ChevronDown' }).click();
    await page.getByTestId('item Offline').click();
    await page.getByText('Apply Filter').click();
    await expect(page.getByText('Offline').first()).toBeVisible();
    await expect(page.getByText('Online')).not.toBeVisible();
  });

  test('Verify Search by Name or Email @[114318] @dual-user @functional', async ({ page }) => {
    await page.locator('a').filter({ hasText: 'Providers' }).click();
    await page.getByRole('textbox', { name: 'Search by name, email' }).click();
    await page.getByRole('textbox', { name: 'Search by name, email' }).fill(TEST_DATA.PROVIDER_NAME);
    await expect(page.getByTestId('cell-0-name').getByRole('paragraph')).toContainText(TEST_DATA.PROVIDER_NAME);
    await page.getByRole('textbox', { name: 'Search by name, email' }).click();
    await page.getByRole('textbox', { name: 'Search by name, email' }).fill(TEST_DATA.PROVIDER_EMAIL);
    await expect(page.getByText(TEST_DATA.PROVIDER_NAME)).toBeVisible();
  });
});

test.describe('Multi-User @regression', () => {
  let coordinatorDashboardPage;
  let providerDashboardPage;
  let coordinatorContext;
  let providerContext;

  test.beforeEach(async ({ browser }) => {
    const contexts = await createMultiRoleContexts(browser, [ROLES.COORDINATOR, ROLES.PROVIDER]);
    coordinatorContext = contexts[ROLES.COORDINATOR];
    providerContext = contexts[ROLES.PROVIDER];

    const coordinatorPage = await coordinatorContext.newPage();
    const providerPage = await providerContext.newPage();

    coordinatorDashboardPage = new CoordinatorDashboardPage(coordinatorPage);
    providerDashboardPage = new ProviderDashboardPage(providerPage);
  });

  test.afterEach(async () => {
    await coordinatorContext?.close();
    await providerContext?.close();
  });

  test('Verify "Video Call Now" Button Opens Video Request @[114319] @multi-user @functional', async () => {
    // From Coordinator Dashboard - goto providers tab
    await coordinatorDashboardPage.gotoCoordinatorDashboard();
    await coordinatorDashboardPage.providersTab.click();

    // From Provider
    await providerDashboardPage.gotoProviderDashboard();

    // From Coordinator - search by provider email
    await coordinatorDashboardPage.page.getByRole('textbox', { name: 'Search by name, email' }).fill(TEST_DATA.PROVIDER_EMAIL);
    await coordinatorDashboardPage.page.getByRole('link', { name: 'Video' }).click();

    // From Provider Dashboard - verify incoming video call request
    await expect(providerDashboardPage.page.getByText('Video-call request')).toBeVisible();

    // From Provider - accept video call
    await providerDashboardPage.page.getByRole('button', { name: 'Accept' }).click();

    // Wait for new page to load and verify video call opened in new tab containing /encounters/medical-staff/
    await providerDashboardPage.page.waitForTimeout(2000);
    const pages = providerContext.pages();
    const videoCallPage = pages[pages.length - 1];
    await videoCallPage.waitForLoadState('networkidle');
    await expect(videoCallPage).toHaveURL(/\/encounters\/medical-staff\//);
  });

  test('Verify "Chat Now" Button Opens Chat Request @[114320] @multi-user @functional', async ({ page }) => {
    // From Coordinator Dashboard - goto providers tab
    await coordinatorDashboardPage.gotoCoordinatorDashboard();
    await coordinatorDashboardPage.providersTab.click();

    // From Provider
    await providerDashboardPage.gotoProviderDashboard();

    // From Coordinator - search by provider email
    await coordinatorDashboardPage.page.getByRole('textbox', { name: 'Search by name, email' }).fill(TEST_DATA.PROVIDER_EMAIL);
    await coordinatorDashboardPage.page.getByRole('link', { name: 'Messages' }).click();

    // From Provider Dashboard - verify incoming chat request
    await expect(providerDashboardPage.page.getByText('Chat request')).toBeVisible();

    // From Provider - accept chat request
    await providerDashboardPage.page.getByRole('button', { name: 'Accept' }).click();

    // From Provider - Wait for new page to load and verify chat opened in new tab containing /encounters/medical-staff/
    await providerDashboardPage.page.waitForTimeout(2000);
    const pages = providerContext.pages();
    const chatPage = pages[pages.length - 1];
    await chatPage.waitForLoadState('networkidle');
    await expect(chatPage).toHaveURL(/\/chats\/medical-staff\//);
  });

  test('Verify "Video Call Now" and "Chat Now" Are Disabled for Offline Users @[114321] @multi-user @functional', async () => {
    // From Coordinator Dashboard - goto providers tab
    await coordinatorDashboardPage.gotoCoordinatorDashboard();
    await coordinatorDashboardPage.providersTab.click();

    // From Provider
    await providerDashboardPage.gotoProviderDashboard();

    // From Coordinator - search by provider email
    await coordinatorDashboardPage.page.getByRole('textbox', { name: 'Search by name, email' }).fill(TEST_DATA.OFFLINE_USER);

    // From Coordinator - Verify Video and Messages buttons are disabled (check for disabled attribute or non-clickable state)
    await expect(coordinatorDashboardPage.page.getByText('Offline')).toBeVisible();
    await expect(coordinatorDashboardPage.page.getByText('Online')).not.toBeVisible();

    // From Coordinator - Verify Video button is disabled by attempting to click
    await coordinatorDashboardPage.page.getByRole('link', { name: 'Video' }).click();

    // From Provider Dashboard - verify no incoming video call request
    await expect(providerDashboardPage.page.getByText('Video-call request')).not.toBeVisible();

    // From Coordinator - Verify Messages button is disabled by attempting to click
    await coordinatorDashboardPage.page.getByRole('link', { name: 'Messages' }).click();

    // From Provider Dashboard - verify no incoming chat request popup
    await expect(providerDashboardPage.page.getByText('Chat request')).not.toBeVisible();
  });

  test('Verify "Meeting Declined" Popup Message @[114330] @multi-user @functional', async () => {
    // From Coordinator Dashboard - goto providers tab
    await coordinatorDashboardPage.gotoCoordinatorDashboard();
    await coordinatorDashboardPage.providersTab.click();

    // From Provider
    await providerDashboardPage.gotoProviderDashboard();

    // From Coordinator - search by provider email
    await coordinatorDashboardPage.page.getByRole('textbox', { name: 'Search by name, email' }).fill(TEST_DATA.PROVIDER_EMAIL);
    await coordinatorDashboardPage.page.getByRole('link', { name: 'Messages' }).click();

    // From Provider Dashboard - verify incoming chat request
    await expect(providerDashboardPage.page.getByText('Chat request')).toBeVisible();

    // From Provider - accept chat request
    await providerDashboardPage.page.getByRole('button', { name: 'Decline' }).click();

    // From Coordinator New Page - verify "Meeting request" popup message
    await coordinatorDashboardPage.page.waitForTimeout(2000);
    const pages = coordinatorContext.pages();
    const coordinatorPopupPage = pages[pages.length - 1];
    await expect(coordinatorPopupPage.getByText('Meeting request', { exact: true })).toBeVisible();
  });
});
