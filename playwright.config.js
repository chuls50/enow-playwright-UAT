import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
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

    // // Admin tests with stored auth
    // {
    //   name: 'admin-chrome',
    //   testMatch: '**/admin/**/*.spec.js',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/admin.json'
    //   },
    //   dependencies: ['auth-admin'],
    // },

    // // Provider tests with stored auth
    // {
    //   name: 'provider-chrome',
    //   testMatch: '**/provider/**/*.spec.js',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/provider.json'
    //   },
    //   dependencies: ['auth-provider'],
    // },

    // // Patient tests with stored auth
    // {
    //   name: 'patient-chrome',
    //   testMatch: '**/patient/**/*.spec.js',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/patient.json'
    //   },
    //   dependencies: ['auth-patient'],
    // },

    // // Coordinator tests with stored auth
    // {
    //   name: 'coordinator-chrome',
    //   testMatch: '**/coordinator/**/*.spec.js',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/coordinator.json'
    //   },
    //   dependencies: ['auth-coordinator'],
    // },

    // // Auth tests (no stored auth needed)
    // {
    //   name: 'auth-chrome',
    //   testMatch: '**/auth/**/*.spec.js',
    //   workers: 1,
    //   use: { ...devices['Desktop Chrome']},
    // },

    // // General tests (no stored auth needed)
    // {
    //   name: 'general-chrome',
    //   testMatch: '**/general/**/*.spec.js',
    //   use: { ...devices['Desktop Chrome']},
    // },



    ],


  // Output directories
  outputDir: 'test-results/',
});
