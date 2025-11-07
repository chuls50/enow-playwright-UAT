import { test, expect } from '@playwright/test';
import { InstitutionSettingsInsurancePage } from '../../../models/pages/admin/institution-settings-insurance.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Define Payments - Total Tests 11 (including 1 skipped test)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let insurancePage;

  test.beforeEach(async ({ page }) => {
    insurancePage = new InstitutionSettingsInsurancePage(page);
    await insurancePage.gotoInsuranceSettings();
  });

  test('Verify Payments Section Display @[112175] @admin @ui', async ({ page }) => {
    // Enable self payment to reveal all fields
    await insurancePage.enableSelfPaymentIfNeeded();

    // Verify Payments Setup section fields are visible
    await expect(insurancePage.paymentSetupSection).toBeVisible();
    await expect(insurancePage.selfPaymentLabel).toBeVisible();
    await expect(insurancePage.selectPaymentProcessorLabel).toBeVisible();
    await expect(insurancePage.currencyLabel).toBeVisible();
    await expect(insurancePage.authorizationKeyLabel).toBeVisible();
    await expect(insurancePage.editAccountButton).toBeVisible();
    await expect(insurancePage.paymentReportingButton).toBeVisible();

    // Verify Patient Payment Reminders section and buttons
    await expect(insurancePage.patientPaymentRemindersLabel).toBeVisible();
    await expect(insurancePage.serviceRemindersLabel).toBeVisible();
    await expect(insurancePage.intervalsLabel).toBeVisible();
    await expect(insurancePage.saveChangesButton).toBeVisible();
    await expect(insurancePage.cancelButton).toBeVisible();
  });

  test('Verify Payment Processor Selection @[112176] @admin @functional', async ({ page }) => {
    // Enable self payment and open payment processor dropdown
    await insurancePage.enableSelfPaymentIfNeeded();

    // open payment processor dropdown
    await insurancePage.selectPaymentProcessorDropdown.click();

    // Verify dropdown items are visible
    await expect(page.getByTestId('items-wrapper')).toBeVisible();

    // Select Stripe processor and verify selection
    await insurancePage.stripeProcessorItem.click();

    // Verify save is enabled
    await expect(insurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Currency Selection @[112177] @admin @functional', async ({ page }) => {
    // Enable self payment and open currency dropdown
    await insurancePage.enableSelfPaymentIfNeeded();

    // open currency dropdown
    await insurancePage.currencyDropdown.click();
    await expect(insurancePage.itemsWrapper).toBeVisible();

    // Select payment processor dropdown and verify selection
    await insurancePage.azulProcessorItem.click();
    await insurancePage.stripeProcessorItem.click();

    // Open currency dropdown again
    await insurancePage.currencyDropdown.click();

    // Verify dropdown items are visible
    await expect(insurancePage.itemsWrapper).toBeVisible();
  });

  test('Verify Merchant ID and Authorization Key Fields @[112178] @admin @functional', async ({ page }) => {
    // Enable self payment and open currency dropdown
    await insurancePage.enableSelfPaymentIfNeeded();

    // Verify all required Azul fields are visible and save button is enabled
    await expect(insurancePage.merchantIdLabel).toBeVisible();
    await expect(insurancePage.merchantIdInput).toBeVisible();
    await insurancePage.merchantIdInput.fill('123-456-789');
    await expect(insurancePage.merchantNameLabel).toBeVisible();
    await expect(insurancePage.merchantNameInput).toBeVisible();
    await insurancePage.merchantNameInput.fill('Test Merchant Name');
    await expect(insurancePage.authorizationKeyLabel).toBeVisible();
    await expect(insurancePage.authorizationKeyInput).toBeVisible();
    await insurancePage.authorizationKeyInput.fill('AB-CD-EF-GH');
    await expect(insurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Edit Account and Payment Reporting buttons @[112179] @admin @functional', async ({ page }) => {
    // Verify Edit Account and Payment Reporting buttons are visible and enabled
    await expect(insurancePage.editAccountButton).toBeVisible();
    await expect(insurancePage.editAccountButton).toBeEnabled();
    await expect(insurancePage.paymentReportingButton).toBeVisible();
    await expect(insurancePage.paymentReportingButton).toBeEnabled();

    // Click the edit button
    await insurancePage.editAccountButton.click();

    //verify the new tab URL contains https://www.azul.com.do/
    const [newPage] = await Promise.all([page.context().waitForEvent('page')]);
    await expect(newPage).toHaveURL(/https:\/\/www\.azul\.com\.do\//);
    await newPage.close();

    // Click the payment reporting button
    await insurancePage.paymentReportingButton.click();

    // Verify the new tab URL contains https://www.azul.com.do/
    const [reportingPage] = await Promise.all([page.context().waitForEvent('page')]);
    await expect(reportingPage).toHaveURL(/https:\/\/www\.azul\.com\.do\//);
    await reportingPage.close();
  });

  test('Verify Patient Payment Reminders Toggle Functionality @[112180] @admin @functional', async ({ page }) => {
    // Verify payment reminders toggle is visible and enabled
    await expect(insurancePage.patientPaymentRemindersLabel).toBeVisible();
    await expect(insurancePage.patientPaymentRemindersToggle).toBeVisible();
    await expect(insurancePage.patientPaymentRemindersToggle).toBeEnabled();

    // Toggle payment reminders and verify save button is enabled
    await insurancePage.patientPaymentRemindersToggle.click();
    await expect(insurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Service Reminder Selection @[112181] @admin @functional', async ({ page }) => {
    // Enable 'Patient Payment Reminders' if not already enabled
    await insurancePage.enablePatientPaymentRemindersIfNeeded();
    await expect(insurancePage.serviceRemindersLabel).toBeVisible();
    await insurancePage.serviceReminderDropdown.click();
    await expect(insurancePage.itemsWrapper).toBeVisible();
    await insurancePage.serviceReminderDropdownSelection.click();
  });

  test('Verify Intervals Selection @[112182] @admin @functional', async ({ page }) => {
    // Enable 'Patient Payment Reminders' if not already enabled
    await insurancePage.enablePatientPaymentRemindersIfNeeded();
    await expect(insurancePage.intervalsLabel).toBeVisible();
    await insurancePage.intervalsDropdown.click();
    await expect(insurancePage.itemsWrapper).toBeVisible();
    await insurancePage.intervalsDropdownSelection.click();
    await expect(insurancePage.saveChangesButton).toBeEnabled();
  });

  test('Verify Saving Valid Payment Configuration @[112183] @admin @functional', async ({ page }) => {
    // Enable self payment and open currency dropdown
    await insurancePage.enableSelfPaymentIfNeeded();

    // switch to stripe processor
    await insurancePage.selectPaymentProcessor('Stripe');

    // Verify save is enabled and click save
    await expect(insurancePage.saveChangesButton).toBeEnabled();
    await insurancePage.saveChangesButton.click();

    await page.waitForTimeout(5000); // Wait for save to process

    // change bnack to azul processor
    await insurancePage.selectPaymentProcessor('Azul');

    // Verify save is enabled and click save
    await expect(insurancePage.saveChangesButton).toBeEnabled();
    await insurancePage.saveChangesButton.click();
    await page.waitForTimeout(5000); // Wait for save to process
  });

  test('[Negative] Verify Invalid Merchant ID and Authorization Key Fields @[112184]', async ({ page }) => {
    // Test empty Merchant ID validation
    await insurancePage.enableSelfPaymentIfNeeded();
    await insurancePage.merchantIdInput.fill('');
    await insurancePage.saveChangesButton.click();
    await expect(insurancePage.errorMessage).toBeVisible();

    // Test empty Authorization Key validation
    await insurancePage.authorizationKeyInput.fill('');
    await expect(insurancePage.errorMessage).toBeVisible();

    // Test empty Merchant Name validation
    await insurancePage.merchantNameInput.fill('');
    await expect(insurancePage.errorMessage).toBeVisible();
  });

  test('[Negative] Verify Save changes with empty required fields @[112185]', async ({ page }) => {
    // Test empty Merchant ID validation
    await insurancePage.enableSelfPaymentIfNeeded();
    await insurancePage.merchantIdInput.fill('');
    await insurancePage.saveChangesButton.click();
    await expect(insurancePage.errorMessage).toBeVisible();

    // Test empty Authorization Key validation
    await insurancePage.authorizationKeyInput.fill('');
    await expect(insurancePage.errorMessage).toBeVisible();

    // Test empty Merchant Name validation
    await insurancePage.merchantNameInput.fill('');
    await expect(insurancePage.errorMessage).toBeVisible();
    await insurancePage.authorizationKeyInput.fill('');

    // Attempt to save and verify error message is displayed
    await insurancePage.saveChangesButton.click();
    await expect(insurancePage.errorMessageToast).toBeVisible();
  });
});
