import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('Translations Part 1 @regression', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify product translated in Spanish @[118253] @functional', async ({ page }) => {});

  test.skip('Verify product translated in Portuguese @[118392] @functional', async ({ page }) => {});
});
