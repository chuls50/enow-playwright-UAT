import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('Implications of Users in Multiple Institutions @regression', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify institution switch via header dropdown @[117292] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify scheduling an appointment uses the active Institution context @[117293] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Profile settings remain consistent across Institutions @[117294] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Availability settings are shared across Institutions @[117295] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Notification preferences remain the same across Institutions @[117296] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify user Roles are consistent across Institutions @[117297] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify User status in Providers tab when User is in different Institution @[118599] @multi-user @functional', async ({
    page,
  }) => {});
});
