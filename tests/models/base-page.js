// models/base-page.js

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    const defaultOptions = {
      waitUntil: 'networkidle',
      timeout: 30000,
    };

    await this.page.goto(url, defaultOptions);
    await this.page.waitForLoadState('networkidle', { timeout: 45000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForSpinnerToDisappear(spinnerSelector = '[data-testid="spinner"]', timeout = 120000) {
    try {
      await this.page.waitForSelector(spinnerSelector, { state: 'detached', timeout });
    } catch (e) {
      console.log('Spinner did not disappear within timeout or was not found.');
    }
  }

  async _performLogin(usernameEnv, passwordEnv, userType) {
    try {
      // Navigate to base URL and wait for login page
      await this.page.goto(process.env.PROD_URL);
      await this.page.waitForURL(/.*\/login/);

      // Fill email
      await this.page.getByPlaceholder('Enter email').fill(process.env[usernameEnv]);
      await this.page.getByRole('button', { name: 'Next' }).click();
      await this.page.waitForTimeout(500);

      // Fill password
      await this.page.getByPlaceholder('Enter your password').fill(process.env[passwordEnv]);
      await this.page.getByRole('button', { name: 'Log In' }).click();
      await this.page.waitForURL(/.*\/route-me/);

      // Wait for spinner to disappear
      await this.waitForSpinnerToDisappear();

      console.log(`✅ Successfully logged in as ${userType}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to login as ${userType}:`, error.message);
      throw error;
    }
  }

  // async performAdminLogin() {
  //   return this._performLogin('ADMIN_2_PROD_USERNAME', 'ADMIN_2_PROD_PASSWORD', 'admin2-GM_Healthcare(PROD)');
  // }

  // async performProviderLogin() {
  //   return this._performLogin('PROV_2_PROD_USERNAME', 'PROV_2_PROD_PASSWORD', 'provider2-GM_Healthcare(PROD)');
  // }

  async performPatientLogin() {
    return this._performLogin('PAT_2_PROD_USERNAME', 'PAT_2_PROD_PASSWORD', 'patient2-GM_Healthcare(PROD)');
  }

  // async performCoordinatorLogin() {
  //   return this._performLogin('CORD_2_PROD_USERNAME', 'CORD_2_PROD_PASSWORD', 'coordinator2-GM_Healthcare(PROD)');
  // }

  // async performProviderCoordinatorLogin() {
  //   return this._performLogin('PROV_CORD_PROD_USERNAME', 'PROV_CORD_PROD_PASSWORD', 'provider+coordinator-GM_Healthcare(PROD)');
  // }

  // async performAdminCoordinatorLogin() {
  //   return this._performLogin('ADMIN_CORD_PROD_USERNAME', 'ADMIN_CORD_PROD_PASSWORD', 'admin+coordinator-GM_Healthcare(PROD)');
  // }

  // async performAdminProviderLogin() {
  //   return this._performLogin('ADMIN_PROV_PROD_USERNAME', 'ADMIN_PROV_PROD_PASSWORD', 'admin+provider-GM_Healthcare(PROD)');
  // }

  // async performAdminCoordinatorProviderLogin() {
  //   return this._performLogin('ADMIN_CORD_PROV_PROD_USERNAME', 'ADMIN_CORD_PROV_PROD_PASSWORD', 'admin+coordinator+provider-GM_Healthcare(PROD)');
  // }

  async performDeviceIdLogin(deviceId) {
    try {
      // Navigate to device ID access page
      await this.page.goto('https://api.encounterservices.com/redirect/kPEWFgwUQPqVxLkXxNryXyGEDyeAYEZR');
      await this.page.waitForLoadState('networkidle');

      // Enter device ID
      await this.page.getByRole('textbox', { name: '1234' }).click();
      await this.page.getByRole('textbox', { name: '1234' }).fill(deviceId);
      await this.page.getByRole('button', { name: 'Verify Device ID' }).click();

      // Wait for successful verification
      await this.page.getByText('Welcome back!').waitFor({ state: 'visible' });
      await this.page.waitForTimeout(2000);
      await this.page.waitForLoadState('networkidle');

      console.log(`✅ Successfully logged in with device ID: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to login with device ID ${deviceId}:`, error.message);
      throw error;
    }
  }

  async uploadFile(uploadButton, filePath) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  async _performUATLogin(usernameEnv, passwordEnv, userType) {
    try {
      // Navigate to base URL and wait for login page
      await this.page.goto(process.env.UAT_URL);
      await this.page.waitForURL(/.*\/login/);

      // Fill email
      await this.page.getByPlaceholder('Enter email').fill(process.env[usernameEnv]);
      await this.page.getByRole('button', { name: 'Next' }).click();
      await this.page.waitForTimeout(500);

      // Fill password
      await this.page.getByPlaceholder('Enter your password').fill(process.env[passwordEnv]);
      await this.page.getByRole('button', { name: 'Log In' }).click();
      await this.page.waitForURL(/.*\/route-me/);

      // Wait for spinner to disappear
      await this.waitForSpinnerToDisappear();

      console.log(`✅ Successfully logged in as ${userType}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to login as ${userType}:`, error.message);
      throw error;
    }
  }

  async performUATAdminLogin() {
    return this._performUATLogin('UAT_ADMIN_USERNAME', 'UAT_ADMIN_PASSWORD', 'admin-CodyTest(UAT)');
  }

  async performUATProviderLogin() {
    return this._performUATLogin('UAT_PROVIDER_USERNAME', 'UAT_PROVIDER_PASSWORD', 'provider-CodyTest(UAT)');
  }

  async performUATPatientLogin() {
    return this._performUATLogin('UAT_PATIENT_USERNAME', 'UAT_PATIENT_PASSWORD', 'patient-CodyTest(UAT)');
  }

  async performUATCoordinatorLogin() {
    return this._performUATLogin('UAT_COORDINATOR_USERNAME', 'UAT_COORDINATOR_PASSWORD', 'coordinator-CodyTest(UAT)');
  }

  async performUATsuperAdminLogin() {
    return this._performUATLogin('SUPER_ADMIN_USERNAME', 'SUPER_ADMIN_PASSWORD', 'superadmin-CodyTest(UAT)');
  }
}
