import { test, expect } from '@playwright/test';
import { InstitutionSettingsConfigurationPage } from '../../../models/pages/admin/institution-settings-configuration.page.js';
import { useRole, ROLES } from '../../../utils/auth-helpers.js';

// Admin Configuration Settings - Total tests 10 (including 3 skipped)

test.describe('Admin @regression', () => {
  test.use(useRole(ROLES.ADMIN));
  let configPage;

  test.beforeEach(async ({ page }) => {
    configPage = new InstitutionSettingsConfigurationPage(page);
    await configPage.gotoInstitutionSettingsConfiguration();
  });

  test('Verify Default settings in Configuration Tab on Institution Settings Screen @[111331] @admin @ui', async () => {
    // Verify main page elements are visible
    await expect(configPage.heading).toBeVisible();

    // Verify enforce country setting elements
    await expect(configPage.enforceCountryText).toBeVisible();
    await expect(configPage.enforceCountryToggle).toBeVisible();

    // Verify provider contacting configuration elements
    await expect(configPage.numberOfTimesToContactText).toBeVisible();
    await expect(configPage.numberOfTimesToContactInput).toBeVisible();
    await expect(configPage.numberOfMinutesText).toBeVisible();
    await expect(configPage.numberOfMinutesInput).toBeVisible();

    // Verify additional toggle options
    await expect(configPage.waitingRoomOptionText).toBeVisible();
    await expect(configPage.waitingRoomOptionToggle).toBeVisible();
    await expect(configPage.dispatcherOptionText).toBeVisible();
    await expect(configPage.dispatcherOptionToggle).toBeVisible();
    await expect(configPage.enableChatAppointmentsText).toBeVisible();
    await expect(configPage.enableChatAppointmentsToggle).toBeVisible();

    // Verify action buttons are present
    await expect(configPage.saveChangesButton).toBeVisible();
    await expect(configPage.cancelButton).toBeVisible();
  });

  test('Verify Enabling and Disabling Toggles on Configuration Tab Screen @[111332] @admin @functional', async () => {
    // Capture initial toggle states
    const initialStates = await configPage.getToggleStates();

    // Define toggles to test
    const toggleNames = ['enforceCountry', 'waitingRoom', 'dispatcher', 'chatAppointments'];

    // Test each toggle can be clicked and state changes
    for (const toggleName of toggleNames) {
      const toggleMap = {
        enforceCountry: configPage.enforceCountryToggle,
        waitingRoom: configPage.waitingRoomOptionToggle,
        dispatcher: configPage.dispatcherOptionToggle,
        chatAppointments: configPage.enableChatAppointmentsToggle,
      };

      const toggle = toggleMap[toggleName];
      await toggle.click();
      await expect(toggle).not.toBeChecked({ checked: initialStates[toggleName] });
    }

    // Revert all toggles to original state
    for (const toggleName of toggleNames) {
      const toggleMap = {
        enforceCountry: configPage.enforceCountryToggle,
        waitingRoom: configPage.waitingRoomOptionToggle,
        dispatcher: configPage.dispatcherOptionToggle,
        chatAppointments: configPage.enableChatAppointmentsToggle,
      };

      const toggle = toggleMap[toggleName];
      await toggle.click();
      await expect(toggle).toBeChecked({ checked: initialStates[toggleName] });
    }

    // Verify save button is disabled when no changes remain
    await expect(configPage.saveChangesButton).toBeDisabled();
  });

  test.skip('Verify "Enforce Country/State Liscensing on Provider Lists Enabled" Toggle @[112108] @multi-user @functional', async () => {});

  test('Check Default Values and Valid Input for "On-Demand Provider Contacting Choices" Fields @[112113] @admin @functional', async () => {
    // Capture and verify current default values
    const defaultValues = await configPage.getInputValues();
    await expect(configPage.numberOfTimesToContactInput).toHaveValue(defaultValues.timesToContact);
    await expect(configPage.numberOfMinutesInput).toHaveValue(defaultValues.minutes);

    // Generate new test values by incrementing defaults
    const newTimesToContact = (parseInt(defaultValues.timesToContact, 10) + 1).toString();
    const newMinutes = (parseInt(defaultValues.minutes, 10) + 1).toString();

    // Fill fields with new values and verify save button activates
    await configPage.numberOfTimesToContactInput.fill(newTimesToContact);
    await configPage.numberOfMinutesInput.fill(newMinutes);
    await configPage.page.waitForTimeout(500);

    await expect(configPage.saveChangesButton).toBeEnabled();
    await configPage.saveChangesButton.click();
    await configPage.page.waitForLoadState('networkidle');

    // Verify new values persist after save
    await expect(configPage.numberOfTimesToContactInput).toHaveValue(newTimesToContact);
    await expect(configPage.numberOfMinutesInput).toHaveValue(newMinutes);
    await expect(configPage.saveChangesButton).toBeDisabled();

    // Reset to standard default values
    await configPage.numberOfTimesToContactInput.fill('5');
    await configPage.numberOfMinutesInput.fill('1');
    await configPage.page.waitForTimeout(500);
    await expect(configPage.saveChangesButton).toBeEnabled();
    await configPage.saveChangesButton.click();
    await configPage.page.waitForLoadState('networkidle');

    // Verify reset to defaults was successful
    await expect(configPage.numberOfTimesToContactInput).toHaveValue('5');
    await expect(configPage.numberOfMinutesInput).toHaveValue('1');
  });

  test('[Negative] Verify Input Validation for Retry Fields in Institution Configuration @[112114] @admin @functional', async () => {
    // Trigger zero value validation workflow
    await configPage.performZeroValidationFlow();

    // Verify validation error messages appear
    await expect(configPage.formErrorMessage).toBeVisible();
    await expect(configPage.zeroValueErrorMessage.first()).toBeVisible();
    await expect(configPage.zeroValueErrorMessage.nth(1)).toBeVisible();

    // Reset fields to valid values
    await configPage.numberOfTimesToContactInput.fill('5');
    await configPage.numberOfMinutesInput.fill('1');
    await configPage.page.waitForTimeout(500);

    // Save changes if button is enabled
    if (await configPage.saveChangesButton.isEnabled()) {
      await configPage.saveChangesButton.click();
      await configPage.page.waitForTimeout(500);
    }

    // Verify save button returns to disabled state
    await expect(configPage.saveChangesButton).toBeDisabled();
  });

  test('Validate Save Button Activation Upon Any Setting Change @[112116] @admin @functional', async () => {
    // Modify input field to trigger save button activation
    await configPage.numberOfTimesToContactInput.fill('0');
    await expect(configPage.saveChangesButton).toBeEnabled();
  });

  test('[Negative] Verify Save Button Behavior Without Changes @[112117] @admin @functional', async () => {
    // Verify save button remains disabled without any changes
    await expect(configPage.saveChangesButton).toBeDisabled();
  });

  test('Verify Dispatcher Toggle in Institution Settings @[114051] @admin @functional', async () => {
    // Check current state of dispatcher toggle
    const isInitiallyChecked = await configPage.dispatcherOptionToggle.isChecked();

    // Test toggle functionality based on current state
    if (!isInitiallyChecked) {
      await configPage.dispatcherOptionToggle.click();
      await expect(configPage.dispatcherOptionToggle).toBeChecked();
      await expect(configPage.saveChangesButton).toBeEnabled();
    } else {
      // Verify current checked state and disabled save button
      await expect(configPage.dispatcherOptionToggle).toBeChecked();
      await expect(configPage.saveChangesButton).toBeDisabled();
    }
  });
});

test.describe('Super Admin @regression', () => {
  let configPage;
  test.beforeEach(async ({ page }) => {
    configPage = new InstitutionSettingsConfigurationPage(page);
    await configPage.gotoInstitutionSettingsConfiguration();
  });

  test.skip('Verify Interactive Triage Toggle is Only Visible to System Admin @[114052] @super-admin @functional', async () => {});

  test.skip('Verify Functionality of Interactive Triage Toggle @[114053] @super-admin @functional', async () => {});
});
