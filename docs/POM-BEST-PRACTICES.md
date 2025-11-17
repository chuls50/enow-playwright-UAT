### GitHub Copilot Context for Playwright POM

This guide provides a structured approach to using Playwright with the Page Object Model (POM). Use these guidelines to generate maintainable and readable test code.

---

### Locators

**Prioritize User-Facing Locators**

- `getByRole()`: Preferred for buttons, links, etc.
- `getByText()`: Use for static text.
- `getByLabel()`: Ideal for form inputs with labels.
- `getByPlaceholder()`: Use for inputs with placeholder text.
- `getByTestId()`: Best for custom test IDs (`data-testid`).

**Avoid**

- **CSS** and **XPath** selectors. Use them only as a last resort.

---

### Page Object Model (POM)

**What Goes in the Page Object**

- The **Page Object class** should represent a single page or a distinct component.
- **Selectors** for all elements should be defined as properties in the constructor.
- **Methods** should perform multi-step, user-level actions (e.g., `login(user, pass)`).

Basically, I want to keep the POM focused on essential multi-step actions while maintaining clarity in the spec files.

**Example: `LoginPage.js`**

```javascript
import { BasePage } from '../base-page.js'; // Don't import Page from @playwright/test

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Define locators as properties in the constructor
    this.usernameInput = this.page.getByLabel('Username');
    this.passwordInput = this.page.getByLabel('Password');
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

---

### Test Data Management

**Centralized TEST_DATA Constants**

All test data should be defined in a centralized `TEST_DATA` object immediately after imports and before the `test.describe` block. This ensures consistency, maintainability, and reduces duplication across tests.

**TEST_DATA Structure Guidelines:**

- **Location**: Place after imports, before `test.describe()`
- **Format**: Use UPPER_CASE for constant names
- **Organization**: Group related data logically
- **Comments**: Add section headers for clarity
- **No Inline Data**: Avoid defining test data within individual tests

**Example: Complete TEST_DATA Structure**

```javascript
import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';

// Use stored auth
test.use({ storageState: 'playwright/.auth/admin.json' });

// ========================================
// TEST DATA CONSTANTS
// ========================================
// All test data should be defined here in a centralized manner
// Use this pattern for consistent data management across tests
const TEST_DATA = {
  // User invitation test data
  USER: {
    FIRST_NAME: 'John',
    LAST_NAME: 'Doe',
    EMAIL_PREFIX: 'john.doe',
    ROLE: 'Patient',
    INSTITUTION: 'Cody Test',
  },
  // Search and filter test data
  SEARCH: {
    USER_SEARCH_TERM: 'cody test provider-',
  },
  // Form validation test data
  VALIDATION: {
    VALID_FIRST_NAME: 'John',
    VALID_LAST_NAME: 'Doe',
    VALID_EMAIL: 'example@domain.com',
    INVALID_CHARACTERS: '%^&*',
  },
  // Dropdown options and selections
  ROLES: {
    ADMIN: 'Admin',
    PATIENT: 'Patient',
    PROVIDER: 'Provider',
    COORDINATOR: 'Coordinator',
  },
  INSTITUTIONS: {
    CODY_TEST: 'Cody Test',
    GLOBAL_MED: 'GlobalMed',
  },
};

test.describe('Admin User Management @regression', () => {
  // Test implementation here...
});
```

**Benefits of Centralized TEST_DATA:**

- **Single Source of Truth**: All test data in one location
- **Easy Maintenance**: Update data in one place affects all tests
- **Consistency**: Same data values used across related tests
- **Readability**: Clear organization shows what data is available
- **Reusability**: Data can be shared across multiple test methods

**❌ Avoid Inline Test Data:**

```javascript
// Wrong - data scattered throughout tests
test('example test', async () => {
  const firstName = 'John'; // Don't define here
  const email = 'test@example.com'; // Don't define here
});
```

**✅ Use Centralized TEST_DATA:**

```javascript
// Correct - reference centralized data directly
test('example test', async () => {
  // Use TEST_DATA directly when no transformation needed
  await userTablePage.fillForm(TEST_DATA.USER.FIRST_NAME, TEST_DATA.USER.LAST_NAME);

  // Only create variables when transformation is required
  const email = `${TEST_DATA.USER.EMAIL_PREFIX}.${Date.now()}@example.com`;
  await userTablePage.submitForm(email);
});
```

**Clean vs. Cluttered Examples:**

```javascript
// ❌ Cluttered - Unnecessary const declarations
test('invite user', async () => {
  const firstName = TEST_DATA.USER.FIRST_NAME; // Unnecessary
  const lastName = TEST_DATA.USER.LAST_NAME; // Unnecessary
  const role = TEST_DATA.USER.ROLE; // Unnecessary

  await userTablePage.inviteUser(firstName, lastName, email, role);
});

// ✅ Clean - Direct references
test('invite user', async () => {
  const email = `${TEST_DATA.USER.EMAIL_PREFIX}.${Date.now()}@example.com`; // Only when needed

  await userTablePage.inviteUser(TEST_DATA.USER.FIRST_NAME, TEST_DATA.USER.LAST_NAME, email, TEST_DATA.USER.ROLE);
});
```

---

### Test Files

**What Goes in the Test File**

- **Test Data.** Define constants for test data at the top of the test file.
- **Explicit, readable test steps.** The test file should clearly show the intent of the test.
- **Assertions.** All `expect()` assertions should be in the test file, not hidden within a Page Object method.

**Example: `login.spec.js`**

```javascript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

test('should log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'password123');

  // Explicit assertions make the test's purpose clear
  await expect(page).toHaveURL('/dashboard');
  await expect(dashboardPage.welcomeMessage).toBeVisible();
});
```

**Example: `users-table.spec.js`**

```javascript
import { test, expect } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';

// ========================================
// TEST DATA CONSTANTS
// ========================================
const TEST_DATA = {
  USER: {
    FIRST_NAME: 'John',
    LAST_NAME: 'Doe',
    EMAIL_PREFIX: 'john.doe',
    ROLE: 'Patient',
  },
};

test('Validate Successful invite Submission on Invite Users Modal @[111700]', async ({ page }) => {
  const userTablePage = new UsersTablePage(page);
  await userTablePage.navigate();

  // Only create variables when transformation is needed
  const email = `${TEST_DATA.USER.EMAIL_PREFIX}.${Date.now()}@example.com`;

  // Use helper methods from POM with direct TEST_DATA references
  await userTablePage.inviteUser(TEST_DATA.USER.FIRST_NAME, TEST_DATA.USER.LAST_NAME, email, TEST_DATA.USER.ROLE);

  // Explicit assertions make the test's purpose clear
  await expect(userTablePage.invitationSentMessage).toBeVisible();
});
```

**The inviteUser Method within UsersTablePage.js**

To keep the test file clean and focused on user intent, all the individual steps for inviting a user should be encapsulated in a single method within the UsersTablePage class. This aligns with the principle of abstracting multi-step actions into a POM method.

**Example `UsersTablePage.js` (simplified)**

```javascript
import { BasePage } from '../../base-page.js';

export class UsersTablePage extends BasePage {
  constructor(page) {
    super(page);

    // Define locators as properties in the constructor
    this.inviteUsersButton = this.page.getByRole('button', {
      name: 'Invite Users',
    });
    this.firstNameInput = this.page.getByLabel('First Name');
    // ... other locators for the modal
    this.inviteUsersSendInviteButton = this.page.getByRole('button', {
      name: 'Send Invite',
    });
    this.invitationSentMessage = this.page.getByText('Invitation sent successfully!');
  }

  async navigate() {
    await this.page.goto('/admin/users-table');
  }

  async inviteUser(firstName, lastName, email, role) {
    await this.inviteUsersButton.click();
    await this.firstNameInput.fill(firstName);
    // ... fill other fields
    // ... select institution and role
    await this.inviteUsersSendInviteButton.click();
  }
}
```

---

### Advanced POM Patterns

**Inheritance and Base Classes**

- Always extend `BasePage` instead of importing `Page` from `@playwright/test`
- Use inheritance to share common functionality across page objects
- Keep the base class focused on universal page operations (navigation, waiting, etc.)

**Complex Multi-Step Methods (3+ Steps)**

When a user action requires 3 or more steps, encapsulate it in a POM method:

```javascript
// ❌ Bad - Repetitive code in test files
await page.getByRole('link', { name: 'Reporting Period ChevronDown' }).click();
await page.getByTestId('item Week').click();
await page.getByRole('button', { name: 'Apply Filter' }).click();

// ✅ Good - Encapsulated in POM method
await adminDataReportingPage.applyReportingPeriodFilter('Week');
```

**Method Naming Conventions**

- **Navigation methods**: `navigateTo...()` - e.g., `navigateToTotalCalls()`
- **Action methods**: `apply...()`, `clear...()`, `remove...()` - e.g., `applyFilter()`, `clearAllFilters()`
- **Multi-selection methods**: `applyMultiple...()` - e.g., `applyMultipleServices(['A', 'B'])`
- **URL-based navigation**: `navigateTo...Details()` - e.g., `navigateToTotalCallsDetails()`

**Grouping Related Elements**

Group related locators logically in the constructor:

```javascript
constructor(page) {
  super(page);

  // Navigation Links
  this.dataReportingLink = this.page.getByText('Data reporting');
  this.totalCallsTab = this.page.locator('a').filter({ hasText: 'Total Calls' });

  // Filter Elements
  this.clearFiltersButton = this.page.getByRole('button', { name: 'Clear filters' });
  this.applyFilterButton = this.page.getByRole('button', { name: 'Apply Filter' });

  // Filter Dropdowns
  this.reportingPeriodFilter = this.page.getByRole('link', { name: 'Reporting Period ChevronDown' });
  this.serviceFilter = this.page.getByRole('link', { name: 'Service ChevronDown' });
}
```

**Error Handling and Reliability**

- Add proper waits and state checks in POM methods
- Use `waitFor({ state: 'visible' })` for critical elements
- Include timeouts for flaky operations
- Handle conditional elements gracefully

```javascript
async clearAllFilters() {
  // Check if button exists before clicking
  if (await this.clearFiltersButton.isVisible()) {
    await this.clearFiltersButton.click();
  }
  await this.page.waitForLoadState('networkidle');
}
```

---

### Test File Best Practices

**Multiple Page Objects in Tests**

When tests span multiple pages or components, instantiate all needed page objects in `beforeEach`:

```javascript
test.describe('Admin Reporting @regression', () => {
  let usersTablePage;
  let adminDataReportingPage;

  test.beforeEach(async ({ page }) => {
    usersTablePage = new UsersTablePage(page);
    adminDataReportingPage = new AdminDataReportingPage(page);

    // Use appropriate page object for navigation
    await usersTablePage.gotoUsersTable();
    await adminDataReportingPage.navigateToDataReporting();
  });
});
```

**Avoiding Direct Page Access**

- ❌ **Don't**: `usersTablePage.page.getByText('Data reporting').click()`
- ✅ **Do**: `adminDataReportingPage.navigateToDataReporting()`

Keep page object responsibilities clear and avoid bypassing the POM layer.

**Cross-Page Test Data Sharing**

When tests span multiple pages, organize TEST_DATA by functional area rather than by page:

```javascript
const TEST_DATA = {
  // Organize by feature/workflow, not by page
  REPORTING_FILTERS: {
    PERIODS: ['Week', 'Day', 'Month'],
    APPOINTMENT_TYPES: ['Video', 'Chat', 'All'],
    SERVICES: ['Pediatrics', 'Toxicology Report'],
  },
  USER_MANAGEMENT: {
    ADMIN_USER: { name: 'Test Admin', role: 'Admin' },
    PATIENT_USER: { name: 'Test Patient', role: 'Patient' },
  },
};

test('Verify multi-select filters', async ({ page }) => {
  await adminDataReportingPage.applyMultipleServices(TEST_DATA.REPORTING_FILTERS.SERVICES);
  // assertions...
});
```

---

### Common Anti-Patterns to Avoid

**❌ Don't Import `Page` from `@playwright/test`**

```javascript
// Wrong
import { Page } from '@playwright/test';
```

**❌ Don't Define Locators Inside Methods**

```javascript
// Wrong - locators should be in constructor
async clickButton() {
  const button = this.page.getByRole('button');
  await button.click();
}
```

**❌ Don't Create Single-Step POM Methods**

```javascript
// Wrong - this should just be used directly in test
async clickClearButton() {
  await this.clearFiltersButton.click();
}
```

**❌ Don't Create Unnecessary Variable Assignments**

```javascript
// Wrong - unnecessary const declarations for static data
test('example test', async () => {
  const firstName = TEST_DATA.USER.FIRST_NAME; // Unnecessary
  const lastName = TEST_DATA.USER.LAST_NAME; // Unnecessary
  const role = TEST_DATA.USER.ROLE; // Unnecessary

  await userTablePage.inviteUser(firstName, lastName, email, role);
});
```

**❌ Don't Hide Assertions in POM Methods**

```javascript
// Wrong - assertions belong in test files
async verifyLoginSuccess() {
  await expect(this.welcomeMessage).toBeVisible(); // Don't do this
}
```

**✅ Do Keep Assertions in Test Files**

```javascript
// Correct - assertions stay in test file
await loginPage.performLogin(username, password);
await expect(loginPage.welcomeMessage).toBeVisible();
```

**✅ Do Use Direct TEST_DATA References**

```javascript
// Correct - direct references for static data, variables only when needed
test('example test', async () => {
  // Only create variables when transformation is required
  const email = `${TEST_DATA.USER.EMAIL_PREFIX}.${Date.now()}@example.com`;

  // Use TEST_DATA directly for static values
  await userTablePage.inviteUser(TEST_DATA.USER.FIRST_NAME, TEST_DATA.USER.LAST_NAME, email, TEST_DATA.USER.ROLE);
});
```
