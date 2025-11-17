import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('User Data Entry Field Validations @regression', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Names Text Entry @[111196] @functional', async ({ page }) => {});

  test.skip('Verify Password Text Entry @[111197] @functional', async ({ page }) => {});

  test.skip('Verify Phone Number Text Entry @[111198] @functional', async ({ page }) => {});

  test.skip('Verify Date Text Entry @[111199] @functional', async ({ page }) => {});

  test.skip('Verify Email Text Entry @[111201] @functional', async ({ page }) => {});
});
