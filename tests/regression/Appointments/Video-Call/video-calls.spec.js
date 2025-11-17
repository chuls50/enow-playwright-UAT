import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Multi-User @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify Launch of Pre-Call Setup Screen from Dashboard @[113642] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Device Toggle and Selection in Pre-Call Setup @[113643] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Navigation from Pre-Call to Video Call Screen @[113644] @multi-user @functional', async ({ page }) => {});

  test.skip('Validate End Call Functionality for Patients @[113645] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify End Call for Options for Providers @[113646] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify In-Call Chat Functionality @[113647] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify In-Call Access to Symptoms Tab for Patients @[113648] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify In-Call Access to Symptoms and Visit Notes Tabs for Providers @[113649] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify UI Elements on Active Call Screen for Patient @[113650] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify UI Elements on Active Call Screen for Providers @[113652] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify "Add Visit Note" and "Add Instructions" Buttons for Provider @[113686] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Visit Notes and Discharge Instructions for Provider @[113689] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Symptoms Button Functionality @[113690] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Show Documents Button Functionality @[113691] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Add Document Functionality @[113692] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Session Details for Patient @[114438] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify separate tab opens for Video appointment @[117665] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify popup warning if browser blocks new tab for video @[117667] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Available toggle is turned off for Provider after joining session @[117669] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify end-of-session message after session ends @[117670] @multi-user @functional', async ({ page }) => {});
});
