import { BasePage } from '../../base-page.js';

export class PatientListPage extends BasePage {
  constructor(page) {
    super(page);

    // Main page elements
    this.myPatientsLink = page.getByText('My Patients');
    this.myPatientsHeading = page.getByRole('heading', { name: 'My patients' });
    this.myPatientsText = page.getByText('My patients').first();

    // Patient List Table elements
    this.nameColumnHeader = page.getByRole('cell', { name: 'Name ChevronSelectorVertical' });
    this.emailColumnHeader = page.getByRole('cell', { name: 'Email ChevronSelectorVertical' });
    this.phoneColumnHeader = page.getByRole('cell', { name: 'Phone ChevronSelectorVertical' });
    this.scheduleSessionIcon = page.getByRole('link', { name: 'CalendarPlus' }).first();

    // Search functionality
    this.searchBox = page.getByRole('textbox', { name: 'Search by name, email or' });

    // Sort buttons
    this.sortButtonName = page.getByTestId('sort-button-name');
    this.sortButtonEmail = page.getByTestId('sort-button-email');
    this.sortButtonPhone = page.getByTestId('sort-button-phone');
    this.sortButtonDate = page.getByTestId('sort-button-date');
    this.sortButtonService = page.getByTestId('sort-button-service');
    this.sortButtonUser = page.getByTestId('sort-button-user');

    // Sort icons
    this.chevronUpIcon = page.getByTestId('icon-ChevronUp');
    this.chevronDownIcon = page.getByTestId('icon-ChevronDown');

    // Patient data cells (dynamic, first patient)
    this.firstPatientNameCell = page.getByTestId('cell-0-name');
    this.firstPatientDateCell = page.getByTestId('cell-0-date');
    this.firstPatientServiceCell = page.getByTestId('cell-0-service');
    this.firstPatientActionsCell = page.getByTestId('cell-0-actions');

    // Schedule Session Modal
    this.scheduleSessionModal = page
      .locator('div')
      .filter({ hasText: /^Schedule a session$/ })
      .first();

    // Patient Details View elements
    this.patientCard = page.getByTestId('card').first();
    this.emailLabel = page.getByText('Email');
    this.phoneNumberLabel = page.getByText('Phone number');
    this.locationLabel = page.getByText('Location');
    this.taxIdLabel = page.getByText('Tax ID');
    this.insuranceLabel = page.getByText('Insurance', { exact: true });
    this.insurancePolicyLabel = page.getByText('Insurance policy number');
    this.scheduleSessionButton = page.getByRole('button', { name: 'CalendarPlus Schedule session' });

    // Patient Details Tabs
    this.pastSessionsTab = page.getByText('Past sessions').nth(1);
    this.visitNotesTab = page.getByText('Visit Notes');
    this.dischargeInstructionsTab = page.getByText('Discharge instructions');
    this.attachmentsTab = page.getByText('Attachments');

    // Past Sessions Tab elements
    this.pastSessionsHeading = page.getByRole('heading', { name: 'Past sessions' });
    this.pastSessionsTable = page.getByTestId('table');
    this.dateColumnHeader = page.getByRole('cell', { name: 'Date ChevronSelectorVertical' });
    this.serviceColumnHeader = page.getByRole('cell', { name: 'Service' });
    this.providerColumnHeader = page.getByRole('cell', { name: 'Provider ChevronSelectorVertical' });
    this.typeColumnHeader = page.getByRole('cell', { name: 'Type ChevronSelectorVertical' });
    this.downloadVSRLink = page.getByTestId('cell-0-actions').getByRole('link', { name: 'Download VSR' });
    this.viewDetailsLink = page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' });

    // Filter elements
    this.serviceFilterLink = page.getByRole('link', { name: 'Service ChevronDown' });
    this.providerFilterLink = page.getByRole('link', { name: 'Provider ChevronDown' });
    this.typeFilterLink = page.getByRole('link', { name: 'Type ChevronDown' });
    this.typeFilterLink2 = page.getByRole('link', { name: 'Type 1 ChevronDown' });
    this.applyFilterButton = page.getByRole('button', { name: 'Apply Filter' });
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear filters' });
    this.filterPanel = page.getByTestId('filter-panel');

    // Filter options
    this.generalPracticeFilter = page.getByTestId('item General Practice').first();
    this.videoFilter = page.getByTestId('item Video');
    this.chatFilter = page.getByTestId('item Chat');

    // Pagination
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.nextButton = page.getByRole('button', { name: 'Next' });

    // Visit Notes Tab elements
    this.visitNotesHeading = page.getByRole('heading', { name: 'Visit notes' });
    this.exportAllButton = page.getByRole('button', { name: 'Download Export all' });
    this.viewLink = page.getByRole('link', { name: 'View' }).first();

    // Visit Notes Slide-out elements
    this.subjectiveHeading = page.getByRole('heading', { name: 'Subjective' });
    this.objectiveHeading = page.getByRole('heading', { name: 'Objective' });
    this.assessmentHeading = page.getByRole('heading', { name: 'Assessment' });
    this.planHeading = page.getByRole('heading', { name: 'Plan' });
    this.sessionDetailsButton = page.getByRole('button', { name: 'Session Details' });

    // Discharge Instructions Tab elements
    this.dischargeInstructionsHeading = page.getByRole('heading', { name: 'Discharge instructions' });

    // Attachments Tab elements
    this.attachmentsHeading = page.getByRole('heading', { name: 'Attachments' });
    this.attachmentColumnHeader = page.getByRole('cell', { name: 'Attachment' });
    this.submittedByColumnHeader = page.getByRole('cell', { name: 'Submitted by' });
    this.downloadAttachmentLink = page.getByTestId('cell-0-actions').getByRole('link', { name: 'Download Download' });
    this.viewAttachmentDetailsLink = page.getByTestId('cell-0-actions').getByRole('link', { name: 'View details' });

    // Session Details Modal
    this.sessionDetailsModal = page.getByText('Session Details').first();
    this.sessionDetailsDialog = page.getByRole('dialog').getByText('Session Details');
    this.sessionDetailsTabs = page.getByTestId('tabs');
    this.participantsSection = page.getByText('Participants');

    // Navigation elements
    this.patientsLink = page.getByText('Patients');
    this.myPatientsBackLink = page.getByText('My Patients');

    // Coordinator-specific elements
    this.patientsHeading = page.getByRole('heading', { name: 'Patients' });
    this.onlyMyPatientsText = page.getByText('Only my patients');
    this.switchDiv = page.getByTestId('switch-div');
    this.cardElement = page.getByTestId('card');
    this.noPatientsYetText = page.getByText('No patients yet');

    // Patient-specific elements
    this.automationTestDeviceText = page.getByText('Automation Test Device');

    // Message elements
    this.noVisitNotesMessage = page.getByText('There are currently no visit notes associated with this patient.');
    this.noPastSessionsMessage = page.getByText('no past sessions yet.');
    this.noDischargeInstructionsMessage = page.getByText('There are currently no discharge instructions associated with this patient.');
    this.noAttachmentsMessage = page.getByText('This patient has no attachments yet.');
    this.sessionDetailsText = page.getByText('Session details');

    // Success messages
    this.visitSummaryDownloadMessage = page.getByText('Visit summary report downloading started');
    this.visitNotesDownloadMessage = page.getByText('Visit notes report downloading started');

    // Type chat filter text locator
    this.typeChatFilterText = page.getByText('Chat');
  }

  // Navigation methods
  // provider
  async navigateToMyPatients() {
    await this.myPatientsLink.click();
    await this.myPatientsHeading.waitFor({ state: 'visible' });
  }

  async navigateBackToPatientList() {
    await this.myPatientsBackLink.click();
    await this.myPatientsHeading.waitFor({ state: 'visible' });
  }

  async navigateToPatients() {
    await this.patientsLink.click();
    await this.patientsHeading.waitFor({ state: 'visible' });
  }

  async toggleOnlyMyPatients() {
    await this.switchDiv.click();
  }

  async openGregJamesPatientDetails() {
    await this.gregJamesCell.click();
  }

  async openAutomationTestDevice() {
    await this.automationTestDeviceText.first().click();
  }

  // Helper method to get breadcrumb text
  async getBreadcrumbText(patientName) {
    return this.page.getByText(`Patients/${patientName}`);
  }

  // Helper method to get patient heading
  async getPatientHeading(patientName) {
    return this.page.getByRole('heading', { name: patientName });
  }

  // Multi-step action methods for patient list
  async searchForPatient(searchTerm) {
    await this.searchBox.click();
    await this.searchBox.fill(searchTerm);
    await this.page.waitForTimeout(300); // Allow search to process
  }

  async clearSearch() {
    await this.searchBox.clear();
    await this.page.waitForTimeout(300);
  }

  async clickScheduleSessionForFirstPatient() {
    const patientName = await this.firstPatientNameCell.innerText();
    await this.scheduleSessionIcon.click();
    await this.scheduleSessionModal.waitFor({ state: 'visible' });
    return patientName;
  }

  async openCodyPatientDetails() {
    const patientNameLocator = this.page.getByTestId(/^cell-\d+-name$/).filter({ hasText: 'cody' });
    const patientName = await patientNameLocator.innerText();
    await patientNameLocator.click();
    await this.patientCard.waitFor({ state: 'visible' });
    return patientName;
  }

  async openHatsunePatientDetails() {
    const patientNameLocator = this.page.getByTestId(/^cell-\d+-name$/).filter({ hasText: 'hatsune' });
    const patientName = await patientNameLocator.innerText();
    await patientNameLocator.click();
    await this.patientCard.waitFor({ state: 'visible' });
    return patientName;
  }

  // Multi-step action methods for patient details tabs
  async openVisitNotesTab() {
    await this.visitNotesTab.click();
    await this.visitNotesHeading.waitFor({ state: 'visible' });
  }

  async openDischargeInstructionsTab() {
    await this.dischargeInstructionsTab.click();
    await this.dischargeInstructionsHeading.waitFor({ state: 'visible' });
  }

  async openAttachmentsTab() {
    await this.attachmentsTab.click();
    await this.attachmentsHeading.waitFor({ state: 'visible' });
  }

  async openDocumentsTab() {
    await this.documentsTab.click();
    await this.documentsHeading.waitFor({ state: 'visible' });
  }

  async openPastSessionsTab() {
    await this.pastSessionsTab.click();
    await this.pastSessionsHeading.waitFor({ state: 'visible' });
  }

  // Multi-step action methods for visit notes
  async openVisitNotesSlideOut() {
    await this.viewLink.click();
    await this.visitNotesHeading.waitFor({ state: 'visible' });
  }

  async openSessionDetailsFromVisitNotes() {
    await this.sessionDetailsButton.click();
    await this.sessionDetailsDialog.waitFor({ state: 'visible' });
  }

  async openSessionDetailsFromDischargeInstructions() {
    await this.sessionDetailsButton.click();
    await this.sessionDetailsDialog.waitFor({ state: 'visible' });
  }

  // Multi-step action methods for downloads
  async downloadVSR() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadVSRLink.click();
    const download = await downloadPromise;
    return download;
  }

  async downloadAllVisitNotes() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportAllButton.click();
    const download = await downloadPromise;
    return download;
  }

  async downloadAttachment() {
    const newTabPromise = this.page.context().waitForEvent('page');
    await this.downloadAttachmentLink.click();
    const newTab = await newTabPromise;
    return newTab;
  }

  // Multi-step action methods for filtering
  async applyServiceFilter(serviceName) {
    await this.serviceFilterLink.click();
    await this.page.getByTestId(`item ${serviceName}`).first().click();
    await this.applyFilterButton.click();
  }

  async applyProviderFilter(providerName) {
    await this.providerFilterLink.click();
    await this.page.getByTestId(`item ${providerName}`).click();
    await this.applyFilterButton.click();
  }

  async applyTypeFilter(typeName) {
    await this.typeFilterLink.click();
    await this.page.getByTestId(`item ${typeName}`).click();
    await this.applyFilterButton.click();
  }

  async applySecondaryTypeFilter(typeName) {
    await this.typeFilterLink2.click();
    await this.page.getByTestId(`item ${typeName}`).click();
    await this.applyFilterButton.click();
  }

  async clearAllFilters() {
    await this.clearFiltersButton.click();
  }

  // Multi-step action methods for sorting
  async sortByDate() {
    await this.sortButtonDate.click();
  }

  async sortByService() {
    await this.sortButtonService.click();
  }

  async sortByName() {
    await this.sortButtonName.click();
  }

  async sortByEmail() {
    await this.sortButtonEmail.click();
  }

  async sortByPhone() {
    await this.sortButtonPhone.click();
  }

  async sortByUser() {
    await this.sortButtonUser.click();
  }

  // Helper methods for data retrieval
  async getFirstPatientName() {
    return await this.firstPatientNameCell.innerText();
  }

  async getFirstPatientDate() {
    return await this.firstPatientDateCell.innerText();
  }

  async getFirstPatientService() {
    return await this.firstPatientServiceCell.innerText();
  }

  // Helper methods for file downloads
  async saveDownloadToPath(download, fileName) {
    const filePath = './downloads/' + fileName;
    await download.saveAs(filePath);
    return fileName;
  }
}
