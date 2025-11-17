import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Multi-User @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Valid Document Upload in Chat @[114200] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Verify Upload Fails for Unsupported File Type @[114203] @multi-user @functional', async ({ page }) => {});

  test.skip('[Negative] Verify Upload Fails When File Size Exceeds Limit @[114211] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify that uploaded attachment is added Attachments tab @[118578] @multi-user @functional', async ({ page }) => {});
});
