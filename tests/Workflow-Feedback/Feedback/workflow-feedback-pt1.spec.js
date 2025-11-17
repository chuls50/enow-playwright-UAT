import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('Workflow Feedback Part 1 @regression', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify "Availability" Filter Removed From "Change Provider" Screen @[117628] @functional', async ({ page }) => {});
});
