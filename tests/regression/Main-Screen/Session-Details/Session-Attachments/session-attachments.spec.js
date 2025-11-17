import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { DashboardPage } from '../../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Session Attachments - Total Tests 10

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Validate display of attachments tab with no files uploaded @[111839] @provider @ui', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').first().click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Verify no files are attached
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  test('Validate display of Attachments Tab with files uploaded @[111840] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/cover-image-greg.jpg');

    // Verify the attached file
    await expect(page.getByTestId('attachment').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'DotsV' }).first()).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'Trash Remove attachment' }).click();
    await page.getByRole('button', { name: 'Yes, remove' }).click();

    // verify dots button is gone
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  test('Click on Upload File Link @[111841] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/cover-image-greg.jpg');

    // Verify the attached file
    await expect(page.getByTestId('attachment')).toBeVisible();
    await expect(page.getByRole('button', { name: 'DotsV' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'Trash Remove attachment' }).click();
    await page.getByRole('button', { name: 'Yes, remove' }).click();

    // verify dots button is gone
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  test('Verify functionality of Dropdown menu for attached files @[111843] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/cover-image-greg.jpg');

    // Verify the attached file
    await expect(page.getByTestId('attachment').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'DotsV' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'Trash Remove attachment' }).click();
    await page.getByRole('button', { name: 'Yes, remove' }).click();

    // verify dots button is gone
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  // there is a bug here [120525] where the download button doesnt actually download the file
  test.skip('Validate Download functionality from Dropdown menu @[111844]', async ({ page }) => {});

  test('Verify "Remove Attachment" functionality @[111845] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/cover-image-greg.jpg');

    // Verify the attached file
    await expect(page.getByTestId('attachment').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'DotsV' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'Trash Remove attachment' }).click();
    await page.getByRole('button', { name: 'Yes, remove' }).click();

    // verify dots button is gone
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  test('Verify Upload of Acceptated File Types @[111869] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/cover-image-greg.jpg');

    // Verify the attached file
    await expect(page.getByTestId('attachment').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'DotsV' })).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'Trash Remove attachment' }).click();
    await page.getByRole('button', { name: 'Yes, remove' }).click();

    // verify dots button is gone
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  test('[Negative] - Verify Rejection of Unsupported File Types @[111870] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/unsupported.exe');
    await expect(page.getByText('File type of "unsupported.exe" is not supported')).toBeVisible();
  });

  test('Validate Drag-and-Drop File Upload Functionality @[111872] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Perform drag-and-drop with accurate binary file simulation
    const filePath = './tests/images/cover-image-greg.jpg';
    const fileName = 'cover-image-greg.jpg';
    const fileType = 'image/jpeg';

    // Read file as Base64 buffer to preserve binary data
    const buffer = readFileSync(filePath).toString('base64');

    // Create DataTransfer handle in browser context
    const dataTransfer = await page.evaluateHandle(
      ({ bufferData, localFileName, localFileType }) => {
        const dt = new DataTransfer();
        // Reconstruct as Blob from data URL, then create File
        const response = fetch(bufferData);
        const blob = response.then((res) => res.blob());
        const file = new File([blob], localFileName, { type: localFileType });
        dt.items.add(file);
        return dt;
      },
      {
        bufferData: `data:application/octet-stream;base64,${buffer}`,
        localFileName: fileName,
        localFileType: fileType,
      }
    );

    // Dispatch drop event to the target (adjust selector if drop zone is a parent container)
    const dropZoneSelector = '[data-testid="icon-Upload"]'; // Start with icon; inspect if needed
    await page.dispatchEvent(dropZoneSelector, 'drop', { dataTransfer });

    // Dispose of the handle to free resources
    await dataTransfer.dispose();

    // Verify the attached file
    await expect(page.getByTestId('attachment')).toBeVisible();
    await expect(page.getByRole('button', { name: 'DotsV' })).toBeVisible();
    await expect(page.getByText('cover-image-greg.jpg')).toBeVisible();

    // reset state
    await page.getByRole('button', { name: 'DotsV' }).click();
    await page.getByRole('button', { name: 'Trash Remove attachment' }).click();
    await page.getByRole('button', { name: 'Yes, remove' }).click();

    // verify dots button is gone
    await expect(page.getByRole('button', { name: 'DotsV' })).not.toBeVisible();
  });

  test('[Negative] Validate Maximum File Size Restriction @[111876] @provider @functional', async ({ page }) => {
    // Navigate to Schedule and open first session
    await page.getByRole('heading', { name: 'Your schedule for today' }).click();
    await page.getByText('Your schedule all sessions').click();
    await page.getByText('Your schedule all sessions').first().click();

    // click first session in the list
    await page.getByText('General Practice').nth(1).click();

    // Verify Session Details
    await expect(page.getByText('Session Details')).toBeVisible();
    await page.getByRole('button', { name: 'Attachments' }).click();
    await page.waitForTimeout(300);

    // Verify Attachments Tab
    await expect(page.getByText('Upload files')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose files' })).toBeVisible();
    await expect(page.getByTestId('icon-Upload')).toBeVisible();

    // Click on Choose files link
    const [fileChooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByRole('link', { name: 'Choose files' }).click()]);
    await fileChooser.setFiles('./tests/images/30mb.jpg');
    await expect(page.getByText('The file "30mb.jpg" exceeds')).toBeVisible();
  });
});
