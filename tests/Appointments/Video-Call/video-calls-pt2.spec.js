import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('Multi-User @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Transient Video Call Screen Loads with All Functional Elements @[114280] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Participant Video Feed Display @[114281] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Device Toggles Function Properly @[114282] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Add Participants to Ongoing Transient Call @[114283] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Adding a Document to Video Call @[114284] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Chat Panel Opens in Video Call @[114285] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify End Call Options for Participant @[114288] @multi-user @functional', async ({ page }) => {});
});
