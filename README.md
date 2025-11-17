# eNow2 Playwright UAT Test Suite

End-to-end test automation suite for the eNow2 platform using Playwright. This repository contains comprehensive regression tests for the UAT environment.

## 📁 Project Structure

```
eNow2-playwright-UAT/
├── docs/                               # Project documentation
│   ├── AUTHENTICATION.md               # Authentication setup and usage guide
│   └── POM-BEST-PRACTICES.md          # Page Object Model best practices
│
├── playwright/                         # Playwright generated files
│   └── .auth/                         # Stored authentication states (gitignored)
│
├── playwright-report/                  # Test execution reports
│   └── index.html                     # HTML test report
│
├── test-results/                       # Test execution results
│   ├── results.json                   # JSON results
│   └── results.xml                    # JUnit XML results
│
├── downloads/                          # Test download artifacts
│
├── tests/                              # Test files and utilities
│   ├── regression/                    # Main regression test suite
│   │   ├── Account-Settings/          # Account settings tests
│   │   │   ├── Calendar-tab/
│   │   │   ├── My-Account-tab/
│   │   │   │   ├── Patient/
│   │   │   │   └── Provider/
│   │   │   └── Notifications-tab/
│   │   │
│   │   ├── Admin/                     # Admin functionality tests
│   │   │   ├── Admin-Coordinator/
│   │   │   ├── Institution-Settings-tab/
│   │   │   │   ├── Configuration/
│   │   │   │   ├── Insurance-&-Payments/
│   │   │   │   ├── Profile/
│   │   │   │   ├── Services/
│   │   │   │   └── White-Label/
│   │   │   ├── Reporting/
│   │   │   ├── Super-Admin/
│   │   │   └── Users-tab/
│   │   │
│   │   ├── Appointments/              # Appointment workflow tests
│   │   │   ├── Appointment-Creation/
│   │   │   │   ├── On-Demand-Appointment/
│   │   │   │   └── Scheduled-Appointment/
│   │   │   ├── Chat/
│   │   │   ├── Video-Call/
│   │   │   ├── Video-Call-&-Chat/
│   │   │   └── Waiting-Room/
│   │   │
│   │   ├── Coordinator/               # Coordinator functionality tests
│   │   │
│   │   ├── Login/                     # Authentication flow tests
│   │   │   ├── Create-Account/
│   │   │   │   └── Onboarding/
│   │   │   │       ├── Patient/
│   │   │   │       └── Provider/
│   │   │   ├── Forgot-Password-and-Create-New-Password-pages/
│   │   │   └── Login-and-Password-pages/
│   │   │
│   │   ├── Main-Screen/               # Dashboard and main UI tests
│   │   │   ├── Dashboard/
│   │   │   ├── Patient-List/
│   │   │   └── Session-Details/
│   │   │       ├── Session-Attachments/
│   │   │       ├── Session-Overview/
│   │   │       ├── Session-Payments/
│   │   │       ├── Session-Summary/
│   │   │       └── Session-Symptoms/
│   │   │
│   │   ├── Shared-Support-Functions/  # Cross-feature functionality tests
│   │   │   └── Support-Functions/
│   │   │
│   │   └── Workflow-Feedback/         # Feedback mechanism tests
│   │       └── Feedback/
│   │
│   ├── models/                        # Page Object Models
│   │   ├── base-page.js              # Base page class
│   │   └── pages/                    # Page-specific models
│   │       ├── admin/                # Admin page objects
│   │       ├── coordinator/          # Coordinator page objects
│   │       ├── patient/              # Patient page objects
│   │       ├── provider/             # Provider page objects
│   │       └── shared/               # Shared page objects
│   │
│   ├── setup/                         # Authentication setup scripts
│   │   ├── auth-admin.js
│   │   ├── auth-admin-coordinator.js
│   │   ├── auth-coordinator.js
│   │   ├── auth-device.js
│   │   ├── auth-patient.js
│   │   ├── auth-provider.js
│   │   ├── auth-provider-admin.js
│   │   ├── auth-provider-admin-coordinator.js
│   │   └── auth-provider-coordinator.js
│   │
│   ├── utils/                         # Utility functions
│   │   └── auth-helpers.js           # Authentication helper functions
│   │
│   ├── images/                        # Test image assets
│   │
│   ├── documentation-examples/        # Code examples for team reference
│   │
│   └── examples/                      # Additional test examples
│
├── .env                               # Environment variables (gitignored)
├── .gitignore                         # Git ignore rules
├── eslint.config.js                   # ESLint configuration
├── package.json                       # Node.js dependencies
├── playwright.config.js               # Playwright configuration
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chuls50/enow-playwright-UAT.git
   cd enow-playwright-UAT
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your UAT environment credentials

### Configuration

Create a `.env` file in the root directory with:

```env
UAT_URL=https://your-uat-url.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
PROVIDER_EMAIL=provider@example.com
PROVIDER_PASSWORD=your-password
PATIENT_EMAIL=patient@example.com
PATIENT_PASSWORD=your-password
COORDINATOR_EMAIL=coordinator@example.com
COORDINATOR_PASSWORD=your-password
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Run all regression tests
npx playwright test tests/regression/

# Run specific feature tests
npx playwright test tests/regression/Admin/
npx playwright test tests/regression/Appointments/
```

### Run Single Test File

```bash
npx playwright test tests/regression/Login/Login-and-Password-pages/login.spec.js
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests on Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Tests

```bash
npx playwright test --debug
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:

- Test execution status
- Screenshots on failure
- Video recordings (if enabled)
- Trace files for debugging

## 🔐 Authentication

This project uses Playwright's authentication system to avoid repeated logins. Authentication states are stored and reused across tests.

**Key Features:**

- Stored authentication states in `playwright/.auth/`
- Multiple user roles (Admin, Provider, Patient, Coordinator)
- Helper utilities for role-based testing
- Support for multi-role scenarios

📖 **See [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) for detailed usage**

## 🏗️ Page Object Model (POM)

Tests follow the Page Object Model pattern for maintainability and reusability.

**Structure:**

- **Page Objects** (`tests/models/pages/`): Contain locators and multi-step actions
- **Test Files** (`tests/regression/`): Contain test logic and assertions
- **Base Page** (`tests/models/base-page.js`): Shared functionality across all pages

📖 **See [docs/POM-BEST-PRACTICES.md](docs/POM-BEST-PRACTICES.md) for guidelines**

## 🏷️ Test Organization

Tests are organized by:

1. **Feature Area**: Major functional areas (Admin, Appointments, etc.)
2. **Sub-Features**: Specific functionality within features
3. **User Roles**: Role-specific tests (Patient, Provider, Admin, Coordinator)

### Test File Naming Convention

- Format: `feature-description.spec.js`
- Example: `admin-user-management.spec.js`

### Test ID Convention

Tests include Jira/TestRail IDs in the test name:

```javascript
test('Test description @[123456]', async ({ page }) => {
  // Test implementation
});
```

## 🔧 Development

### Adding New Tests

1. Create test file in appropriate `tests/regression/` subdirectory
2. Import necessary page objects from `tests/models/pages/`
3. Use authentication helpers from `tests/utils/auth-helpers.js`
4. Follow the POM best practices
5. Add test data constants at the top of the file

### Creating New Page Objects

1. Create page class in `tests/models/pages/[role]/`
2. Extend `BasePage`
3. Define locators in constructor
4. Create methods for multi-step actions (3+ steps)
5. Keep single actions in test files

### Running Linting

```bash
npm run lint
```

## 📋 Test Coverage

Current test coverage includes:

- **Account Settings**: Profile management, calendar, notifications
- **Admin Functions**: User management, institution settings, reporting
- **Appointments**: Scheduling, video calls, chat, waiting rooms
- **Authentication**: Login, password recovery, account creation
- **Dashboard**: Patient and provider dashboards
- **Session Management**: Details, attachments, payments, summaries

## 🤝 Contributing

1. Create a feature branch
2. Follow existing code structure and naming conventions
3. Follow POM best practices (see docs)
4. Add tests for new features
5. Ensure all tests pass
6. Submit pull request

## 📝 License

[Your License Here]

## 📞 Contact

[Your Contact Information]

---

**Repository**: [chuls50/enow-playwright-UAT](https://github.com/chuls50/enow-playwright-UAT)
