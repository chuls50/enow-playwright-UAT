import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Provider @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Waiting Room View for Scheduled Appointment  - Provider @[114789] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Waiting Room View for On-Demand Appointment - Provider @[114790] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Start Meeting Behavior in Waiting Room - Provider @[114791] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Verify "Start session" Button Behavior When Patient Has Not Joined - Provider @[114792] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Rejoining Waiting Room After Tab Closure @[114919] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Provider Can Use Chat Before Meeting Starts @[114920] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Provider Rejoins Meeting After Starting It @[114973] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify in-call Chat panel from Waiting Room @[118966] @multi-user @functional', async ({ page }) => {});
});
