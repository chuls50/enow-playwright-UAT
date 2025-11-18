import { test, expect } from '@playwright/test';
import { PatientListPage } from '../../../models/pages/shared/patients-list.page.js';
import { DashboardPage } from '../../../models/pages/provider/provider-dashboard.page.js';
import { ROLES, useRole } from '../../../utils/auth-helpers.js';

// Test data constants
const TEST_DATA = {
  SEARCH_TERMS: {
    VALID_PATIENT_NAME: 'cody test patient',
    INVALID_PATIENT_NAME: 'CODY TEST USER GREG',
    VALID_EMAIL: 'chuls+patcodytest@globalmed.com',
    INVALID_EMAIL: 'chuls+invalid@globalmed.com',
    NO_PAST_SESSIONS_PATIENT: 'John two Doe',
  },
  FILTER_OPTIONS: {
    SERVICE: 'General Practice',
    TYPE_VIDEO: 'Video',
    TYPE_CHAT: 'Chat',
  },
  DOWNLOADS_PATH: './downloads/',
  UI_TEXT: {
    MY_PATIENTS: 'My patients',
    SCHEDULE_SESSION: 'Schedule a session',
    VISIT_NOTES: 'Visit Notes',
    DISCHARGE_INSTRUCTIONS: 'Discharge Instructions',
    ATTACHMENTS: 'Attachments',
  },
};

test.describe('Coordinator @regression', () => {
  test.use(useRole(ROLES.COORDINATOR));
  let patientListPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    patientListPage = new PatientListPage(page);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Verify navigation to Patient List screen for Coordinator @[115926] @coordinator @ui', async ({ page }) => {
    await patientListPage.navigateToPatients();

    // Verify successful navigation to patient list
    await expect(page.getByRole('heading', { name: 'Patients' })).toBeVisible();
    await expect(patientListPage.myPatientsHeading).not.toBeVisible();
  });
});

test.describe('Provider @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let patientListPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    patientListPage = new PatientListPage(page);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Verify navigation to Patient List screen for Provider @[115925] @provider @ui', async ({ page }) => {
    // Navigate to My Patients using POM method
    await patientListPage.navigateToMyPatients();

    // Verify successful navigation to patient list
    await expect(patientListPage.myPatientsHeading).toBeVisible();
  });

  test('Verify patient data columns in the list @[115927] @provider @ui', async ({ page }) => {
    // Perform provider login and navigate to patient list
    // await basePage.performProviderLogin();
    await patientListPage.navigateToMyPatients();

    // Verify all required table column headers are visible
    await expect(patientListPage.nameColumnHeader).toBeVisible();
    await expect(patientListPage.emailColumnHeader).toBeVisible();
    await expect(patientListPage.phoneColumnHeader).toBeVisible();
    await expect(patientListPage.scheduleSessionIcon).toBeVisible();
  });

  test('Verify functionality of "Schedule Session" icon @[115928] @provider @ui', async ({ page }) => {
    // Perform provider login and navigate to patient list
    // await basePage.performProviderLogin();
    await patientListPage.navigateToMyPatients();

    // Click schedule session icon for first patient using POM method
    await patientListPage.clickScheduleSessionForFirstPatient();
  });

  test('Verify Patient list search functionality @[115929] @provider @ui', async ({ page }) => {
    // Perform provider login and navigate to patient list
    // await basePage.performProviderLogin();
    await patientListPage.navigateToMyPatients();

    // Search for valid patient name using TEST_DATA
    await patientListPage.searchForPatient(TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME);
    await expect(patientListPage.firstPatientNameCell.getByText(TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME)).toBeVisible();

    // Search for invalid patient name using TEST_DATA
    await patientListPage.searchForPatient(TEST_DATA.SEARCH_TERMS.INVALID_PATIENT_NAME);
    await expect(patientListPage.firstPatientNameCell.getByText(TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME)).not.toBeVisible();

    // Search for valid email using TEST_DATA
    await patientListPage.searchForPatient(TEST_DATA.SEARCH_TERMS.VALID_EMAIL);
    await expect(patientListPage.firstPatientNameCell.getByText(TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME)).toBeVisible();

    // Search for invalid email using TEST_DATA
    await patientListPage.searchForPatient(TEST_DATA.SEARCH_TERMS.INVALID_EMAIL);
    await expect(patientListPage.firstPatientNameCell.getByText(TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME)).not.toBeVisible();
  });

  test('Verify sorting functionality in Patient list table @[115930] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Test Name column sorting using POM methods
    await patientListPage.sortByName();
    await expect(patientListPage.chevronUpIcon).toBeVisible();
    await patientListPage.sortByName();
    await expect(patientListPage.chevronDownIcon).toBeVisible();
    await patientListPage.sortByName();

    // Test Email column sorting using POM methods
    await patientListPage.sortByEmail();
    await expect(patientListPage.chevronUpIcon).toBeVisible();
    await patientListPage.sortByEmail();
    await expect(patientListPage.chevronDownIcon).toBeVisible();
    await patientListPage.sortByEmail();

    // Test Phone column sorting using POM methods
    await patientListPage.sortByPhone();
    await expect(patientListPage.chevronUpIcon).toBeVisible();
    await patientListPage.sortByPhone();
    await expect(patientListPage.chevronDownIcon).toBeVisible();
    await patientListPage.sortByPhone();
  });

  test.skip('Verify Only My Patients toggle for dual-role user @[115931] @dual-user @functional', async ({ page }) => {
    // This test requires provider+coordinator role - needs separate test suite
    // Navigate to Patients using POM method
    await patientListPage.navigateToPatients();

    // Verify Only My Patients toggle is present and enabled using POM locators
    await expect(patientListPage.onlyMyPatientsText).toBeVisible();
    await patientListPage.toggleOnlyMyPatients();
    await expect(patientListPage.cardElement).toBeVisible();
    await patientListPage.toggleOnlyMyPatients();
    await expect(patientListPage.noPatientsYetText).not.toBeVisible();
  });

  test.skip('Verify behavior when there are no visit notes @[115932] @dual-user @functional', async ({ page }) => {
    // This test requires provider+coordinator role - needs separate test suite
    // Navigate to Patients using POM method
    await patientListPage.navigateToPatients();

    // Search user Greg and open patient details using POM methods
    await patientListPage.searchForPatient('greg');
    await patientListPage.openGregJamesPatientDetails();

    // Navigate to Visit Notes tab and verify no visit notes message using POM locators
    await patientListPage.openVisitNotesTab();
    await expect(patientListPage.noVisitNotesMessage).toBeVisible();
  });

  test.skip('[Negative] Verify empty patient list displays "No Patients" screen @[115933] @dual-user @functional', async ({ page }) => {
    // This test requires provider+coordinator role - needs separate test suite
    // Navigate to Patients using POM method
    await patientListPage.navigateToPatients();

    // Verify Only My Patients toggle behavior using POM locators
    await expect(patientListPage.onlyMyPatientsText).toBeVisible();
    await patientListPage.toggleOnlyMyPatients();
    await expect(patientListPage.cardElement).toBeVisible();
    await expect(patientListPage.noPatientsYetText).toBeVisible();
    await patientListPage.toggleOnlyMyPatients();
    await expect(patientListPage.noPatientsYetText).not.toBeVisible();
  });

  test('Verify click on patient name opens Patient Appointment History @[115934] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Verify patient appointment history opens
    await expect(patientListPage.patientCard).toBeVisible();
  });

  test('Verify Patient Appointment History screen opens and displays correct UI elements @[116581] @provider @functional', async ({
    page,
  }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Verify all patient details UI elements using POM locators
    await expect(patientListPage.patientCard).toBeVisible();
    await expect(patientListPage.emailLabel).toBeVisible();
    await expect(patientListPage.phoneNumberLabel).toBeVisible();
    await expect(patientListPage.locationLabel).toBeVisible();
    await expect(patientListPage.taxIdLabel).toBeVisible();
    await expect(patientListPage.insuranceLabel).toBeVisible();
    await expect(patientListPage.insurancePolicyLabel).toBeVisible();
    await expect(patientListPage.scheduleSessionButton).toBeVisible();
    await expect(patientListPage.pastSessionsTab).toBeVisible();
    await expect(patientListPage.visitNotesTab).toBeVisible();
    await expect(patientListPage.dischargeInstructionsTab).toBeVisible();
    await expect(patientListPage.attachmentsTab).toBeVisible();
    await expect(patientListPage.pastSessionsHeading).toBeVisible();
  });

  test('Verify contents in the Past Sessions tab @[116584] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Verify Past Sessions table structure using POM locators
    await expect(patientListPage.pastSessionsTable).toBeVisible();
    await expect(patientListPage.dateColumnHeader).toBeVisible();
    await expect(patientListPage.serviceColumnHeader).toBeVisible();
    await expect(patientListPage.providerColumnHeader).toBeVisible();
    await expect(patientListPage.typeColumnHeader).toBeVisible();
    await expect(patientListPage.downloadVSRLink).toBeVisible();
    await expect(patientListPage.viewDetailsLink).toBeVisible();

    // Download VSR using POM method
    const download = await patientListPage.downloadVSR();
    const fileName = await download.suggestedFilename();
    await patientListPage.saveDownloadToPath(download, fileName);
    expect(fileName).toBeTruthy();

    // Open session details using POM locator
    await patientListPage.viewDetailsLink.click();
    await expect(patientListPage.sessionDetailsModal).toBeVisible();
  });

  test('Verify filter functionality in Past Sessions tab @[116585] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details
    await patientListPage.openCodyPatientDetails();

    // Apply filters using POM methods and test data (skip provider filter as patient name may not be a valid provider)
    await patientListPage.applyServiceFilter(TEST_DATA.FILTER_OPTIONS.SERVICE);
    await patientListPage.applyTypeFilter(TEST_DATA.FILTER_OPTIONS.TYPE_VIDEO);
    await patientListPage.applySecondaryTypeFilter(TEST_DATA.FILTER_OPTIONS.TYPE_CHAT);

    // Verify applied filters appear in filter panel using POM locators
    await patientListPage.filterPanel.getByText(TEST_DATA.FILTER_OPTIONS.SERVICE).waitFor({ state: 'visible' });
    await expect(patientListPage.filterPanel.getByText(TEST_DATA.FILTER_OPTIONS.SERVICE)).toBeVisible();
    await expect(patientListPage.filterPanel.getByText(TEST_DATA.FILTER_OPTIONS.TYPE_VIDEO)).toBeVisible();
    await expect(patientListPage.typeChatFilterText).toBeVisible();

    // Clear all filters and verify they are removed using POM locators
    await patientListPage.clearAllFilters();
    await expect(patientListPage.filterPanel.getByText(TEST_DATA.FILTER_OPTIONS.SERVICE)).not.toBeVisible();
    await expect(patientListPage.filterPanel.getByText(TEST_DATA.FILTER_OPTIONS.TYPE_VIDEO)).not.toBeVisible();
    await expect(patientListPage.typeChatFilterText).not.toBeVisible();
  });

  test('Verify sorting functionality in Past Sessions tab @[116587] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Get original date and test date sorting using POM methods
    const dateText = await patientListPage.getFirstPatientDate();
    await patientListPage.sortByDate();
    const sortedDateText = await patientListPage.getFirstPatientDate();
    const originalDate = new Date(dateText);
    const sortedDate = new Date(sortedDateText);
    expect(sortedDate.getTime()).toBeLessThan(originalDate.getTime());

    // Test reverse date sorting
    await patientListPage.sortByDate();
    const descendingSortedText = await patientListPage.getFirstPatientDate();
    const descendingDate = new Date(descendingSortedText);
    expect(descendingDate.getTime()).toBeGreaterThan(sortedDate.getTime());

    // Test service sorting using POM methods
    const serviceText = await patientListPage.getFirstPatientService();
    await patientListPage.sortByService();
    await page.getByTestId('sort-button-service').click();
    const sortedServiceText = await patientListPage.getFirstPatientService();
    expect(sortedServiceText).not.toBe(serviceText);
  });

  test('Verify pagination behavior in Patient Appointment history tables @[116590] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details to access appointment history
    await patientListPage.openCodyPatientDetails();

    // Test pagination controls - Previous button should be disabled initially
    await expect(patientListPage.previousButton).toBeDisabled();

    // Navigate to next page and verify Previous button is enabled
    await patientListPage.nextButton.click();
    await expect(patientListPage.previousButton).toBeEnabled();

    // Navigate back to first page and verify Previous button is disabled again
    await patientListPage.previousButton.click();
    await expect(patientListPage.previousButton).toBeDisabled();
  });

  // skipping this test as past sessions is hard to control in test environment
  test.skip('Verify empty state for past sessions tab @[116591] @provider @functional', async ({ page }) => {
    // This test requires provider+coordinator role - needs separate test suite
    // Navigate to Patients using POM method
    await patientListPage.navigateToPatients();

    // Click the first automation test device using POM method
    const patientName = TEST_DATA.SEARCH_TERMS.NO_PAST_SESSIONS_PATIENT;
    await page.getByText(patientName).first().click();

    // Navigate to Past Sessions tab using POM method
    await patientListPage.openPastSessionsTab();

    // Verify no past sessions using POM locator
    await expect(patientListPage.noPastSessionsMessage).toBeVisible();
  });

  test('Verify Visit Notes tab opens correctly for a selected patient @[116595] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    // Verify Visit Notes tab UI using POM locators and helper methods
    const patientName = TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME;
    await expect(patientListPage.visitNotesHeading).toBeVisible();
    await expect(await patientListPage.getBreadcrumbText(patientName)).toBeVisible();
    await expect(await patientListPage.getPatientHeading(patientName)).toBeVisible();
  });

  test('Verify the structure and contents of the Visit Notes list @[116597] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    // Verify Visit Notes table structure using POM locators
    await expect(patientListPage.pastSessionsTable).toBeVisible();
    await expect(patientListPage.dateColumnHeader).toBeVisible();
    await expect(patientListPage.serviceColumnHeader).toBeVisible();
    await expect(patientListPage.providerColumnHeader).toBeVisible();

    // Check for View link and Export all button conditionally
    if (await patientListPage.viewLink.isVisible()) {
      await expect(patientListPage.exportAllButton).toBeVisible();
    }
  });

  test('Verify "Export All" Visit Notes to PDF @[116598] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    // Download all visit notes using POM method
    const download = await patientListPage.downloadAllVisitNotes();

    // Verify download success message and file
    await expect(patientListPage.visitNotesDownloadMessage).toBeVisible();
    const fileName = await download.suggestedFilename();
    await patientListPage.saveDownloadToPath(download, fileName);
    expect(fileName).toBeTruthy();
  });

  test('Verify "View" link behavior in Visit Notes tab @[116599] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    // Open Visit Notes slide-out using POM method
    await patientListPage.openVisitNotesSlideOut();

    // Verify Visit Notes slide-out UI elements using POM locators
    await expect(patientListPage.visitNotesHeading).toBeVisible();
    await expect(patientListPage.subjectiveHeading).toBeVisible();
    await expect(patientListPage.objectiveHeading).toBeVisible();
    await expect(patientListPage.assessmentHeading).toBeVisible();
    await expect(patientListPage.planHeading).toBeVisible();
    await expect(patientListPage.sessionDetailsButton).toBeVisible();
  });

  test('Verify Session details button behavior in Visit Notes slide out @[116600] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    // Open Visit Notes slide-out and session details using POM methods
    await patientListPage.openVisitNotesSlideOut();
    await patientListPage.openSessionDetailsFromVisitNotes();

    // Verify Session Details dialog opens using POM locator
    await expect(patientListPage.sessionDetailsDialog).toBeVisible();
  });

  test('Verify sorting functionality in Visit Notes tab @[116601] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    // Test date sorting using POM methods
    await patientListPage.sortByDate();
    await expect(patientListPage.chevronUpIcon).toBeVisible();
    await patientListPage.sortByDate();
    await expect(patientListPage.chevronDownIcon).toBeVisible();
    await patientListPage.sortByDate();

    // Test service sorting using POM methods
    await patientListPage.sortByService();
    await expect(patientListPage.chevronUpIcon).toBeVisible();
    await patientListPage.sortByService();
    await expect(patientListPage.chevronDownIcon).toBeVisible();
    await patientListPage.sortByService();

    // Test user/provider sorting using POM methods
    await patientListPage.sortByUser();
    await expect(patientListPage.chevronUpIcon).toBeVisible();
    await patientListPage.sortByUser();
    await expect(patientListPage.chevronDownIcon).toBeVisible();
    await patientListPage.sortByUser();
  });

  test('Verify Discharge Instructions tab opens correctly for a selected patient @[116603] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Discharge Instructions tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openDischargeInstructionsTab();

    // Verify Discharge Instructions tab UI using POM locators and helper methods
    const patientName = TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME;
    await expect(patientListPage.dischargeInstructionsHeading).toBeVisible();
    await expect(await patientListPage.getBreadcrumbText(patientName)).toBeVisible();
    await expect(await patientListPage.getPatientHeading(patientName)).toBeVisible();
  });

  test('Verify the structure and contents of the Discharge Instructions list @[116604] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Discharge Instructions tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openDischargeInstructionsTab();

    // Verify Discharge Instructions table structure using POM locators
    await expect(patientListPage.dateColumnHeader).toBeVisible();
    await expect(patientListPage.serviceColumnHeader).toBeVisible();
    await expect(patientListPage.providerColumnHeader).toBeVisible();

    // Check if View link is present before checking for Export all button
    if (await patientListPage.viewLink.isVisible()) {
      await expect(patientListPage.exportAllButton).toBeVisible();
    }
  });

  test('[Negative] Verify "Export All" button is hidden when no Visit Notes are available @[116605] @provider @functional', async ({
    page,
  }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Discharge Instructions tab using POM methods
    await patientListPage.openHatsunePatientDetails();
    await patientListPage.openVisitNotesTab();

    // Verify Export All button is not visible using POM locator
    await expect(patientListPage.exportAllButton).not.toBeVisible();
    await expect(patientListPage.noVisitNotesMessage).toBeVisible();
  });

  test('Verify "View" link behavior in Discharge Instructions tab @[116606] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Discharge Instructions tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openDischargeInstructionsTab();

    // Open View link using POM locator
    await patientListPage.viewLink.click();

    // Verify Discharge Instructions slide-out UI using POM locators
    await expect(patientListPage.dischargeInstructionsHeading).toBeVisible();
    await expect(patientListPage.sessionDetailsButton).toBeVisible();
  });

  test('Verify Session details button behavior in Discharge Instructions slide out @[116607] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Discharge Instructions tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openDischargeInstructionsTab();

    // Open View link and session details using POM methods
    await patientListPage.viewLink.click();
    await patientListPage.openSessionDetailsFromDischargeInstructions();

    // Verify Session Details dialog opens using POM locator
    await expect(patientListPage.sessionDetailsDialog).toBeVisible();
  });

  test('Verify behavior when there are no discharge instructions @[116608] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Discharge Instructions tab using POM methods
    await patientListPage.openHatsunePatientDetails();
    await patientListPage.openDischargeInstructionsTab();

    // Verify No Discharge Instructions message using POM locator
    await expect(patientListPage.noDischargeInstructionsMessage).toBeVisible();
  });

  test('Verify that the Attachments tab opens correctly for a selected patient @[116610] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Attachments tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openAttachmentsTab();

    // Verify Attachments tab UI using POM locators and helper methods
    const patientName = TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME;
    await expect(patientListPage.attachmentsHeading).toBeVisible();
    await expect(await patientListPage.getBreadcrumbText(patientName)).toBeVisible();
    await expect(await patientListPage.getPatientHeading(patientName)).toBeVisible();
  });

  test('Verify the structure and contents of the Attachments list @[116611] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Attachments tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openAttachmentsTab();

    // Verify Attachments table structure using POM locators and helper methods
    const patientName = TEST_DATA.SEARCH_TERMS.VALID_PATIENT_NAME;
    await expect(patientListPage.attachmentsHeading).toBeVisible();
    await expect(await patientListPage.getBreadcrumbText(patientName)).toBeVisible();
    await expect(await patientListPage.getPatientHeading(patientName)).toBeVisible();
    await expect(patientListPage.attachmentColumnHeader).toBeVisible();
    await expect(patientListPage.dateColumnHeader).toBeVisible();
    await expect(patientListPage.submittedByColumnHeader).toBeVisible();
    await expect(patientListPage.downloadAttachmentLink).toBeVisible();
    await expect(patientListPage.viewAttachmentDetailsLink).toBeVisible();
  });

  test('Verify that clicking View details in the attachments tab opens the Session Details screen @[116612] @provider @functional', async ({
    page,
  }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Attachments tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openAttachmentsTab();

    // Click View details link for first attachment using POM locator and verify Session Details opens
    await patientListPage.viewAttachmentDetailsLink.click();
    await expect(patientListPage.sessionDetailsText.first()).toBeVisible();
  });

  test('Verify the Download icon behavior for an attachment @[116613] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Attachments tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openAttachmentsTab();

    // Download attachment using POM method and verify new tab opens
    const newTab = await patientListPage.downloadAttachment();
    await newTab.waitForLoadState();
    expect(newTab.url()).toBeTruthy();
    await newTab.close();
  });

  test('Verify behavior when there are no attachments for a patient @[116614] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Attachments tab using POM methods
    await patientListPage.openHatsunePatientDetails();
    await patientListPage.openAttachmentsTab();

    // Verify No Attachments message using POM locator
    await expect(patientListPage.noAttachmentsMessage).toBeVisible();
  });

  test('Verify behavior of "Open visit notes" link in Visit Notes tab @[116615] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details and navigate to Visit Notes tab using POM methods
    await patientListPage.openCodyPatientDetails();
    await patientListPage.openVisitNotesTab();

    await patientListPage.viewLink.click();
    await expect(patientListPage.visitNotesHeading).toBeVisible();
  });

  test('Verify Export Visit Summary to PDF icon functionality in Past Sessions tab @[116645] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Download VSR using POM method
    const download = await patientListPage.downloadVSR();

    // Verify download success message and file using POM locators and methods
    await expect(patientListPage.visitSummaryDownloadMessage).toBeVisible();
    const fileName = await download.suggestedFilename();
    await patientListPage.saveDownloadToPath(download, fileName);
    expect(fileName).toBeTruthy();
  });

  test('Verify View Details link opens Session Details slide-out in Past Sessions tab @[116646] @provider @functional', async ({
    page,
  }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Click View details link using POM locator
    await patientListPage.viewDetailsLink.click();

    // Verify Session Details slide-out UI elements using POM locators
    await expect(patientListPage.sessionDetailsModal).toBeVisible();
    await expect(patientListPage.sessionDetailsTabs).toBeVisible();
    await expect(patientListPage.participantsSection).toBeVisible();
  });

  test('Verify that the "Patients" link navigates back to the Patient List screen @[116647] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Open first patient details using POM method
    await patientListPage.openCodyPatientDetails();

    // Navigate back to Patient List using POM method
    await patientListPage.navigateBackToPatientList();

    // Verify Patient List screen UI elements using POM locators
    await expect(patientListPage.myPatientsHeading).toBeVisible();
    await expect(patientListPage.nameColumnHeader).toBeVisible();
    await expect(patientListPage.emailColumnHeader).toBeVisible();
    await expect(patientListPage.phoneColumnHeader).toBeVisible();
  });
});

//////?????????????????????????????????????????????????????????????????
//  eDocuments

test.describe('Provider - eDocuments @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let dashboardPage;
  let patientListPage;

  test.beforeEach(async ({ page }) => {
    patientListPage = new PatientListPage(page);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoProviderDashboard();
  });

  test('Verify empty state is shown when Patient has no documents @[119944] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with no documents using POM method
    await patientListPage.openHatsunePatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Verify no documents message
    await expect(page.getByText('This patient has no documents')).toBeVisible();
  });

  test('Verify "Documents" table structure and columns @[119942] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Verify Documents table structure
    await expect(page.getByTestId('table')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Document name' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Submission date' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Session ID' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Status ChevronSelectorVertical' })).toBeVisible();
  });

  test('Verify "Documents" tab is visible on Patients screen @[119945] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Observe the documents tab
    await expect(page.getByText('Documents')).toBeVisible();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Verify table is visible
    await expect(page.getByTestId('table')).toBeVisible();
  });

  test.skip('Verify "Documents" table columns sorting @[119946] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // get the value of the first cell, getByTestId('cell-0-title')
    const firstDocumentName = await page.getByTestId('cell-0-title').innerText();

    // Sort by Document Name
    await page.getByTestId('sort-button-title').click();
    const sortedFirstDocumentName = await page.getByTestId('cell-0-title').innerText();

    // Verify Sorting changed the order
    expect(sortedFirstDocumentName).not.toBe(firstDocumentName);

    // get the value of the getByTestId('cell-0-sessionId') cell
    const firstSessionId = await page.getByTestId('cell-0-sessionId').innerText();
    // Sort by Session ID
    await page.getByTestId('sort-button-sessionId').click();
    await page.getByTestId('sort-button-sessionId').click();
    const sortedFirstSessionId = await page.getByTestId('cell-0-sessionId').innerText();

    // Verify Sorting changed the order
    expect(sortedFirstSessionId).not.toBe(firstSessionId);
  });

  test.skip('Verify "Documents" pagination controls @[119947] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Verify Previous button is disabled on first page
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();

    // Click Next button to go to next page
    await page.getByRole('button', { name: 'Next' }).click();

    // Verify Previous button is enabled on second page
    await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();

    // Click Previous button to go back to first page
    await page.getByRole('button', { name: 'Previous' }).click();

    // Verify Previous button is disabled on first page again
    await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  test('Verify "Documents" Submission date logic when submitted only by Patient @[119948] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Find the first row with 'Completed' status and verify it has a submission date
    let completedRowIndex = -1;

    // Loop through rows to find the first 'Completed' status
    for (let i = 0; i < 10; i++) {
      // Check first 10 rows (adjust as needed)
      const statusCell = page.getByTestId(`cell-${i}-status`);
      if (await statusCell.getByText('Completed').isVisible()) {
        completedRowIndex = i;
        break;
      }
    }

    // Verify a completed row was found
    expect(completedRowIndex).toBeGreaterThanOrEqual(0);

    // Verify the submission date exists for the completed row
    const dateCell = page.getByTestId(`cell-${completedRowIndex}-date`);
    await expect(dateCell).toBeVisible();
    const dateValue = await dateCell.innerText();
    expect(dateValue.trim().length).toBeGreaterThan(0);
  });

  test.skip('Verify “Documents” Submission date logic for Patient + Provider (latest submission) @[119949] @provider @functional', async ({
    page,
  }) => {});

  test.skip('Verify “Documents” Status value rendering and colors @[119951] @provider @functional', async ({ page }) => {});

  test('Verify "Documents" View link opens document preview @[119952] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Click on View link for first document & verify preview opens
    const page4Promise = page.waitForEvent('popup');
    await page.getByTestId('cell-0-action').getByRole('link', { name: 'View' }).click();
    const page4 = await page4Promise;
  });

  test.skip('Verify “Documents” Backfrom preview returns to Patients/Documents tab @[119953] @provider @functional', async ({
    page,
  }) => {});

  test('Verify "Documents" table Session ID presence and consistency @[119954] @provider @functional', async ({ page }) => {
    // Navigate to patient list
    await patientListPage.navigateToMyPatients();

    // Click on patient with documents using POM method
    await patientListPage.openCodyPatientDetails();

    // Click on documents tab
    await page.getByText('Documents').click();

    // Loop through first 10 rows to verify Session IDs are present and unique per document name
    const sessionIdToDocuments = new Map(); // Map to track Session ID -> Set of Document names

    for (let i = 0; i < 10; i++) {
      // Check first 10 rows (adjust as needed)
      const documentNameCell = page.getByTestId(`cell-${i}-title`);
      const sessionIdCell = page.getByTestId(`cell-${i}-sessionId`);
      if ((await documentNameCell.isVisible()) && (await sessionIdCell.isVisible())) {
        const documentName = await documentNameCell.innerText();
        const sessionId = await sessionIdCell.innerText();

        // Verify Session ID is present and not empty
        expect(sessionId.trim().length).toBeGreaterThan(0);

        // Verify Session ID follows expected format (starts with #)
        expect(sessionId).toMatch(/^#[A-Z0-9]+$/);

        // Track Session ID and Document name combinations
        if (!sessionIdToDocuments.has(sessionId)) {
          sessionIdToDocuments.set(sessionId, new Set());
        }

        // Verify this Document name hasn't been seen with this Session ID before
        const documentSet = sessionIdToDocuments.get(sessionId);
        expect(documentSet.has(documentName)).toBeFalsy();
        documentSet.add(documentName);
      }
    }

    // Verify at least one session ID was found
    expect(sessionIdToDocuments.size).toBeGreaterThan(0);
  });
});
