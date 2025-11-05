/**
 * Example: Single Role Test
 * Demonstrates how to use a single authentication state for all tests in a file
 */

import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../utils/auth-helpers.js';

// Use admin role for all tests in this file
test.use(useRole(ROLES.ADMIN));

test.describe('Admin Dashboard Tests', () => {
  test('admin can access dashboard', async ({ page }) => {
    // Page will automatically have admin authentication state
    await page.goto(process.env.UAT_URL);
    
    // Your test logic here - already logged in as admin
    await expect(page).toHaveTitle(/Dashboard/);
  });

  test('admin can view user management', async ({ page }) => {
    await page.goto(process.env.UAT_URL);
    
    // Navigate to user management (example)
    await page.getByRole('link', { name: 'Users' }).click();
    
    // Your assertions here
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });
});