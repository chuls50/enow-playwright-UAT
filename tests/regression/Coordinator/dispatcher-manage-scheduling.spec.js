import { test, expect } from '@playwright/test';
import { BasePage } from '../../models/base-page.js';

test.describe('Coordinator @regression @e2e', () => {
  let basePage;

  test.beforeAll(async ({ page }) => {
    basePage = new BasePage(page);
  });

  test.skip('Verify the components of the appointment card in the "On demand requests" column on the "Dispatcher" screen @[112459] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the components of the appointment card in the "Scheduled requests" column on the "Dispatcher" screen @[112460] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the components of the "Dispatcher" screen @[112461] @multi-user @functional', async ({ page }) => {});
  test.skip('Verify the components of the "On demand requests" slide out on the "Dispatcher" screen @[112462] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the components of the "Scheduled request details" slide out on the "Dispatcher" screen @[112463] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the components of the "On demand requests" column on the "Dispatcher" screen @[112464] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the components of the "Scheduled requests" column on the "Dispatcher" screen @[112465] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Approval of an On demand appointment in the appointment card in the "On demand requests" column @[112466] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Approval of an Scheduled appointment in the appointment card in the "Scheduled requests" column @[112467] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Cancellation of an On demand appointment in the appointment card in the "On demand requests" column @[112468] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify the Cancellation of an Scheduled appointment in the appointment card in the "Scheduled requests" column @[112469] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Appointment Approval Cancellation in On-Demand Requests Popup @[112470] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Appointment Approval Cancellation in Scheduled Requests Popup @[112471] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Manual Payment Transfer Cancellation in Scheduled Requests Popup @[112472] @multi-user @functional', async ({
    page,
  }) => {});

  test.skip('Verify Switching an On-Demand Appointment to Private Payment @[112473] @multi-user @functional', async ({ page }) => {});
  test.skip('Verify Switching a Scheduled Appointment to Private Payment @[112474] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Sorting Dropdown for On-Demand Request Appointments @[112475] @multi-user @functional', async ({ page }) => {});

  test.skip('Verify Sorting Dropdown for Scheduled Request Appointments @[112476] @multi-user @functional', async ({ page }) => {});
});
