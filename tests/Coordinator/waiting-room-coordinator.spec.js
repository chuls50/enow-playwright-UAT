import { test, expect } from '@playwright/test';
import { BasePage } from '../models/base-page.js';

test.describe('Waiting Room Coordinator @regression', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Coordinator as Appointment Participant Workflow @[117676] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Waiting Room screen is shown for Coordinator as a scheduled participant @[118575] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Coordinator is navigated to video call when Provider starts the session @[118576] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Coordinator monitoring the Waiting Room is returned to Waiting Room @[118577] @multi-user @functional', async ({
    page,
  }) => {});
});
