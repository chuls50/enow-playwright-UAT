import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Multi-User @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Open Chat appointment session from Dashboard for Patient @[113682] @multi-user @functional', async ({ page }) => {});

  test.skip('Check Chat Window Elements in Active Chat Session for Patient @[113683] @multi-user @functional', async ({ page }) => {});

  test.skip('Validate Chat Window Elements in Active Chat Session for Provider @[113684] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify "Leave Session" Functionality for Provider @[113685] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify "Add Visit Note" and "Add Instructions" Buttons for Provider @[113686] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Open Chat appointment session from Dashboard for Provider @[113688] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Visit Notes and Discharge Instructions for Provider @[113689] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Symptoms Button Functionality @[113690] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Show Documents Button Functionality @[113691] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Add Document Functionality @[113692] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Participants Panel and Add Participant Functionality for Provider @[113693] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Chat Slide out UI While in Video Call Appointment @[114434] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Copy Invitation Link Flow: Adds Existing User to Chat Session @[114435] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Chat Session Content Saved After Leaving @[114436] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Redirection to Rating Screen After Leaving Chat @[114437] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Session Details for Patient @[114438] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify separate tab opens for Chat appointment @[117666] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify popup warning if browser blocks new tab for chat @[117668] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Available toggle is turned off for Provider after joining session @[117675] @multi-user @functional', async ({
    page,
  }) => {});
});
