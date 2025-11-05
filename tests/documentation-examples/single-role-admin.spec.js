import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../utils/auth-helpers.js';

// Single-role test example - all tests in this file will use admin authentication
test.use(useRole(ROLES.ADMIN));

test.describe('Admin Dashboard Tests', () => {
  test('admin can access dashboard', async ({ page }) => {
    // Since we're using admin auth, we can go directly to admin areas
    await page.goto(process.env.UAT_URL + '/admin/dashboard');

    // Test admin-specific functionality
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Add your admin-specific test logic here
    console.log('✅ Admin dashboard test completed');
  });

  test('admin can manage users', async ({ page }) => {
    await page.goto(process.env.UAT_URL + '/admin/users');

    // Test admin user management functionality
    await expect(page).toHaveURL(/.*\/admin\/users/);

    console.log('✅ Admin user management test completed');
  });
});
