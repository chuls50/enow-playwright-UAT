import { BasePage } from '../../base-page.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Dashboard Elements
    // this.header = page.getByText('Global Healthcare');
    this.availabilitySwitch = page.getByText('Available');
    this.profileIcon = page.locator('div:nth-child(2) > .sc-fbguzk');

    // Navigation Elements
    this.navbar = page.getByTestId('navigation');
    this.navbarInstitutionLogo = page
      .getByTestId('navigation')
      .getByTestId('avatar')
      .locator('div')
      .nth(1);
    this.navbarDashboard = page.locator('a').filter({ hasText: 'Dashboard' });
    this.navbarPastSessions = page
      .locator('a')
      .filter({ hasText: 'Past Sessions' });
    this.navbarProviders = page.locator('a').filter({ hasText: 'Providers' });

    // Your schedule for today
    this.todaySchedule = page.getByRole('heading', {
      name: 'Your schedule for today',
    });
    this.todayScheduleDropSelect = page
      .getByTestId('dropselect')
      .getByTestId('icon');
    this.scheduleSessionButton = page.getByRole('button', {
      name: 'CalendarPlus Schedule session',
    });

    // Session requests
    this.sessionRequests = page.getByText('Session requests');
    this.allRequests = page.getByRole('link', {
      name: 'All requests ArrowNarrowRight',
    });
    this.sessionRequestsLeft = page.getByRole('button', {
      name: 'ChevronLeft',
    });
    this.sessionRequestsRight = page.getByRole('button', {
      name: 'ChevronRight',
    });

    // User profile section Providers
    this.userProfileSection = page.getByTestId('popover-content');

    // Notifications
    this.notificationBell = page.getByRole('link', { name: 'Bell' });
    this.notificationPopover = page.getByRole('heading', {
      name: 'Notifications',
    });
    this.notificationsClearAllButton = page.getByRole('link', {
      name: 'Eraser Clear all',
    });
    this.notificationsXClose = page.getByRole('button', { name: 'XClose' });

    // OnDemand Availability Panel
    this.onDemandButton = page.getByRole('button', {
      name: 'OnDemand On demand requests',
    });
    this.availableToggle = page.getByText('Available');
    this.availabilitySwitch = page.getByTestId('switch-div');
    this.onDemandCloseButton = page.getByRole('button', { name: 'XClose' });

    // Mobile Elements
    this.bottomNavbar = page.getByTestId('bottom-navigation');

    // Schedule Elements
    this.todayScheduleText = page.getByText('Your schedule for today');
    this.allSessionsLink = page.getByText('Your schedule all sessions');
    this.mainCard = page.getByTestId('main-card');

    // Past Sessions
    this.pastSessionsLink = page
      .locator('a')
      .filter({ hasText: 'Past sessions' });
    this.pastSessionsHeading = page.getByRole('heading', {
      name: 'Past sessions',
    });
    this.table = page.getByTestId('table');
    this.viewDetailsLink = page.getByRole('link', { name: 'View details' });

    // My Patients
    this.myPatientsLink = page.locator('a').filter({ hasText: 'My Patients' });
    this.myPatientsHeading = page.getByRole('heading', { name: 'My patients' });
    this.emailColumn = page.getByText('Email');
    this.phoneColumn = page.getByText('Phone');
    this.calendarPlusLink = page.getByRole('link', { name: 'CalendarPlus' });

    // Session Details Modal
    this.sessionDetailsText = page.getByText('Session Details');
    this.overviewTab = page.getByRole('button', { name: 'Overview' });
    this.symptomsTab = page.getByRole('button', { name: 'Symptoms' });
    this.summaryTab = page.getByRole('button', { name: 'Summary' });
    this.attachmentsTab = page.getByRole('button', { name: 'Attachments' });
    this.paymentsTab = page.getByRole('button', { name: 'Payments' });
    this.closeModalButton = page.getByRole('button', { name: 'XClose' });
    this.participantsText = page.getByText('Participants');
    this.cardElement = page.getByTestId('card');

    // Symptoms Tab
    this.describedSymptomsText = page.getByText('Described symptoms');

    // Summary Tab
    this.visitSummaryText = page.getByText('Visit Summary reportExport PDF');
    this.exportPdfLink = page.getByRole('link', {
      name: 'Download Export PDF',
    });
    this.visitNotesText = page.getByText('Visit Notes');
    this.addVisitNoteLink = page.getByRole('link', {
      name: 'Plus Add visit note',
    });
    this.modal = page.getByTestId('modal');
    this.accordionElement = page.getByTestId('accordion');

    // Visit Note Modal
    this.subjectiveTextbox = page.getByRole('textbox', {
      name: 'Type Subjective here',
    });
    this.objectiveTextbox = page.getByRole('textbox', {
      name: 'Type Objective here',
    });
    this.assessmentTextbox = page.getByRole('textbox', {
      name: 'Type Assessment here',
    });
    this.planTextbox = page.getByRole('textbox', { name: 'Type Plan here' });
    this.addVisitNoteButton = page.getByRole('button', {
      name: 'Add visit note',
    });

    // Discharge Instructions
    this.dischargeInstructionsText = page.getByText('Discharge instructions', {
      exact: true,
    });
    this.editDischargeLink = page.getByRole('link', { name: 'Edit Edit' });
    this.dischargeInstructionsTextbox = page.getByRole('textbox', {
      name: 'Type discharge instructions',
    });
    this.saveChangesButton = page.getByRole('button', { name: 'Save changes' });

    // PDF Export
    this.exportPdfButton = page.getByRole('button', { name: 'Export PDF' });
    this.modalCheckbox = page.getByTestId('modal').locator('label span');

    // Attachments Tab
    this.uploadFilesDiv = page
      .locator('div')
      .filter({ hasText: /^Upload filesChoose files$/ });
    this.chooseFilesLink = page.getByRole('link', { name: 'Choose files' });

    // Payments Tab
    this.paymentsHeading = page.getByRole('heading', { name: 'Payments' });

    // Patient Details
    this.patientCard = page.getByTestId('card');
    this.pastSessionsHeadingOnPatient = page.getByRole('heading', {
      name: 'Past sessions',
    });
    this.dateServiceProviderText = page.getByText(
      'DateServiceProviderTypeClear'
    );
    this.downloadVsrLink = page
      .getByTestId('cell-0-actions')
      .getByRole('link', { name: 'Download VSR' });
    this.viewDetailsFromPatient = page
      .getByTestId('cell-0-actions')
      .getByRole('link', { name: 'View details' });
    this.visitNotesParagraph = page
      .getByRole('paragraph')
      .filter({ hasText: 'Visit Notes' });

    // Account Settings
    this.popoverTrigger = page.getByTestId('popover-trigger');
    this.avatarDiv = page
      .getByTestId('avatar')
      .locator('div')
      .filter({ hasText: 'CP' })
      .locator('div');
    this.accountSettingsButton = page.getByRole('button', {
      name: 'SettingsGear Account settings',
    });
  }

  // Navigation Methods
  async gotoProviderDashboard() {
    await this.page.goto(`${process.env.UAT_URL}/dashboard`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    // Wait for Provider dashboard to load
    await this.todaySchedule.waitFor({ state: 'visible' });
  }

  // Multi-step actions that warrant POM methods
  async openUserProfileMenu() {
    await this.profileIcon.click();
  }

  async toggleAvailability() {
    const isAvailable = await this.availabilitySwitch.isChecked();
    if (isAvailable) {
      await this.availabilitySwitch.uncheck();
    } else {
      await this.availabilitySwitch.check();
    }
    return !isAvailable; // Return the new state for verification in tests
  }

  async clearAllNotifications() {
    await this.notificationBell.click();
    await this.notificationsClearAllButton.click();
    await this.notificationsXClose.click();
  }

  async navigateToAllSessions() {
    await this.todayScheduleText.click();
    await this.allSessionsLink.click();
    await this.allSessionsLink.first().click();
  }

  async openFirstSessionDetails() {
    await this.mainCard.first().click();
  }

  async navigateToAllSessionsAndOpenFirst() {
    await this.navigateToAllSessions();
    await this.openFirstSessionDetails();
  }

  async addVisitNote(subjective, objective, assessment, plan) {
    await this.summaryTab.click();

    if (await this.addVisitNoteLink.isVisible()) {
      await this.addVisitNoteLink.click();
      await this.modal.waitFor({ state: 'visible' });

      await this.subjectiveTextbox.click();
      await this.subjectiveTextbox.fill(subjective);
      await this.objectiveTextbox.click();
      await this.objectiveTextbox.fill(objective);
      await this.assessmentTextbox.click();
      await this.assessmentTextbox.fill(assessment);
      await this.planTextbox.click();
      await this.planTextbox.fill(plan);

      await this.addVisitNoteButton.click();
    }
  }

  async addDischargeInstructions(instructions) {
    await this.editDischargeLink.click();
    await this.dischargeInstructionsTextbox.click();
    await this.dischargeInstructionsTextbox.fill(instructions);
    await this.saveChangesButton.click();
  }

  async exportSessionPdf() {
    await this.summaryTab.click();
    await this.exportPdfLink.click();
    await this.modalCheckbox.click();

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportPdfButton.click(),
    ]);

    const fileName = await download.suggestedFilename();
    const filePath = './downloads/' + fileName;
    await download.saveAs(filePath);
    return fileName;
  }

  async navigateToPastSessions() {
    await this.pastSessionsLink.click();
  }

  async navigateToMyPatients() {
    await this.myPatientsLink.click();
  }

  async openAccountSettings() {
    await this.popoverTrigger
      .getByTestId('avatar')
      .locator('div')
      .filter({ hasText: 'CP' })
      .locator('div')
      .click();
    await this.accountSettingsButton.click();
  }

  async openOnDemandPanel() {
    await this.onDemandButton.click();
  }

  async closeOnDemandPanel() {
    await this.onDemandCloseButton.click();
  }

  async toggleAvailabilityOn() {
    await this.openOnDemandPanel();
    await this.availableToggle.click();
    await this.closeOnDemandPanel();
  }

  async toggleAvailabilityOff() {
    await this.openOnDemandPanel();
    await this.availableToggle.click();
  }

  async openNotificationPanel() {
    await this.notificationBell.click();
  }
}
