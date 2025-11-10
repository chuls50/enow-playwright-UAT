import { test, expect } from '@playwright/test';
import { EndUserLicenseAgreementPage } from '../../../../models/pages/shared/end-user-license-agreement.page.js';
import { BeforeWeGetStartedPage } from '../../../../models/pages/shared/before-we-get-started.page.js';
import { ROLES, useRole } from '../../../../utils/auth-helpers.js';

// Test Data Constants
const TEST_DATA = {
  VALIDATION: {
    VALID_NAMES: {
      FIRST: 'cody prov',
      FIRST_WITH_CHARS: 'cody prov.-cody prov',
      LAST: 'Cody Test Institution',
      LAST_WITH_CHARS: 'Cody Test Institution.-Cody Test Institution',
    },
    INVALID_NAMES: {
      FIRST: 'cody prov&',
      LAST: 'Cody Test Institution&',
    },
  },
};

test.describe('Provider - English @regression', () => {
  test.use(useRole(ROLES.PROVIDER));
  let eulaPage;
  let onboardingPage;

  test.beforeEach(async ({ page }) => {
    eulaPage = new EndUserLicenseAgreementPage(page);
    onboardingPage = new BeforeWeGetStartedPage(page);
  });

  test('English - Verify the presence of web elements and texts on the EULA page @[112495] @provider @ui', async ({ page }) => {
    // Login as provider and navigate to EULA
    await eulaPage.navigateToEula();

    // ensure page is English
    await eulaPage.changeLanguageToEnglish();

    // Verify EULA page elements using POM
    await expect(eulaPage.pageTitle).toBeVisible();
    await expect(eulaPage.acceptButton).toBeVisible();
    await expect(eulaPage.declineButton).toBeVisible();
  });

  // declining the EULA will log you out and interfear with the saved storage state
  test.skip('Verify the "Decline" button functionality on the EULA page @[112501] @provider @functional', async ({ page }) => {
    // Login as provider and navigate to EULA
    await eulaPage.navigateToEula();

    // ensure page is English
    await eulaPage.changeLanguageToEnglish();

    // Verify EULA page elements using POM
    await expect(eulaPage.chevronDownIcon).toBeVisible();
    await expect(eulaPage.pageTitle).toBeVisible();
    await expect(eulaPage.acceptButton).toBeVisible();
    await expect(eulaPage.declineButton).toBeVisible();

    // Test decline modal functionality using POM
    await eulaPage.cancelDeclineEula();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify the "Accept" Button functionality on "End User License Agreement" @[112500] @provider @functional', async ({ page }) => {
    // Login as provider and navigate to EULA
    await eulaPage.navigateToEula();

    // ensure page is English
    await eulaPage.changeLanguageToEnglish();

    // click Accept
    await eulaPage.acceptEula();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Verify the elements and appearance of the Before we get started form @[112494] @provider @ui', async ({}) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // Verify page elements using POM
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.firstNameLabel).toBeVisible();
    await expect(onboardingPage.lastNameLabel).toBeVisible();

    // Verify pre-filled values
    const firstNameValue = await onboardingPage.firstNameInput.inputValue();
    await expect(onboardingPage.firstNameInput).toHaveValue(firstNameValue);

    const lastNameValue = await onboardingPage.lastNameInput.inputValue();
    await expect(onboardingPage.lastNameInput).toHaveValue(lastNameValue);

    // Verify provider-specific elements
    await expect(onboardingPage.languagesSpokenHeading).toBeVisible();
    await expect(onboardingPage.medicalSpecialtyLabel).toBeVisible();
    await expect(onboardingPage.licensesToPracticeHeading).toBeVisible();
    await expect(onboardingPage.timezoneHeading).toBeVisible();
    await expect(onboardingPage.changeTimezoneLink).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeVisible();
  });

  test('Verify the validation of the First name field on the Before we get started page @[112511] @provider @functional', async ({}) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // Verify page elements using POM
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.firstNameLabel).toBeVisible();
    await expect(onboardingPage.lastNameLabel).toBeVisible();

    // Test required field validation
    await onboardingPage.firstNameInput.click();
    await onboardingPage.clearFirstName();

    // Trigger validation by clicking elsewhere
    await onboardingPage.lastNameInput.click();
    await expect(onboardingPage.firstNameRequiredError).toBeVisible();

    // Test invalid characters
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.INVALID_NAMES.FIRST);
    await expect(onboardingPage.firstNameValidationError).toBeVisible();

    // Test valid inputs
    await onboardingPage.clearFirstName();
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.VALID_NAMES.FIRST_WITH_CHARS);
    await expect(onboardingPage.firstNameValidationError).not.toBeVisible();

    await onboardingPage.clearFirstName();
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.VALID_NAMES.FIRST);
    await expect(onboardingPage.firstNameValidationError).not.toBeVisible();
  });

  test('Verify the validation of the Last name field on the Before we get started page @[112513] @provider @functional', async ({}) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // Verify page elements using POM
    await expect(onboardingPage.pageTitle).toBeVisible();
    await expect(onboardingPage.firstNameLabel).toBeVisible();
    await expect(onboardingPage.lastNameLabel).toBeVisible();

    // Test last name validation using POM method
    await onboardingPage.validateLastNameField(TEST_DATA.VALIDATION.VALID_NAMES.LAST, TEST_DATA.VALIDATION.INVALID_NAMES.LAST);

    // Verify validation messages
    await expect(onboardingPage.lastNameRequiredError).toBeVisible();
    await onboardingPage.fillLastName(TEST_DATA.VALIDATION.INVALID_NAMES.LAST);
    await expect(onboardingPage.lastNameValidationError).toBeVisible();

    // Test valid inputs
    await onboardingPage.clearLastName();
    await onboardingPage.fillLastName(TEST_DATA.VALIDATION.VALID_NAMES.LAST_WITH_CHARS);
    await expect(onboardingPage.lastNameValidationError).not.toBeVisible();

    await onboardingPage.clearLastName();
    await onboardingPage.fillLastName(TEST_DATA.VALIDATION.VALID_NAMES.LAST);
    await expect(onboardingPage.lastNameValidationError).not.toBeVisible();
  });

  test('Verify the validation of languages spoken dropdown on Before we get started @[112512] @provider @functional', async ({ page }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // click spoken language dropdown
    await page.getByRole('textbox', { name: 'Select languages' }).click();
    await expect(page.getByRole('main').getByTestId('custom-dropdown')).toBeVisible();
    await page.getByRole('textbox', { name: 'Select languages' }).click();

    // remove english tag
    await page
      .locator('div')
      .filter({ hasText: /^Languages spokenLanguages spokenEnglish$/ })
      .getByRole('button')
      .click();

    // verify error message
    await expect(page.getByText('At least one language is')).toBeVisible();
  });

  test('Verify the validation of licenses to practice section on the Before we get started page @[112514] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // remove selected specialties to trigger validation
    await page
      .locator('div')
      .filter({ hasText: /^Angiologist$/ })
      .getByRole('button')
      .click();
    await page
      .locator('div')
      .filter({ hasText: /^Allergologist$/ })
      .getByRole('button')
      .click();

    // verify error message
    await expect(page.getByText('At least one medical')).toBeVisible();
  });

  test('Verify the validation of the Medical specialty drop down list on the Before we get started page @[112515] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // select medical specialty
    await page.getByRole('textbox', { name: 'Select medical specialities' }).click();
    await page.getByTestId('custom-dropdown-item-Cardiologist').click();
    await expect(page.getByTestId('tag').nth(2)).toBeVisible();

    // remove selected specialty
    await page.getByRole('button', { name: 'XClose' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Select medical specialities' }).click();
    await expect(page.getByText('Cardiologist')).not.toBeVisible();

    // remove remaining specialties to trigger validation
    await page
      .locator('div')
      .filter({ hasText: /^Angiologist$/ })
      .getByRole('button')
      .click();
    await page.getByRole('button', { name: 'XClose' }).first().click();

    // verify error message
    await expect(page.getByText('At least one medical')).toBeVisible();
  });

  test('Verify Availibility and Functionality of the Timezone section on the Before we get started page @[112517] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // change timezone
    await page.getByRole('link', { name: 'Change time zone' }).click();
    await page.getByText('Automatic time zone').click();
    await page.getByTestId('modal').getByTestId('icon-ChevronDown').click();
    await expect(page.getByTestId('custom-dropdown')).toBeVisible();
    await page.getByTestId('modal').getByTestId('icon-ChevronDown').click();
    await page.getByText('Automatic time zone').click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Verify Adding and Discarding Licenses on the Before we get started page @[112516] @provider @functional', async ({ page }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // add license
    await page.getByRole('link', { name: 'Plus Add license' }).click();

    await page.getByTestId('custom-select-item-wrapper').nth(3).click();
    await page.getByTestId('custom-dropdown-item-Albania').click();
    await page.getByTestId('custom-select-item-wrapper').nth(4).click();
    await page.getByTestId('custom-dropdown-item-Berat').click();
    await expect(page.getByText('CountryAlbania')).toBeVisible();
    await expect(page.getByText('StateBerat')).toBeVisible();
    await page.getByRole('link', { name: 'Remove License' }).click();

    // verify license removed
    await expect(page.getByText('CountryAlbania')).not.toBeVisible();
    await expect(page.getByText('StateBerat')).not.toBeVisible();
  });

  test('[Negative] Verify the validation of the First name field on Before we get started page @[112507] @provider @functional', async ({}) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // Test required field validation
    await expect(onboardingPage.firstNameLabel).toBeVisible();

    // Test first name validation with invalid characters
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.INVALID_NAMES.FIRST);
    await expect(onboardingPage.firstNameValidationError).toBeVisible();

    // Test valid input with special characters
    await onboardingPage.clearFirstName();
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.VALID_NAMES.FIRST_WITH_CHARS);
    await expect(onboardingPage.firstNameValidationError).not.toBeVisible();

    // Test invalid input with numbers
    await onboardingPage.clearFirstName();
    await onboardingPage.fillFirstName('123456789');
    await expect(onboardingPage.firstNameValidationError).toBeVisible();

    // Test valid input
    await onboardingPage.clearFirstName();
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.VALID_NAMES.FIRST);
    await expect(onboardingPage.firstNameValidationError).not.toBeVisible();
  });

  test('[Negative] Verify the validation of the Last name field on the Before we get started page @[112508] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // Test required field validation
    await expect(page.getByText('Last name*')).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter your last name' }).click();
    await page.getByRole('textbox', { name: 'Enter your last name' }).clear();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter your last name' }).fill('provider first time test&');
    await expect(page.getByText('Last name must contain at')).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter your last name' }).clear();
    await page.getByRole('textbox', { name: 'Enter your last name' }).fill('provider first time test.-provider first time test');
    await expect(page.getByText('Last name must contain at')).not.toBeVisible();
    await page.getByRole('textbox', { name: 'Enter your last name' }).clear();
    await page.getByRole('textbox', { name: 'Enter your last name' }).fill('provider first time test');
    await expect(page.getByText('Last name must contain at')).not.toBeVisible();
  });

  test('[Negative] Verify the validation of Languages spoken drop down list on the Before we get started page @[112509] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // click spoken language dropdown
    await page.getByRole('textbox', { name: 'Select languages' }).click();
    await expect(page.getByRole('main').getByTestId('custom-dropdown')).toBeVisible();
    await page.getByRole('textbox', { name: 'Select languages' }).click();

    // remove english tag
    await page
      .locator('div')
      .filter({ hasText: /^Languages spokenLanguages spokenEnglish$/ })
      .getByRole('button')
      .click();

    // verify error message
    await expect(page.getByText('At least one language is')).toBeVisible();
  });

  test('[Negative] Verify the validation of the Medical specialty drop down list on the Before we get started page @[112510] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // select medical specialty
    await page.getByRole('textbox', { name: 'Select medical specialities' }).click();
    await page.getByTestId('custom-dropdown-item-Cardiologist').click();
    await expect(page.getByTestId('tag').nth(2)).toBeVisible();

    // remove selected specialty
    await page.getByRole('button', { name: 'XClose' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Select medical specialities' }).click();
    await expect(page.getByText('Cardiologist')).not.toBeVisible();

    // remove remaining specialties to trigger validation
    await page
      .locator('div')
      .filter({ hasText: /^Angiologist$/ })
      .getByRole('button')
      .click();
    await page
      .locator('div')
      .filter({ hasText: /^Profile detailsFirst name\*Last name\*Medical specialityAllergologist$/ })
      .getByRole('button')
      .click();

    // verify error message
    await expect(page.getByText('At least one medical')).toBeVisible();
  });

  test('Verify Successful Form Submission and Redirection to Dashboard @[112502] @provider @functional', async ({ page }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is English
    await onboardingPage.ensurePageIsEnglish();

    // wait for page to load
    await onboardingPage.pageTitle.waitFor({ state: 'visible' });
    await expect(onboardingPage.pageTitle).toBeVisible();

    // make sure first name is 'cody prov'
    await onboardingPage.clearFirstName();
    await onboardingPage.fillFirstName(TEST_DATA.VALIDATION.VALID_NAMES.FIRST);

    // make sure last name is 'Cody Test Institution'
    await onboardingPage.clearLastName();
    await onboardingPage.fillLastName(TEST_DATA.VALIDATION.VALID_NAMES.LAST);

    // click 'Get Started' button
    await expect(onboardingPage.getStartedButton).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeEnabled();
    await onboardingPage.getStartedButton.click();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Provider - Spanish @regression', () => {
  let eulaPage;
  let onboardingPage;

  test.beforeEach(async ({ page }) => {
    eulaPage = new EndUserLicenseAgreementPage(page);
    onboardingPage = new BeforeWeGetStartedPage(page);
  });

  test.skip('[Spanish] Verify the elements and appearence of the "Antes de empezar" form @[112496] @provider @ui', async ({ page }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is Spanish
    await onboardingPage.ensurePageIsSpanish();

    // Verify page elements in Spanish
    await expect(onboardingPage.spanishPageTitle).toBeVisible();

    await expect(page.getByText('eNOW necesita saber un poco m')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Detalles del perfil' })).toBeVisible();
    await expect(page.getByText('Nombre*')).toBeVisible();
    await expect(page.getByText('Apellido*')).toBeVisible();
    await expect(page.getByText('Especialidad médica')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Licencias para ejercer' })).toBeVisible();
    await expect(page.getByText('País').first()).toBeVisible();
    await expect(page.getByText('Estado').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Plus Agregar licencia' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Idiomas hablados' })).toBeVisible();
    await expect(page.locator('span').filter({ hasText: 'Idiomas hablados' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Seleccionar idiomas' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Seleccionar especialidades médicas' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cambiar zona horaria' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Zona horaria' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Empezar' })).toBeVisible();

    // change back to English for subsequent tests
    await onboardingPage.ensurePageIsEnglish();
    await page.waitForTimeout(2000);

    // click 'Get Started' button
    await expect(onboardingPage.getStartedButton).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeEnabled();
    await onboardingPage.getStartedButton.click();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.skip('Spanish - Verify the presence of web elements and texts on the Acuerdo de licencia de usuario final page @[112497] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await eulaPage.navigateToEula();

    // ensure onboarding page language is Spanish
    await eulaPage.changeLanguageToSpanish();

    // Verify page elements in Spanish
    await expect(eulaPage.spanishPageTitle).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Acuerdo de licencia de' })).toBeVisible();
    await expect(page.getByText('Usted (“Suscriptor” o “')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SUSCRIPCIÓN/LICENCIA' })).toBeVisible();
    await expect(page.getByText('SIEMPRE QUE ESTÉ AUTORIZADO A')).toBeVisible();
    await expect(page.getByText('Lea el acuerdo y acéptelo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Aceptar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rechazar' })).toBeVisible();

    // change back to English for subsequent tests
    await eulaPage.changeLanguageToEnglishFromSpanish();
    await page.waitForTimeout(2000);

    // click Accept
    await eulaPage.acceptEula();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.skip('[Negative] [Spanish] Verify the validation of the "Apellido" field on the "Antes de empezar" page @[112518] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is Spanish
    await onboardingPage.ensurePageIsSpanish();

    // Verify page elements using POM
    await expect(onboardingPage.spanishPageTitle).toBeVisible();

    // Test required field validation
    await page.getByRole('textbox', { name: 'Ingrese su apellido' }).click();
    await page.getByRole('textbox', { name: 'Ingrese su apellido' }).fill('');
    await expect(page.getByText('Debe ingresar el apellido')).toBeVisible();
    await page.getByRole('textbox', { name: 'Ingrese su apellido' }).click();
    await page.getByRole('textbox', { name: 'Ingrese su apellido' }).fill('Cody&');
    await expect(page.getByText('El apellido debe contener al')).toBeVisible();
    await page.getByRole('textbox', { name: 'Ingrese su apellido' }).click();
    await page.getByRole('textbox', { name: 'Ingrese su apellido' }).fill('Cody');
    await expect(page.getByText('El apellido debe contener al')).not.toBeVisible();

    // reload page to reset state for next test
    await page.reload();

    // change back to English for subsequent tests
    await onboardingPage.ensurePageIsEnglish();
    await page.waitForTimeout(2000);

    // click 'Get Started' button
    await expect(onboardingPage.getStartedButton).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeEnabled();
    await onboardingPage.getStartedButton.click();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.skip('[Negative] [Spanish] Verify the validation of the "Nombre" field on the "Antes de empezar" page @[112519] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is Spanish
    await onboardingPage.ensurePageIsSpanish();

    // Verify page elements using POM
    await expect(onboardingPage.spanishPageTitle).toBeVisible();

    // Test required field validation
    await page.getByRole('textbox', { name: 'Ingrese su nombre' }).click();
    await page.getByRole('textbox', { name: 'Ingrese su nombre' }).fill('');
    await expect(page.getByText('Debe ingresar el nombre')).toBeVisible();
    await page.getByRole('textbox', { name: 'Ingrese su nombre' }).click();
    await page.getByRole('textbox', { name: 'Ingrese su nombre' }).fill('Cody&');
    await expect(page.getByText('El nombre debe contener al')).toBeVisible();
    await page.getByRole('textbox', { name: 'Ingrese su nombre' }).click();
    await page.getByRole('textbox', { name: 'Ingrese su nombre' }).fill('Cody');
    await expect(page.getByText('El nombre debe contener al')).not.toBeVisible();

    // reload page to reset state for next test
    await page.reload();

    // change back to English for subsequent tests
    await onboardingPage.ensurePageIsEnglish();
    await page.waitForTimeout(2000);

    // click 'Get Started' button
    await expect(onboardingPage.getStartedButton).toBeVisible();
    await expect(onboardingPage.getStartedButton).toBeEnabled();
    await onboardingPage.getStartedButton.click();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.skip('Spanish - Verify Clicking the "Aceptar" Button on the "Acuerdo de Licencia de Usuario Final" Page @[112520] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await eulaPage.navigateToEula();

    // ensure onboarding page language is Spanish
    await eulaPage.changeLanguageToSpanish();

    // click 'Aceptar' button
    await eulaPage.acceptSpanishEula();

    // navigate to EULA
    await eulaPage.navigateToEula();

    // ensure onboarding page language is English
    await eulaPage.changeLanguageToEnglishFromSpanish();
    await page.waitForTimeout(2000);

    // click Accept
    await eulaPage.acceptEula();

    // verify dashboard
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // flaky - skipping for now
  test.skip('Spanish_Verify the positive scenario of filling all the fields in and redirecting to the "Dashboard" page @[112522] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await onboardingPage.navigateToOnboarding();

    // ensure onboarding page language is Spanish
    await onboardingPage.ensurePageIsSpanish();

    // form elements are pre-filled (stored Auth state) so we do not need to fill them again

    // click 'Get Started' button
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Empezar' }).click();

    // verify dashboard is in spanish
    await page.waitForLoadState('networkidle');
    await page.getByRole('heading', { name: 'Su agenda de hoy' }).waitFor({ state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Su agenda de hoy' })).toBeVisible();

    // reset state
    // navigate to EULA
    await eulaPage.navigateToEula();

    // ensure onboarding page language is English
    await eulaPage.changeLanguageToEnglishFromSpanish();

    // click Accept
    await eulaPage.acceptEula();

    // verify dashboard is changed back to english , thus reseting the state
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Your schedule for today' })).toBeVisible();
  });

  // this ends up switching the language for the Provider , so we skip it for now
  test.skip('Spanish - Verify the "Rechazar" button functionality on the "Acuerdo de licencia de usuario final" page @[112521] @provider @functional', async ({
    page,
  }) => {
    // Login as provider and navigate to onboarding
    await eulaPage.navigateToEula();

    // ensure onboarding page language is Spanish
    await eulaPage.changeLanguageToSpanish();

    // click 'Rechazar' button
    await eulaPage.declineSpanishEula();

    // verify login page is in Spanish
    await expect(page.getByRole('heading', { name: 'Inicio de sesión' })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);

    // reset state
    await page.getByTestId('icon-ChevronDown').click();
    await page.getByTestId('custom-dropdown-item-Inglés').click();
    await page.getByTestId('icon-ChevronDown').click();
  });
});
