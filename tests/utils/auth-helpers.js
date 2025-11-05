/**
 * Authentication helper utilities for Playwright tests
 * Provides clean syntax for using authentication states in tests
 */

import fs from 'fs';
import path from 'path';

// Available roles - matches your setup folder
export const ROLES = {
  ADMIN: 'admin',
  PROVIDER: 'provider',
  PATIENT: 'patient',
  COORDINATOR: 'coordinator',
  ADMIN_COORDINATOR: 'admin-coordinator',
  PROVIDER_COORDINATOR: 'provider-coordinator',
};

/**
 * Get the storage state path for a specific role
 * @param {string} role - The role name (admin, provider, patient, coordinator, admin-coordinator, provider-coordinator)
 * @returns {string} The path to the storage state file
 */
export function getStorageStatePath(role) {
  if (!Object.values(ROLES).includes(role)) {
    throw new Error(
      `Invalid role: ${role}. Available roles: ${Object.values(ROLES).join(', ')}`
    );
  }

  const authPath = `playwright/.auth/${role}.json`;

  // Check if the auth file exists
  if (!fs.existsSync(authPath)) {
    throw new Error(
      `Authentication file not found: ${authPath}. Make sure the setup has run first.`
    );
  }

  return authPath;
}

/**
 * Helper function to use a specific role's authentication state
 * Usage: test.use(useRole(ROLES.ADMIN))
 * @param {string} role - The role name
 * @param {boolean} skipValidation - Skip file existence check (for development)
 * @returns {object} Configuration object for test.use()
 */
export function useRole(role, skipValidation = false) {
  if (skipValidation) {
    // For development - return path without validation
    return {
      storageState: `playwright/.auth/${role}.json`,
    };
  }
  return {
    storageState: getStorageStatePath(role),
  };
}

/**
 * Create a new browser context with a specific role's authentication state
 * Usage: const adminContext = await createAuthenticatedContext(browser, ROLES.ADMIN)
 * @param {Browser} browser - Playwright browser instance
 * @param {string} role - The role name
 * @returns {Promise<BrowserContext>} Browser context with authentication state
 */
export async function createAuthenticatedContext(browser, role) {
  const storageState = getStorageStatePath(role);
  return await browser.newContext({ storageState });
}

/**
 * Create multiple authenticated contexts for multi-role testing
 * Usage: const contexts = await createMultiRoleContexts(browser, [ROLES.ADMIN, ROLES.PATIENT])
 * Access: contexts.admin, contexts.patient, etc.
 * @param {Browser} browser - Playwright browser instance
 * @param {string[]} roles - Array of role names
 * @returns {Promise<Object>} Object with contexts keyed by role name
 */
export async function createMultiRoleContexts(browser, roles) {
  const contexts = {};

  for (const role of roles) {
    contexts[role] = await createAuthenticatedContext(browser, role);
  }

  return contexts;
}

/**
 * Utility to verify all required authentication files exist
 * Call this in a beforeAll hook if you want to verify auth setup
 * @param {string[]} requiredRoles - Array of roles to verify
 */
export function verifyAuthFiles(requiredRoles = Object.values(ROLES)) {
  for (const role of requiredRoles) {
    getStorageStatePath(role); // This will throw if file doesn't exist
  }
  console.log(
    `✅ All authentication files verified: ${requiredRoles.join(', ')}`
  );
}

/**
 * Helper function to close multiple contexts
 * Usage: await closeContexts(contexts)
 * @param {Object} contexts - Object containing browser contexts
 */
export async function closeContexts(contexts) {
  for (const [role, context] of Object.entries(contexts)) {
    if (context && typeof context.close === 'function') {
      await context.close();
      console.log(`🔒 Closed ${role} context`);
    }
  }
}
