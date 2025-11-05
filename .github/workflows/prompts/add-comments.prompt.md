# Add Clear Test Step Comments

## Usage
> "Please add clear comments for each test step to [filename] following the add-comments prompt"

## Test Count Header
**Always update the header** with test counts for each test.describe block:

```javascript
// Admin User Management - Total tests 13 (including 1 skipped)
// Admin User Management Part 2 - Total tests 12 (including 1 skipped)
```

Count all tests (including skipped ones) in each describe block and list them separately.

## Simple Comment Style

Add **short, descriptive comments** that explain what each logical group of actions accomplishes:

```javascript
test('Example test @[123456] @admin @functional', async () => {
    // Open the invite users modal
    await userTablePage.inviteUsersButton.click();
    
    // Fill valid names and verify button remains disabled without complete form
    await userTablePage.inviteUsersFirstNameField.fill('John');
    await userTablePage.inviteUsersLastNameField.fill('Doe');
    await expect(userTablePage.inviteUsersSendInviteButton).toBeDisabled();
    
    // Submit form and verify validation errors
    await userTablePage.inviteUsersSendInviteButton.click();
    await expect(userTablePage.firstNameValidationError).toBeVisible();
});
```

## Key Patterns from Your Codebase

**Simple action descriptions:**
```javascript
// Open Create Device ID modal
// Generate unique test data for device creation
// Fill out complete form using helper methods
// Submit form and verify successful device creation
```

**State changes:**
```javascript
// Toggle user to inactive state
// Toggle user back to active state
// Navigate to page where Add Roles button is visible
```

**Test phases:**
```javascript
// Fill form with invalid email format
// Select institution to complete form
// Submit form and verify email format error
```

## Guidelines

**DO:**
- ✅ Write concise, action-focused comments (1 line)
- ✅ Group 2-4 related lines under one comment
- ✅ Use simple verbs: "Open", "Fill", "Select", "Verify", "Generate"
- ✅ Explain the test intent, not the code syntax

**DON'T:**
- ❌ Comment every single line
- ❌ Write long explanatory paragraphs  
- ❌ Repeat what the code obviously does
- ❌ Use complex technical language

## Examples from Your Code
```javascript
// Search for specific user to test toggle behavior
// Click the Last Updated column header to sort
// Extract date values from the Last Updated column (6th column)
// Verify ascending order (oldest to newest)
// Click next button to navigate to page 2
// Open the invite users modal
// Verify all form fields and labels are visible
// Generate test data for unique user invitation
// Fill out complete form using helper methods
// Submit invitation and verify success
```

Keep it simple and focused on **what** each section accomplishes!

## Process
1. **Count tests** in each describe block (including skipped)
2. **Update header** with test suite names and counts  
3. **Add step comments** to each test following the style above