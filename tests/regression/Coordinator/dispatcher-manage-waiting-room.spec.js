import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('Coordinator @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Dispatcher Waiting Room Dashboard Layout on Access @[114782] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Waiting Room Badge Display When Institution User Joins @[114783] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Dispatcher Badge Notification When Chat Message is Sent by User in Waiting Room @[114784] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Dispatcher Contact Participants Behavior and UI View @[114785] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Dispatcher Waiting Room Behavior When Provider Starts Meeting @[114786] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Dispatcher Dashboard Update When Provider Starts Meeting Without Coordinator in Waiting Room @[114787] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Badge Removal When Provider Ends Meeting @[114788] @multi-user @functional', async ({ page }) => {});
  test.skip('Verify UI Elements in Waiting Room Badge on Dispatcher Dashboard @[114968] @multi-user @ui', async ({ page }) => {});

  test.skip('Verify Dispatcher-Coordinator as Participant Functionality in Waiting Room @[117674] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify that Coordinator-Provider has Coordinator role on the Contact Participant panel @[117688] @multi-user @functional', async ({
    page,
  }) => {});
});
