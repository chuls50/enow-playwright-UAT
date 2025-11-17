import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Patient @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Waiting Room View for Scheduled Appointment with Completed Payment @[114775] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify Scheduled Appointment Cannot Enter Waiting Room Without Completed Payment @[114776] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Waiting Room View for On-Demand Appointment with Completed Payment @[114777] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify On-Demand Appointment Is Cancelled if Payment Is Not Completed @[114778] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Patient is Taken to Meeting When Provider Starts Meeting from Waiting Room @[114779] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Return to Session Details on Clicking Leave Waiting Room Button @[114780] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('[Negative] Verify Chat Warning Message When Provider is Not in Waiting Room @[114781] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Chat with Participants Functionality Before Meeting Starts Precondition: Provider should be in waiting room @[114969] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Leave Waiting Room Button Visibility and Functionality @[114970] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Patient Can Re-Enter Waiting Room After Leaving @[114971] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Rejoining Behavior When Provider Has Already Started Meeting @[114972] @multi-user @functional', async ({
    page,
  }) => {});
});
