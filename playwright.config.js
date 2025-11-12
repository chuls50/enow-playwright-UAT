import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config({ debug: false, quiet: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure auth directory exists
const authDir = path.resolve(__dirname, 'playwright', '.auth');
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}


export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/utils/**', '**/documentation-examples/**'], // Exclude utilities and examples from test execution
  fullyParallel: false, // Changed to false since you mentioned no parallel execution
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 1,
  timeout: 60000, // Default timeout for each test
  expect: {
    timeout: 15000, // Expect timeout of 15 seconds
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }], // Set to 'never' for CI to avoid hanging
    ['junit', { outputFile: 'test-results/results.xml'} ],
    ['json', { outputFile: 'test-results/results.json' }],
    // ['allure-playwright', { outputFolder: 'allure-results' }],
    // [
    //   '@alex_neo/playwright-azure-reporter',
    //   {
    //     orgUrl: 'https://dev.azure.com/globalmeddev',
    //     token: process.env.AZURE_TOKEN,
    //     planId: 114816,
    //     projectName: 'eNow2',
    //     environment: 'QA',
    //     logging: true,
    //     testRunTitle: 'Playwright Test Run',
    //     publishTestResultsMode: 'testRun',
    //     uploadAttachments: true,
    //     attachmentsType: ['screenshot', 'video', 'trace'],
    //     testCaseIdMatcher: /@\[(\d+)\]/,
    //     testPointMapper: async (testCase, testPoints) => {
    //       // Get the project name from the test project
    //       const projectName = testCase.parent.project()?.name;
          
    //       // Define configuration mappings based on project name patterns
    //       let configFilter;
          
    //       // Check for Chrome desktop projects
    //       if (projectName.includes('-chrome') && !projectName.includes('-mobile')) {
    //         configFilter = 'Browser Web';
    //       }
    //       // Check for Chrome mobile projects 
    //       else if (projectName.includes('chrome-mobile') || projectName.endsWith('-chrome-mobile')) {
    //         configFilter = 'Browser Chrome Mobile';
    //       }
    //       // Check for Safari mobile projects
    //       else if (projectName.includes('safari-mobile') || projectName.endsWith('-safari-mobile')) {
    //         configFilter = 'Browser Safari Mobile';
    //       }
    //       // Default case for any other project
    //       else {
    //         // Return the first available test point if no specific configuration matches
    //         return testPoints.length > 0 ? [testPoints[0]] : [];
    //       }

    //       // Return the filtered test points based on the configuration name
    //       return testPoints.filter((testPoint) => 
    //         testPoint.configuration.name.includes(configFilter)
    //       );
    //     },
    //     testRunConfig: {
    //       owner: {
    //         displayName: 'Cody Huls',
    //       },
    //       comment: 'Playwright Test Run',
    //     },
    //   },
    // ]
  ],

  // Project configurations
  projects: [
    // Role-specific authentication setup projects
    {
      name: 'auth-admin',
      testMatch: '**/setup/auth-admin.js',
    },
    {
      name: 'auth-provider',
      testMatch: '**/setup/auth-provider.js',
    },
    {
      name: 'auth-patient',
      testMatch: '**/setup/auth-patient.js',
    },
    {
      name: 'auth-coordinator',
      testMatch: '**/setup/auth-coordinator.js',
    },
    {
      name: 'auth-admin-coordinator',
      testMatch: '**/setup/auth-admin-coordinator.js',
    },
    {
      name: 'auth-provider-coordinator',
      testMatch: '**/setup/auth-provider-coordinator.js',
    },
    {
      name: 'auth-provider-admin',
      testMatch: '**/setup/auth-provider-admin.js',
    },
    {
      name: 'auth-provider-admin-coordinator',
      testMatch: '**/setup/auth-provider-admin-coordinator.js',
    },
    {
      name: 'auth-device',
      testMatch: '**/setup/auth-device.js',
    },


    // Desktop Chrome project for /tests folder that depends on auth-setup projects
    {
      name: 'chrome-desktop',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: [
        'auth-admin',
        'auth-provider',
        'auth-patient',
        'auth-coordinator',
        'auth-admin-coordinator',
        'auth-provider-coordinator',
        'auth-provider-admin',
        'auth-provider-admin-coordinator',
        'auth-device'
      ],
      testMatch: '**/*.spec.js',
      testIgnore: ['**/setup/**', '**/utils/**', '**/documentation-examples/**'], // Exclude setup, utils, and examples from main test execution
    },
    ],


  // Output directories
  outputDir: 'test-results/',
});
