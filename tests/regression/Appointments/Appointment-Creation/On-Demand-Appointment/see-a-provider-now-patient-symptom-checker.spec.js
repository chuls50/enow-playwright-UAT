import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../../models/pages/patient/patient-dashboard.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// See a Provider Now Symptom Checker - Total tests 26 (including 13 skipped)

test.describe('Patient @regression', () => {
  test.use(useRole(ROLES.PATIENT));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test('Verify "See a Provider Now" Symptom Checker Screen is Displayed Correctly @[112075] @patient @ui', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Verify your appointment section is displayed
    await expect(page.getByText('See a provider now')).toBeVisible();
    await expect(page.getByText('Service', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Select service' })).toBeVisible();
    await expect(page.getByText('Appointment type')).toBeVisible();
    await expect(page.getByText('Video')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change type' })).toBeVisible();
    await expect(page.getByText('Duration', { exact: true })).toBeVisible();
    await expect(page.getByText('min')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Change duration' })).toBeVisible();

    // Verify insurance section is displayed
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'Payment Required' }).check();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Insurance or Self-Pay' })).toBeVisible();
    await expect(page.getByText('Do you have insurance for')).toBeVisible();
    await expect(page.getByText('Use my insurance for this')).toBeVisible();
    await expect(page.getByText('Insurance', { exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Select insurance' })).toBeVisible();
    await page.getByTestId('dropdown-field').click();
    await page.getByTestId('item Atena 0').click();

    // Verify Attachments section is displayed
    await expect(page.getByRole('heading', { name: 'Attachments' })).toBeVisible();
    await expect(page.getByText('Upload any relevant')).toBeVisible();
    await expect(page.getByText('Upload filesChoose files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();

    // Verify Notice of consent section is displayed
    const noticeOfConsentCheckbox = page.locator('.sc-cxgKzJ');
    await expect(noticeOfConsentCheckbox).toBeVisible();
    await expect(page.getByText('I have read the Notice of')).toBeVisible();

    // Verify Click here for support link is displayed
    await expect(page.getByText('Experiencing issues with your')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Click here for support.' })).toBeVisible();
  });

  test('Verify Select Service Link Navigates to Select Service Screen @[112078] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Click on Select Service link
    await page.getByRole('link', { name: 'Select service' }).click();

    // Verify navigation to Select Service screen
    await expect(page.locator('div').filter({ hasText: /^Change service$/ })).toBeVisible();
    await expect(page.getByText('Search')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search by service name' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  });

  test('Verify Change Type Link Navigates to Change Type Screen @[112079] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'General Practice' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Click on Change Type link
    await page.getByRole('link', { name: 'Change type' }).click();
    await expect(page.getByTestId('radio-group').getByText('Type')).toBeVisible();
    await expect(page.getByTestId('radio-group').getByText('Duration')).toBeVisible();
  });

  test('Verify Change Duration Link Navigates to Duration Selection Screen @[112080] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'Multiple Options' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Click on Change Duration
    await page.getByRole('link', { name: 'Change duration' }).click();
    await expect(page.getByTestId('radio-group').getByText('Duration')).toBeVisible();
    await expect(page.getByTestId('radio-group').getByText('15 min')).toBeVisible();
    await expect(page.getByText('30 min')).toBeVisible();
  });

  test('Verify Selecting "Yes, I`m Insured" functionality @[112081] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'Payment Required' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify Yes, I'm insured flow
    await page.getByRole('textbox', { name: 'Select insurance' }).click();
    await page.getByTestId('item Atena 0').click();
    await expect(page.getByTestId('item Atena 0')).toBeVisible();
  });

  test('Verify Selecting "No, continue paying private" functionality @[112082] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'Payment Required' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify No, continue paying private flow
    await page.getByRole('radio', { name: 'I will pay for this service' }).check();
    await expect(page.getByTestId('item Atena 0')).not.toBeVisible();
  });

  test('Verify File Upload via "Choose Files" Link @[112083] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'General Practice' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Upload a file via Choose files link
    const filePath = 'tests/images/hieroglyphics-10.jpg';
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('link', { name: 'Choose files' }).click(), // Opens the file chooser
    ]);
    await fileChooser.setFiles(filePath);
    await page.getByRole('img', { name: 'document preview' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('img', { name: 'document preview' })).toBeVisible();
  });

  test('[Negative] - Check "Request on Demand Care" Button State @[112084] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'Payment Required' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Leave insurance fields empty and verify Request on Demand Care button is disabled
    const requestOnDemandCareButton = page.getByRole('button', { name: 'Request on Demand Care' });
    await expect(requestOnDemandCareButton).toBeDisabled();

    // Click the Notice of Consent checkbox and verify Request on Demand Care button is enabled
    const noticeOfConsentCheckbox = page.locator('.sc-cxgKzJ');
    await noticeOfConsentCheckbox.click();
    await expect(requestOnDemandCareButton).toBeEnabled();

    // Attempt to save without selecting insurance and verify error message
    await requestOnDemandCareButton.click();
    await expect(page.getByText('Please select your insurance')).toBeVisible();
  });

  test('Verify "Request on Demand Care" Button Success Path @[112085] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'General Practice' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Accept Notice of Consent and click Request on Demand Care button
    const noticeOfConsentCheckbox = page.locator('.sc-cxgKzJ');
    await noticeOfConsentCheckbox.click();
    const requestOnDemandCareButton = page.getByRole('button', { name: 'Request on Demand Care' });
    await requestOnDemandCareButton.click();

    // Verify navigation to Appointment Confirmation screen
    await expect(page.getByRole('heading', { name: 'Session requested' })).toBeVisible();
    await expect(page.getByText('Session overview')).toBeVisible();
    await expect(page.getByText('Session type')).toBeVisible();
    await expect(page.getByText('Service')).toBeVisible();
    await expect(page.getByText('Please wait while we connect')).toBeVisible();

    // Cancel Request
    await expect(page.getByRole('button', { name: 'Cancel request' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel request' }).click();
  });

  test('Verify Required Field Validations on `Request on Demand Care` Button Click @[112087] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select Service before changing type
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'Payment Required' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Leave insurance fields empty and verify Request on Demand Care button is disabled
    const requestOnDemandCareButton = page.getByRole('button', { name: 'Request on Demand Care' });
    await expect(requestOnDemandCareButton).toBeDisabled();

    // Click the Notice of Consent checkbox and verify Request on Demand Care button is enabled
    const noticeOfConsentCheckbox = page.locator('.sc-cxgKzJ');
    await noticeOfConsentCheckbox.click();
    await expect(requestOnDemandCareButton).toBeEnabled();

    // Attempt to save without selecting insurance and verify error message
    await requestOnDemandCareButton.click();
    await expect(page.getByText('Please select your insurance')).toBeVisible();

    // Deselct the Notice of Consent checkbox and verify Request on Demand Care button is disabled again
    await page.getByTestId('icon-Check').click();
    await expect(requestOnDemandCareButton).toBeDisabled();
    await expect(page.getByText('You must agree to the provision of telehealth services.')).toBeVisible();
  });

  test('Verify Notice of Consent Document Opens on Link Click @[113879] @patient @functional', async ({ page }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Click on Notice of Consent link
    await page.getByRole('link', { name: 'Notice of Consent' }).click();
    await expect(page.getByRole('dialog').getByText('Notice of Consent')).toBeVisible();

    // Close the Notice of Consent dialog
    await page.getByRole('button', { name: 'XClose' }).click();
    await expect(page.getByRole('dialog').getByText('Notice of Consent')).not.toBeVisible();
  });

  test('Verify Support Contact Information Displays on Clicking “Click here for support” @[113880] @patient @functional', async ({
    page,
  }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Click on Support Link
    await page.getByRole('link', { name: 'Click here for support' }).click();

    // Verify modal
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Need Help?')).toBeVisible();
    await expect(page.getByText('Please contact your')).toBeVisible();
    await expect(page.getByText('Phone number')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
  });

  test('Verify Cancel Request Button Cancels Appointment and Returns User to Dashboard @[114198] @patient @functional', async ({
    page,
  }) => {
    // Click on "See a provider now" button
    await dashboardPage.clickSeeProviderNow();

    // Skip manual symptom checker if displayed
    await dashboardPage.skipManualSymptomChecker();

    // Select General Practice Service before requesting on demand care
    await page.getByRole('link', { name: 'Select service' }).click();
    await page.getByRole('radio', { name: 'General Practice' }).check();
    await page.getByRole('button', { name: 'Save' }).click();

    // Click on Notice of Consent checkbox
    const noticeOfConsentCheckbox = page.locator('.sc-cxgKzJ');
    await noticeOfConsentCheckbox.click();

    // Click Request on Demand Care button
    await page.getByRole('button', { name: 'Request on Demand Care' }).click();

    // Wait for URL to contain /see-provider-now-confirmed
    await page.waitForURL(/.*\/see-provider-now-confirmed/);
    await expect(page).toHaveURL(/.*\/see-provider-now-confirmed/);

    // Validate Cancel Request button
    const cancelRequestButton = page.getByRole('button', { name: 'Cancel request' });
    await expect(cancelRequestButton).toBeVisible();
    await expect(cancelRequestButton).toBeEnabled();
    await cancelRequestButton.click();

    // Verify URL is redirected to dashboard
    await page.waitForURL(/.*\/dashboard/);
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

test.describe('Multi-User @regression', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoPatientDashboard();
  });

  test.skip('Verify insurance-based appointment is approved from Dispatcher screen @[114155] @multi-user @functional', async () => {});

  test.skip('[Negative]  Verify insurance-based appointment is declined from Dispatcher screen @[114156] @multi-user @functional', async () => {});

  test.skip('[Negative] Verify “Approve with Co-pay” Payment Failure Flow When Dispatcher Responds with Co-pay Request @[114158] @multi-user @functional', async () => {});

  test.skip('[Negative] Verify “Approve with Co-pay” Payment decline Flow When Dispatcher Responds with Co-pay Request @[114159] @multi-user @functional', async () => {});

  test.skip('[Negative] Verify “Switch to Pay” Payment decline Flow When Dispatcher Responds with Payment Request for Service Fee @[114160] @multi-user @functional', async () => {});

  test.skip('[Negative] Verify “Switch to Pay” Payment Failure Flow When Dispatcher Responds with Payment Request for Service Fee @[114161] @multi-user @functional', async () => {});

  test.skip('[Negative] Verify Appointment Cancellation with Payments off flow @[114162] @multi-user @functional', async () => {});

  test.skip('Verify “Approve with Co-pay” Flow When Dispatcher Responds with Co-pay Request @[114163] @multi-user @functional', async () => {});

  test.skip('Verify “Switch to Pay” Flow When Dispatcher Responds with Payment Request for Service Fee @[114164] @multi-user @functional', async () => {});

  test.skip('Verify On demand Appointment creation with Dispatcher approval @[114165] @multi-user @functional', async () => {});

  test.skip('Verify insurance based appointment creation with Dispatcher OFF @[114167] @multi-user @functional', async () => {});

  test.skip('Verify private pay appointment creation with Dispatcher OFF @[114195] @multi-user @functional', async () => {});

  test.skip('[Negative] Verify Dispatcher Decline After Successful Payment @[114196] @multi-user @functional', async () => {});
});
