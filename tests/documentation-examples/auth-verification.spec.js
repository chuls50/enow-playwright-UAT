/**
 * Test to verify authentication setup works correctly
 * This file should be run after the setup projects complete
 */

import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { resolve } from 'path';

test.describe('Authentication Setup Verification', () => {
  test('verify all authentication files are created', async () => {
    const authFiles = [
      'admin.json',
      'provider.json',
      'patient.json',
      'coordinator.json',
      'admin-coordinator.json',
      'provider-coordinator.json',
    ];

    const authDir = 'playwright/.auth';
    const missingFiles = [];

    for (const file of authFiles) {
      const filePath = resolve(authDir, file);
      if (!existsSync(filePath)) {
        missingFiles.push(file);
      } else {
        console.log(`✅ ${file} exists`);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(
        `Missing authentication files: ${missingFiles.join(', ')}`
      );
    }

    console.log('✅ All authentication files verified:', authFiles.join(', '));
    console.log('✅ All authentication setup files verified successfully');
  });

  test('verify auth files contain valid storage state', async ({ browser }) => {
    const authConfigs = {
      admin: { storageState: 'playwright/.auth/admin.json' },
      provider: { storageState: 'playwright/.auth/provider.json' },
      patient: { storageState: 'playwright/.auth/patient.json' },
      coordinator: { storageState: 'playwright/.auth/coordinator.json' },
      'admin-coordinator': {
        storageState: 'playwright/.auth/admin-coordinator.json',
      },
      'provider-coordinator': {
        storageState: 'playwright/.auth/provider-coordinator.json',
      },
    };

    for (const [role, config] of Object.entries(authConfigs)) {
      // Verify the file exists before trying to use it
      if (!existsSync(config.storageState)) {
        throw new Error(`Authentication file missing: ${config.storageState}`);
      }

      const context = await browser.newContext(config);
      const page = await context.newPage();

      // Basic check that the storage state is valid
      // (This doesn't test login functionality, just that the file loads)
      expect(context).toBeDefined();

      await context.close();
      console.log(`✅ ${role} storage state loads successfully`);
    }
  });
});
