import { test } from '@playwright/test';
import { UsersTablePage } from '../../models/pages/admin/admin-users-table.page.js';
// Total tests 7 (all skipped)

test.describe('Admin User Managment Part 3 @regression', () => {
  let userTablePage;

  test.beforeEach(async ({ page }) => {
    userTablePage = new UsersTablePage(page);
    await userTablePage.gotoUsersTable();
  });

  test.skip('Verify "+ Add Institutions" link is visible for each user in the list @[117326]', async () => {});

  test.skip('Verify adding user to another institution via "+ Add institutions" link @[117327]', async () => {});

  test.skip('[Negative] Verify user cannot be added to the same institution twice @[117328]', async () => {});

  test.skip('Verify changes persist after user is added to multiple institutions @[117329]', async () => {});

  test.skip('[Negative] Verify assigned Institutions cannot be deleted from user row @[117330]', async () => {});

  test.skip('Verify dropdown closes after successful institution addition @[117686]', async () => {});

  test.skip('Verify newly added institution appears in user rown after page reload @[117687]', async () => {});
});
