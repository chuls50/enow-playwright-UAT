import dotenv from 'dotenv';
import { BasePage } from '../../base-page.js';
dotenv.config();

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        // Email Step Elements
        this.emailLabel = page.locator('label').filter({ hasText: 'Email*' });
        this.emailField = page.getByRole('textbox', { name: 'Enter email' });
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.welcomeMessage = page.locator('#root').getByText('Welcome back!');
        this.errorMessage = page.getByText('Enter an email');
        this.errorMessageInvalidEmail = page.getByText('Email fields can only include');
        this.errorMessageValidUnregisteredEmail = page.getByText("Couldn't find an account for the email address provided");

        // Password Step Elements
        this.passwordLabel = page.getByText('Enter your password*');
        this.passwordField = page.getByRole('textbox', { name: 'Enter your password' });
        this.passwordInput = page.locator('input[name="password"], input[type="password"]');
        this.eyeButton = page.getByRole('button', { name: 'Eye' });
        this.loginButton = page.getByRole('button', { name: 'Log In' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
        this.backToPasswordLink = page.getByText('Back to password page');
        this.errorMessageEmptyPassword = page.getByText('Enter a password');
        this.errorMessageWrongPassword = page.getByText('Wrong password. Try again or');

        // Forgot Password Elements
        this.forgotPasswordHeading = page.getByRole('heading', { name: 'Forgot Password?' });
        this.passwordResetHeading = page.getByRole('heading', { name: 'Your reset password link was' });
        this.emailDisplay = page.locator('div').filter({ hasText: /^chuls\+smokeprod@globalmed\.com$/ });
        this.sendEmailButton = page.getByRole('button', { name: 'Send email' });
        this.confirmationHeading = page.getByRole('heading', { name: 'Your reset password link was sent' });
        this.resendLink = page.getByRole('link', { name: 'Resend link' });

        // Shared Elements
        this.loginHeading = page.getByRole('heading', { name: 'Login' });
        this.footer = page.getByText('© 2002-2025 GlobalMed®. All');

        // Language Elements
        this.languageDropdownTrigger = page.getByTestId('icon-ChevronDown');
        this.languageDropdown = page.getByTestId('custom-dropdown');
        this.currentLanguageText = page.getByText('English');
        this.portugueseLanguageText = page.getByText('Português');
        this.spanishLanguageText = page.getByText('Español');
        
        // Language Options (both testid and text versions)
        this.spanishLanguageOption = page.getByTestId('custom-dropdown-item-Spanish');
        this.spanishLanguageTextOption = page.getByText('Spanish');
        this.portugueseLanguageOption = page.getByTestId('custom-dropdown-item-Portuguese');
        this.englishLanguageOption = page.getByTestId('custom-dropdown-item-English');
        this.englishLanguageOptionSpanish = page.getByTestId('custom-dropdown-item-Inglés');
        this.englishLanguageOptionPortuguese = page.getByTestId('custom-dropdown-item-Inglês');

        // Language-specific headings
        this.loginHeadingSpanish = page.getByRole('heading', { name: 'Inicio de sesión' });
        this.loginHeadingPortuguese = page.getByRole('heading', { name: 'Faça o login' });
        
        // Welcome Image
        this.welcomeImage = page.locator('img[alt="welcome"]');

    }

    // Navigation Methods
    async goto(baseURL = process.env.PROD_URL) {
        await this.page.goto(baseURL, { waitUntil: 'commit' });
        await this.page.waitForURL(/.*\/login/);
    }

    async goToPasswordStep(email = process.env.PAT_PROD_USERNAME) {
        await this.goto();
        await this.emailField.fill(email);
        await this.nextButton.click();
        await this.passwordLabel.waitFor();
    }

    async goToForgotPasswordPage(email = process.env.SMOKE_PROD_USERNAME) {
        await this.goto();
        await this.emailField.fill(email);
        await this.nextButton.click();
        await this.forgotPasswordLink.click();
        await this.page.waitForURL(/.*\/forgot-password/);
        await this.forgotPasswordHeading.waitFor();
    }

    // Multi-step Actions - these warrant POM methods as they combine multiple steps
    async login(email, password) {
        await this.emailField.fill(email);
        await this.nextButton.click();
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL(/.*\/route-me/);
    }

    // Language Selection Method
    async selectLanguage(language) {
        const languageMap = {
            'Spanish': {
                option: this.spanishLanguageOption,
                headingText: 'Inicio de sesión'
            },
            'SpanishText': {
                option: this.spanishLanguageTextOption,
                headingText: 'Inicio de sesión'
            },
            'Portuguese': {
                option: this.portugueseLanguageOption,
                headingText: 'Faça o login'
            },
            'English': {
                option: this.englishLanguageOption,
                headingText: 'Login'
            },
            'EnglishFromSpanish': {
                option: this.englishLanguageOptionSpanish,
                headingText: 'Login'
            },
            'EnglishFromPortuguese': {
                option: this.englishLanguageOptionPortuguese,
                headingText: 'Login'
            }
        };

        if (!languageMap[language]) {
            throw new Error(`Unsupported language: ${language}. Supported languages: ${Object.keys(languageMap).join(', ')}`);
        }

        // Open the language dropdown
        await this.languageDropdownTrigger.click();
        await this.languageDropdown.waitFor({ state: 'visible' });

        // Select the language
        await languageMap[language].option.click();

        // Wait for the page to update with new language
        await this.page.getByRole('heading', { name: languageMap[language].headingText }).waitFor({ state: 'visible' });
        
        // Close dropdown by clicking the trigger again if still open
        try {
            if (await this.languageDropdown.isVisible()) {
                await this.languageDropdownTrigger.click();
            }
        } catch (error) {
            // Dropdown might have auto-closed, continue
        }
    }

}