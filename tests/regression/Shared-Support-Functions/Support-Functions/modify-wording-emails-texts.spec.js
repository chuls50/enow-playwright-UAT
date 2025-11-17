import { test, expect } from '@playwright/test';
import { BasePage } from '../../../models/base-page.js';

test.describe('Modify Wording Emails Texts @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify patient receives email invitation from Institution and is able to access registration page @[118880] @functional', async ({
    page,
  }) => {});

  test.skip('Verify institution user being invited by an institution to register @[118881] @functional', async ({ page }) => {});

  test.skip('Verify user receives reset password email @[118882] @functional', async ({ page }) => {});

  test.skip('Verify provider receives "New Appointment Request" email with correct details @[118918] @functional', async ({ page }) => {});

  test.skip('Verify patient receives "Appointment Request Confirmed" email with correct details @[118919] @functional', async ({
    page,
  }) => {});

  test.skip('Verify patient receives "Appointment Request Declined" email with correct details @[118920] @functional', async ({
    page,
  }) => {});

  test.skip('Verify patient receives "Appointment Request Cancelled" email with correct details @[118921] @functional', async ({
    page,
  }) => {});

  test.skip('Verify user receives "Appointment Change Request" email with correct details @[118922] @functional', async ({ page }) => {});

  test.skip('Verify user receives "Appointment Change Request Confirmed" email with correct details @[118923] @functional', async ({
    page,
  }) => {});

  test.skip('Verify user receives "Appointment Change Request Declined" email with correct details @[118924] @functional', async ({
    page,
  }) => {});

  test.skip('Verify user receives "Appointment Reminder" email with correct details @[118925] @functional', async ({ page }) => {});

  test.skip('Verify provider receives "Patient Joined Appointment" email with correct details @[118926] @functional', async ({
    page,
  }) => {});

  test.skip('Verify patient receives "Payment Reminder" email with correct appointment details @[118927] @functional', async ({
    page,
  }) => {});

  test.skip('Verify user receives "Invite to Meeting in Progress" email with correct meeting details and join link @[118956] @functional', async ({
    page,
  }) => {});

  test.skip('Verify user receives "Invite to Scheduled Meeting" email with correct meeting details and join link @[118957] @functional', async ({
    page,
  }) => {});

  test.skip('Verify "Your [Institution Name] Device ID has been created" email content and formatting @[118959] @functional', async ({
    page,
  }) => {});
});
