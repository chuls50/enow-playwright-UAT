import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../utils/auth-helpers.js';

// Single-role test example - all tests in this file will use patient authentication
test.use(useRole(ROLES.PATIENT));

test.describe('Patient Portal Tests', () => {
  test('patient can view appointments', async ({ page }) => {
    // Since we're using patient auth, we can go directly to patient areas
    await page.goto(process.env.UAT_URL + '/patient/appointments');
    
    // Test patient-specific functionality
    await expect(page).toHaveURL(/.*\/patient\/appointments/);
    
    console.log('✅ Patient appointments test completed');
  });

  test('patient can update profile', async ({ page }) => {
    await page.goto(process.env.UAT_URL + '/patient/profile');
    
    // Test patient profile functionality
    await expect(page).toHaveURL(/.*\/patient\/profile/);
    
    console.log('✅ Patient profile test completed');
  });
});