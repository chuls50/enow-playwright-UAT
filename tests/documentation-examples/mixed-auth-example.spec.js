/**
 * Example: Mixed Authentication Patterns
 * Shows different ways to use authentication in the same test file
 */

import { test, expect } from '@playwright/test';
import { useRole, ROLES, createAuthenticatedContext, verifyAuthFiles } from '../utils/auth-helpers.js';

// Verify auth files exist before running any tests
test.beforeAll(async () => {
  verifyAuthFiles(); // Checks all roles by default
});

test.describe('Mixed Authentication Examples', () => {
  
  // Test 1: Use test.use() for single role
  test.describe('Admin-only tests', () => {
    test.use(useRole(ROLES.ADMIN));

    test('admin dashboard access', async ({ page }) => {
      await page.goto(process.env.UAT_URL);
      // Already authenticated as admin
      await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
    });
  });

  // Test 2: Create context manually for specific test
  test('patient profile update', async ({ browser }) => {
    const patientContext = await createAuthenticatedContext(browser, ROLES.PATIENT);
    const page = await patientContext.newPage();

    try {
      await page.goto(process.env.UAT_URL);
      await page.getByRole('link', { name: 'My Profile' }).click();
      
      // Update profile
      await page.getByLabel('Phone Number').fill('555-1234');
      await page.getByRole('button', { name: 'Save' }).click();
      
      await expect(page.getByText('Profile updated')).toBeVisible();
      
    } finally {
      await patientContext.close();
    }
  });

  // Test 3: Different roles in different describe blocks
  test.describe('Provider workflow', () => {
    test.use(useRole(ROLES.PROVIDER));

    test('provider can view patient list', async ({ page }) => {
      await page.goto(process.env.UAT_URL);
      await expect(page.getByRole('heading', { name: 'Patient List' })).toBeVisible();
    });
  });

  test.describe('Coordinator workflow', () => {
    test.use(useRole(ROLES.COORDINATOR));

    test('coordinator can manage schedules', async ({ page }) => {
      await page.goto(process.env.UAT_URL);
      await expect(page.getByRole('heading', { name: 'Schedule Management' })).toBeVisible();
    });
  });
});