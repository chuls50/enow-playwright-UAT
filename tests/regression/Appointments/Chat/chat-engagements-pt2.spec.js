import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Multi-User @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Chat Screen UI After Initiating a Transient Chat @[114289] @multi-user @functional', async ({ page }) => {});

  test.skip('Send a Message in Transient Chat @[114290] @multi-user @functional', async ({ page }) => {});

  test.skip('Upload a Document in Chat @[114292] @multi-user @functional', async ({ page }) => {});

  test.skip('Check Leave Session Option @[114293] @multi-user @functional', async ({ page }) => {});

  test.skip('Check End Session for All Participants @[114294] @multi-user @functional', async ({ page }) => {});

  test.skip('Check Send Message Without Text @[114295] @multi-user @functional', async ({ page }) => {});

  test.skip('Check Attempt Upload Unsupported File Type @[114296] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Adding Participants to Transient Chat Meeting @[118566] @multi-user @functional', async ({ page }) => {});
});
