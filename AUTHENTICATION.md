# Authentication Setup Guide

This project uses Playwright's authentication system to store login states and reuse them across tests, avoiding repeated login steps.

## How It Works

1. **Setup Phase**: Authentication setup projects run first and store login states in `playwright/.auth/`
2. **Test Phase**: Individual tests can use these stored authentication states as needed

## Setup Files

Located in `tests/setup/`:
- `auth-admin.js` - Logs in as admin and saves state
- `auth-provider.js` - Logs in as provider and saves state  
- `auth-patient.js` - Logs in as patient and saves state
- `auth-coordinator.js` - Logs in as coordinator and saves state

## Helper Utilities

Located in `tests/utils/auth-helpers.js`:
- `useRole(ROLES.ADMIN)` - Clean syntax for test.use()
- `createAuthenticatedContext(browser, role)` - Create context with specific role
- `createMultiRoleContexts(browser, roles)` - Create multiple contexts for multi-role tests
- `verifyAuthFiles()` - Verify all auth files exist

## Usage Patterns

### 1. Single Role for Entire Test File

```javascript
import { test, expect } from '@playwright/test';
import { useRole, ROLES } from '../utils/auth-helpers.js';

// All tests in this file will use admin authentication
test.use(useRole(ROLES.ADMIN));

test('admin can access dashboard', async ({ page }) => {
  await page.goto(process.env.UAT_URL);
  // Already logged in as admin
});
```

### 2. Different Roles in Different Test Groups

```javascript
test.describe('Admin Tests', () => {
  test.use(useRole(ROLES.ADMIN));
  
  test('admin functionality', async ({ page }) => {
    // Uses admin auth
  });
});

test.describe('Patient Tests', () => {
  test.use(useRole(ROLES.PATIENT));
  
  test('patient functionality', async ({ page }) => {
    // Uses patient auth
  });
});
```

### 3. Multiple Roles in Single Test

```javascript
import { createMultiRoleContexts, ROLES } from '../utils/auth-helpers.js';

test('patient and provider interaction', async ({ browser }) => {
  const contexts = await createMultiRoleContexts(browser, [ROLES.PATIENT, ROLES.PROVIDER]);
  
  const patientPage = await contexts[ROLES.PATIENT].newPage();
  const providerPage = await contexts[ROLES.PROVIDER].newPage();
  
  try {
    // Patient actions
    await patientPage.goto(process.env.UAT_URL);
    // ... patient logic
    
    // Provider actions
    await providerPage.goto(process.env.UAT_URL);
    // ... provider logic
    
  } finally {
    await contexts[ROLES.PATIENT].close();
    await contexts[ROLES.PROVIDER].close();
  }
});
```

### 4. Manual Context Creation

```javascript
import { createAuthenticatedContext, ROLES } from '../utils/auth-helpers.js';

test('specific role test', async ({ browser }) => {
  const adminContext = await createAuthenticatedContext(browser, ROLES.ADMIN);
  const page = await adminContext.newPage();
  
  try {
    await page.goto(process.env.UAT_URL);
    // Test logic here
  } finally {
    await adminContext.close();
  }
});
```

## Available Roles

- `ROLES.ADMIN` - Administrator access
- `ROLES.PROVIDER` - Healthcare provider access
- `ROLES.PATIENT` - Patient access  
- `ROLES.COORDINATOR` - Coordinator access

## Running Tests

```bash
# Run all tests (setup will run first automatically)
npm run test

# Run only setup (to refresh auth states)
npx playwright test --project=auth-admin,auth-provider,auth-patient,auth-coordinator

# Run specific test file
npx playwright test tests/your-test.spec.js
```

## File Structure

```
tests/
├── setup/                     # Authentication setup files
│   ├── auth-admin.js
│   ├── auth-provider.js
│   ├── auth-patient.js
│   └── auth-coordinator.js
├── utils/                     # Helper utilities
│   └── auth-helpers.js
├── examples/                  # Example usage patterns
│   ├── single-role-example.spec.js
│   ├── multi-role-example.spec.js
│   └── mixed-auth-example.spec.js
└── [your-test-files].spec.js  # Your actual tests

playwright/.auth/              # Generated auth files
├── admin.json
├── provider.json
├── patient.json
└── coordinator.json
```

## Configuration

The setup runs automatically before your tests due to the `dependencies` configuration in `playwright.config.js`. The auth files are stored in `playwright/.auth/` and are excluded from version control.

## Troubleshooting

If you get "Authentication file not found" errors:
1. Make sure your `.env` file has the correct credentials
2. Run the setup projects manually: `npx playwright test --project=auth-admin,auth-provider,auth-patient,auth-coordinator`
3. Check that the auth files were created in `playwright/.auth/`