import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Multi-User @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify separate tab opens for video call appointment @[118091] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify separate tab opens for chat appointment @[118092] @multi-user @functional', async ({ page }) => {});
});
