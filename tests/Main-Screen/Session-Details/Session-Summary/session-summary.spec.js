import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Session Summary - Total Tests 14

// make sure that the test in this file run in series
test.describe.configure({ mode: 'serial' });

test.describe('Session Summary @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);

    // Navigate to provider dashboard
    await dashboardPage.gotoProviderDashboard();
  });

  test('Verify Components in Summary Tab of Session Details @[111779] @provider @ui', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Verify Summary Tab Components
    await expect(page.getByRole('link', { name: 'Download Export PDF' })).toBeVisible();
    await expect(page.getByText('Visit Summary report')).toBeVisible();
    await expect(page.getByText('Visit Notes')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Plus Add visit note' })).toBeVisible();
    await expect(page.getByText('Discharge instructions').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Plus Add instructions' })).toBeVisible();
  });

  test('Verify Content of Export PDF Modal from Summary Tab @[111780] @provider @ui', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Export PDF Modal
    await page.getByRole('link', { name: 'Download Export PDF' }).click();

    // Verify Export PDF Modal Components
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Export visit summary report?')).toBeVisible();
    await expect(page.getByText('Please acknowledge your')).toBeVisible();
    await expect(page.getByText('I understand that I am')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export PDF' })).toBeVisible();
    await expect(page.getByTestId('modal').locator('label span')).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
  });

  test('Verify X Button on Export Visit Summary Report Modal @[111781] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Export PDF Modal
    await page.getByRole('link', { name: 'Download Export PDF' }).click();

    // Verify X Button Functionality
    await page.getByRole('button', { name: 'XClose' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify Export PDF Functionality on Export Visit Summary Report Modal @[111782] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Export PDF Modal
    await page.getByRole('link', { name: 'Download Export PDF' }).click();

    // Check the confirmation checkbox and click Export PDF button
    await page.getByTestId('modal').locator('label span').click();
    await page.getByRole('button', { name: 'Export PDF' }).click();

    // Verify the modal is closed after exporting
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify Content of Add Visit Note Modal on Summary Tab @[111783] @provider @ui', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Add Visit Note Modal
    await page.getByRole('button', { name: 'Plus Add visit note' }).click();

    // Verify Add Visit Note Modal Components
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByText('Add visit note').nth(1)).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Subjective')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Type Subjective here' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Objective')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Type Objective here' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Assessment')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Type Assessment here' })).toBeVisible();
    await expect(page.getByTestId('modal').getByText('Plan')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Type Plan here' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add visit note' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XClose' })).toBeVisible();
  });

  test('Verify "X" Button on Add Visit Note Modal @[111784] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Add Visit Note Modal
    await page.getByRole('button', { name: 'Plus Add visit note' }).click();

    // Verify X Button Functionality
    await page.getByRole('button', { name: 'XClose' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify Save Button on Visit Note Modal @[111785] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Add Visit Note Modal
    await page.getByRole('link', { name: 'Plus Add visit note' }).click();

    // Fill in all required fields
    await page.getByRole('textbox', { name: 'Type Subjective here' }).fill('Subjective details for testing.');
    await page.getByRole('textbox', { name: 'Type Objective here' }).fill('Objective details for testing.');
    await page.getByRole('textbox', { name: 'Type Assessment here' }).fill('Assessment details for testing.');
    await page.getByRole('textbox', { name: 'Type Plan here' }).fill('Plan details for testing.');

    // Click Add visit note button
    await page.getByRole('button', { name: 'Add visit note' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify Adding Instructions in Discharge Instructions Section on Summary Tab @[111786] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    const editLink = await page.getByRole('link', { name: 'Edit' });
    await editLink.waitFor({ state: 'visible' });
    await expect(editLink).toBeVisible();
    await editLink.click();

    // Try to verify if modal opened, if not, click again
    try {
      // Wait a short time for modal to appear
      await page.getByTestId('modal').waitFor({ state: 'visible', timeout: 1000 });
    } catch (error) {
      // If modal not visible after first click, try clicking again
      console.log('First click did not open modal, trying again...');
      await editLink.click();
      // Wait for modal to be visible after second click
      await page.getByTestId('modal').waitFor({ state: 'visible' });
    }

    // Check the current text in the discharge instructions field
    const currentInstructions = await page.getByRole('textbox', { name: 'Type discharge instructions' }).inputValue();

    // Conditionally change the text based on current content
    if (currentInstructions === 'Discharge safely!') {
      console.log('Found "Discharge safely!" - changing to "Discharge safe!"');
      await page.getByRole('textbox', { name: 'Type discharge instructions' }).fill('Discharge safe!');
    } else if (currentInstructions === 'Discharge safe!') {
      console.log('Found "Discharge safe!" - changing to "Discharge safely!"');
      await page.getByRole('textbox', { name: 'Type discharge instructions' }).fill('Discharge safely!');
    } else {
      console.log(`Found unexpected text: "${currentInstructions}" - setting to default value`);
      await page.getByRole('textbox', { name: 'Type discharge instructions' }).fill('Discharge safely!');
    }
    await page.getByRole('button', { name: 'Save changes' }).click();
  });

  test('Verify "X" Button on Add Instructions Modal @[111787] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // click Summary tab
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Discharge Instructions Modal
    await page.getByText('Edit').click();
    await page.getByRole('button', { name: 'XClose' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify Saving Instructions in Discharge Instructions Modal @[111788] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // click Summary tab
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Discharge Instructions Modal
    const editLink = await page.getByRole('link', { name: 'Edit' });
    await editLink.waitFor({ state: 'visible' });
    await expect(editLink).toBeVisible();
    await editLink.click();

    // Try to verify if modal opened, if not, click again
    try {
      // Wait a short time for modal to appear
      await page.getByTestId('modal').waitFor({ state: 'visible', timeout: 1000 });
    } catch (error) {
      // If modal not visible after first click, try clicking again
      console.log('First click did not open modal, trying again...');
      await editLink.click();
      // Wait for modal to be visible after second click
      await page.getByTestId('modal').waitFor({ state: 'visible' });
    }

    // Check the current text in the discharge instructions field
    const currentInstructions = await page.getByRole('textbox', { name: 'Type discharge instructions' }).inputValue();

    // Conditionally change the text based on current content
    if (currentInstructions === 'Discharge safely!') {
      console.log('Found "Discharge safely!" - changing to "Discharge safe!"');
      await page.getByRole('textbox', { name: 'Type discharge instructions' }).fill('Discharge safe!');
    } else if (currentInstructions === 'Discharge safe!') {
      console.log('Found "Discharge safe!" - changing to "Discharge safely!"');
      await page.getByRole('textbox', { name: 'Type discharge instructions' }).fill('Discharge safely!');
    } else {
      console.log(`Found unexpected text: "${currentInstructions}" - setting to default value`);
      await page.getByRole('textbox', { name: 'Type discharge instructions' }).fill('Discharge safely!');
    }
    await page.getByRole('button', { name: 'Save changes' }).click();
  });

  test('[Negative] Verify Export PDF button remains disabled if the confirmation checkbox is not checked @[112053] @provider @functional', async ({
    page,
  }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // click Summary tab
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Export PDF Modal
    await page.getByRole('link', { name: 'Download Export PDF' }).click();

    // Verify Export PDF button is disabled
    const exportButton = page.getByRole('button', { name: 'Export PDF' });
    await expect(exportButton).toBeDisabled();
  });

  test('[Negative] Verify Add Visit Note button remains disabled if not all fields are filled @[112057] @provider @functional', async ({
    page,
  }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // click Summary tab
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // Open Add Visit Note Modal
    await page.getByRole('link', { name: 'Plus Add visit note' }).click();
    const addButton = page.getByRole('button', { name: 'Add visit note' });
    await expect(addButton).toBeDisabled();
  });

  test('[Negative] Verify Save Instructions button remains disabled if no text is entered @[112058] @provider @functional', async ({
    page,
  }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // click Summary tab
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    const editLink = page.getByRole('link', { name: 'Edit' });
    await editLink.waitFor({ state: 'visible' });
    await expect(editLink).toBeVisible();
    await editLink.click();

    // Try to verify if modal opened, if not, click again
    try {
      // Wait a short time for modal to appear
      await page.getByTestId('modal').waitFor({ state: 'visible', timeout: 1000 });
    } catch (error) {
      // If modal not visible after first click, try clicking again
      console.log('First click did not open modal, trying again...');
      await editLink.click();
      // Wait for modal to be visible after second click
      await page.getByTestId('modal').waitFor({ state: 'visible' });
    }

    // Clear text in the discharge instructions field
    const instructionsField = page.getByRole('textbox', { name: 'Type discharge instructions' });
    await instructionsField.clear();

    // Verify that the Save changes button is disabled
    const saveButton = page.getByRole('button', { name: 'Save changes' });
    await expect(saveButton).toBeDisabled();
  });

  test('Verify clicking on participant modal @[118362] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('Session cancelled').first().click();

    // click Summary tab
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Summary' }).click();

    // click overview tab
    await page.getByRole('button', { name: 'Overview' }).click();

    // verify participants section
    await expect(page.getByText('Participants')).toBeVisible();
    await expect(page.getByText('CCcody test patient Cody Test')).toBeVisible();
    await expect(page.getByText('CCcody prov Cody Test')).toBeVisible();
  });
});
