import { test, expect } from '@playwright/test';
import { BasePage } from '../models/base-page.js';

test.describe('Coordinator @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify the additional components of the "Scheduled request details" slide out @[118054] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the additional components of the "On demand request details" slide out @[118055] @multi-user @functional', async ({
    page,
  }) => {});
});
