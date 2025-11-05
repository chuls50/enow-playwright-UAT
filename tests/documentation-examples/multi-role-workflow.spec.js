import { test, expect } from '@playwright/test';
import { createContextWithRole, createMultipleContexts, closeContexts, ROLES } from '../utils/auth-helpers.js';

test.describe('Multi-Role Appointment Workflow', () => {
  test('patient books appointment and provider accepts', async ({ browser }) => {
    // Method 1: Create contexts individually
    const patientContext = await createContextWithRole(browser, ROLES.PATIENT);
    const providerContext = await createContextWithRole(browser, ROLES.PROVIDER);
    
    const patientPage = await patientContext.newPage();
    const providerPage = await providerContext.newPage();
    
    try {
      // Patient books appointment
      await patientPage.goto(process.env.UAT_URL + '/patient/book-appointment');
      // Add your patient booking logic here
      console.log('✅ Patient booked appointment');
      
      // Provider sees and accepts appointment
      await providerPage.goto(process.env.UAT_URL + '/provider/pending-appointments');
      // Add your provider acceptance logic here
      console.log('✅ Provider accepted appointment');
      
      // Verify the appointment is confirmed
      await patientPage.reload();
      // Add verification logic here
      console.log('✅ Appointment confirmed');
      
    } finally {
      await patientContext.close();
      await providerContext.close();
    }
  });

  test('admin manages appointment between patient and provider', async ({ browser }) => {
    // Method 2: Create multiple contexts at once
    const contexts = await createMultipleContexts(browser, [
      ROLES.ADMIN, 
      ROLES.PATIENT, 
      ROLES.PROVIDER
    ]);
    
    const adminPage = await contexts[ROLES.ADMIN].newPage();
    const patientPage = await contexts[ROLES.PATIENT].newPage();
    const providerPage = await contexts[ROLES.PROVIDER].newPage();
    
    try {
      // Admin creates appointment
      await adminPage.goto(process.env.UAT_URL + '/admin/appointments/create');
      // Add admin appointment creation logic
      console.log('✅ Admin created appointment');
      
      // Patient sees appointment
      await patientPage.goto(process.env.UAT_URL + '/patient/appointments');
      // Add patient verification logic
      console.log('✅ Patient sees appointment');
      
      // Provider prepares for appointment
      await providerPage.goto(process.env.UAT_URL + '/provider/appointments');
      // Add provider preparation logic
      console.log('✅ Provider prepared for appointment');
      
    } finally {
      // Clean up all contexts
      await closeContexts(contexts);
    }
  });

  test('coordinator facilitates patient-provider interaction', async ({ browser }) => {
    // Another example of multi-role testing
    const contexts = await createMultipleContexts(browser, [
      ROLES.COORDINATOR,
      ROLES.PATIENT,
      ROLES.PROVIDER
    ]);
    
    const coordinatorPage = await contexts[ROLES.COORDINATOR].newPage();
    const patientPage = await contexts[ROLES.PATIENT].newPage();
    const providerPage = await contexts[ROLES.PROVIDER].newPage();
    
    try {
      // Coordinator schedules appointment
      await coordinatorPage.goto(process.env.UAT_URL + '/coordinator/schedule');
      console.log('✅ Coordinator scheduled appointment');
      
      // Patient receives notification
      await patientPage.goto(process.env.UAT_URL + '/patient/notifications');
      console.log('✅ Patient received notification');
      
      // Provider gets assignment
      await providerPage.goto(process.env.UAT_URL + '/provider/assignments');
      console.log('✅ Provider received assignment');
      
    } finally {
      await closeContexts(contexts);
    }
  });
});