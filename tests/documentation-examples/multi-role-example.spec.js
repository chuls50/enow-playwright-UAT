/**
 * Example: Multi-Role Test
 * Demonstrates how to use multiple authentication states within a single test
 */

import { test, expect } from '@playwright/test';
import { createMultiRoleContexts, ROLES } from '../utils/auth-helpers.js';

test.describe('Multi-Role Appointment Tests', () => {
  test('patient books appointment and provider accepts', async ({ browser }) => {
    // Create contexts for both patient and provider
    const contexts = await createMultiRoleContexts(browser, [ROLES.PATIENT, ROLES.PROVIDER]);
    
    // Create pages for each role
    const patientPage = await contexts[ROLES.PATIENT].newPage();
    const providerPage = await contexts[ROLES.PROVIDER].newPage();

    try {
      // Patient actions: Book an appointment
      await patientPage.goto(process.env.UAT_URL);
      await patientPage.getByRole('button', { name: 'Book Appointment' }).click();
      
      // Fill appointment details
      await patientPage.getByLabel('Appointment Type').selectOption('consultation');
      await patientPage.getByLabel('Date').fill('2025-12-01');
      await patientPage.getByRole('button', { name: 'Submit' }).click();
      
      // Verify patient sees confirmation
      await expect(patientPage.getByText('Appointment requested')).toBeVisible();

      // Provider actions: Accept the appointment
      await providerPage.goto(process.env.UAT_URL);
      await providerPage.getByRole('link', { name: 'Appointments' }).click();
      
      // Find and accept the appointment
      await providerPage.getByRole('button', { name: 'Accept' }).first().click();
      await expect(providerPage.getByText('Appointment accepted')).toBeVisible();

      // Verify patient sees the accepted status
      await patientPage.reload();
      await expect(patientPage.getByText('Appointment confirmed')).toBeVisible();

    } finally {
      // Clean up contexts
      await contexts[ROLES.PATIENT].close();
      await contexts[ROLES.PROVIDER].close();
    }
  });

  test('coordinator manages appointment between patient and provider', async ({ browser }) => {
    // Example with three roles
    const contexts = await createMultiRoleContexts(browser, [
      ROLES.PATIENT, 
      ROLES.PROVIDER, 
      ROLES.COORDINATOR
    ]);
    
    const patientPage = await contexts[ROLES.PATIENT].newPage();
    const providerPage = await contexts[ROLES.PROVIDER].newPage();
    const coordinatorPage = await contexts[ROLES.COORDINATOR].newPage();

    try {
      // Patient requests appointment
      await patientPage.goto(process.env.UAT_URL);
      // ... patient logic

      // Coordinator reviews and assigns to provider
      await coordinatorPage.goto(process.env.UAT_URL);
      // ... coordinator logic

      // Provider sees assigned appointment
      await providerPage.goto(process.env.UAT_URL);
      // ... provider logic

      // Your test assertions here

    } finally {
      // Clean up all contexts
      await contexts[ROLES.PATIENT].close();
      await contexts[ROLES.PROVIDER].close();
      await contexts[ROLES.COORDINATOR].close();
    }
  });
});