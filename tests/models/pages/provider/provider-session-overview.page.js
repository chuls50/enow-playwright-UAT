import { BasePage } from '../../base-page.js';

export class ProviderSessionOverviewPage extends BasePage {
  constructor(page) {
    super(page);

    // Session Scheduling Elements
    this.scheduleSessionButton = page.getByRole('button', { name: 'CalendarPlus Schedule session' });
    this.changePatientLink = page.getByRole('link', { name: 'Change patient' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.timeSlotContainer = page.locator('._container_1hd2b_1');
    this.scheduleVisitButton = page.getByRole('button', { name: 'Schedule visit' });

    // Toast Messages
    this.sessionScheduledToast = page.getByTestId('toast').getByText('Session scheduled', { exact: true });
    this.successToast = page.getByText('Success');
    this.sessionRescheduledMessage = page.getByRole('paragraph').filter({ hasText: 'Session rescheduled' });
    this.sessionCanceledToast = page.getByText('Session canceled');
    this.sessionRequestAcceptedMessage = page.getByText('Session request accepted');
    this.invitationLinkCopiedMessage = page.getByText('Invitation link copied');

    // Session Cards and Status
    this.sessionScheduledCard = page.getByText('Session scheduled').first();
    this.sessionCancelledCard = page.getByText('Session cancelled').first();
    this.mainCard = page.getByTestId('main-card');
    this.confirmedAppointmentCard = page.locator('div[data-testid="main-card"].sc-hlDTgW.enzraZ');

    // Session Details Modal
    this.sessionDetailsHeader = page.getByText('Session Details');
    this.scheduledDurationText = page.getByText('Scheduled duration');
    this.videoIcon = page.getByRole('img', { name: 'Video' }).getByTestId('icon-Video');
    this.clockStopwatchIcon = page.getByTestId('icon-ClockStopwatch');
    this.closeModalButton = page.getByRole('button', { name: 'XClose' });

    // Session Tabs
    this.overviewTab = page.getByRole('button', { name: 'Overview' });
    this.symptomsTab = page.getByRole('button', { name: 'Symptoms' });
    this.summaryTab = page.getByRole('button', { name: 'Summary' });
    this.attachmentsTab = page.getByRole('button', { name: 'Attachments' });
    this.paymentsTab = page.getByRole('button', { name: 'Payments' });

    // Three Dots Menu (DotsV) Actions
    this.dotsVButton = page.getByRole('button', { name: 'DotsV' });
    this.rescheduleButton = page.getByRole('button', { name: 'CalendarRepeat Reschedule' });
    this.cancelSessionButton = page.getByRole('button', { name: 'XCircle Cancel session' });

    // Cancel Session Modal
    this.cancelSessionModal = page.getByTestId('modal');
    this.yesCancelButton = page.getByRole('button', { name: 'Yes, cancel' });
    this.noDontCancelButton = page.getByRole('button', { name: 'No, don’t cancel' });

    // Reschedule Modal
    this.rescheduleModal = page.getByText('Reschedule session');
    this.rescheduleConfirmButton = page.getByRole('button', { name: 'Reschedule' });
    this.rescheduleCancelButton = page.getByRole('button', { name: 'Cancel' });

    // Add Participants Elements
    this.addParticipantsDropdown = page.getByRole('link', { name: 'Add participant(s) ChevronDown' });
    this.customDropdown = page.getByTestId('custom-dropdown');
    this.addExistingUsersOption = page.getByText('Add existing user(s)');
    this.inviteExternalUserOption = page.getByText('Invite external user');
    this.copyInvitationLinkOption = page.getByText('Copy invitation link');

    // Add Existing Users Modal
    this.searchByNameTextbox = page.getByRole('textbox', { name: 'Search by name' });
    this.addParticipantButton = page.getByRole('button', { name: 'Add participant' });

    // Join Session Elements
    this.joinVideoSessionButton = page.getByRole('button', { name: 'Video Join video session' });

    // Navigation Elements
    this.todayScheduleHeading = page.getByRole('heading', { name: 'Your schedule for today' });
    this.allSessionsLink = page.getByText('Your schedule all sessions');
    this.dateCard = page.getByTestId('date-card');

    // Patient Profile Elements (for participant viewing)
    this.firstNameField = page.getByText('First name');
    this.lastNameField = page.getByText('Last name');
    this.dobField = page.getByText('DOB');
    this.sexField = page.getByText('Sex assigned at birth');
    this.countryField = page.getByText('Country');
    this.stateField = page.getByText('State');
    this.cityField = page.getByText('City');
    this.zipCodeField = page.getByText('Zip code');
    this.address1Field = page.getByText('Address 1');
    this.address2Field = page.getByText('Address 2');
    this.phoneNumberField = page.getByText('Phone number');
    this.taxIdField = page.getByText('Tax ID');
    this.insuranceField = page.getByText('Insurance', { exact: true });
    this.insurancePolicyNumberField = page.getByText('Insurance policy number');

    // Video Session/Waiting Room Elements
    this.messageChatButton = page.getByRole('button', { name: 'MessageChatCircle' });
    this.fileHeartButton = page.getByRole('button', { name: 'FileHeart' });
    this.welcomeToWaitingRoomText = page.getByText('Welcome to waiting room!');
    this.whenYouAreReadyText = page.getByText('When you are ready to start');
    this.startSessionButton = page.getByRole('button', { name: 'Start session' });
    this.leaveWaitingRoomButton = page.getByRole('button', { name: 'LogOut Leave waiting room' });

    // Patient Context Elements (for multi-user tests)
    this.checkButton = page.getByRole('button', { name: 'Check' });
  }

  // Navigation Methods
  async gotoProviderDashboard() {
    await this.page.goto(`${process.env.UAT_URL}/dashboard`);

    // Wait for spinner to disappear if present
    await this.waitForSpinnerToDisappear();

    // Wait for Provider dashboard to load
    await this.scheduleVisitButton.waitFor({ state: 'visible' });
  }

  // Multi-step Session Management Methods

  async scheduleSessionForPatient(patientName) {
    await this.scheduleSessionButton.click();
    await this.changePatientLink.click();
    await this.page.getByText(patientName).click();
    await this.saveButton.click();
    await this.timeSlotContainer.first().click();
    await this.scheduleVisitButton.click();
    await this.sessionScheduledToast.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1000);
  }

  async openSessionDetails() {
    await this.sessionScheduledCard.first().click();
  }

  async cancelSession() {
    await this.dotsVButton.click();
    await this.cancelSessionButton.click();
    await this.yesCancelButton.click();
    await this.sessionCanceledToast.waitFor({ state: 'visible' });
  }

  async rescheduleSession() {
    await this.dotsVButton.click();
    await this.rescheduleButton.click();
    await this.timeSlotContainer.first().click();
    await this.rescheduleConfirmButton.click();
  }

  async cancelReschedule() {
    await this.dotsVButton.click();
    await this.rescheduleButton.click();
    await this.timeSlotContainer.first().click();
    await this.rescheduleCancelButton.click();
  }

  async addExistingUser(userName) {
    await this.addParticipantsDropdown.click();
    await this.addExistingUsersOption.click();
    await this.page.getByText(userName).first().click();
    await this.addParticipantButton.click();
  }

  async copyInvitationLink() {
    await this.addParticipantsDropdown.click();
    await this.copyInvitationLinkOption.click();
  }

  async navigateToAllSessions() {
    await this.todayScheduleHeading.click();
    await this.allSessionsLink.click();
    await this.allSessionsLink.first().click();
  }
}
