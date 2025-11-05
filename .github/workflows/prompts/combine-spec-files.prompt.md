# Combine Multiple .spec Files

## Usage
> "Please combine [filename-pt2.spec.js] and [filename-pt3.spec.js] into [filename.spec.js] following the combine-spec-files prompt"

## Simple Process

1. **Update main file header** - Add total test counts from all parts
2. **Copy test describe blocks** - Add pt2 and pt3 describe blocks to main file
3. **Add separators** - Use `// /////////////` between describe blocks
4. **Update test data** - Merge any TEST_DATA constants
5. **Remove part files** - Delete the pt2 and pt3 files after combining
6. **Run tests** - Verify combined file passes all tests

## Example Structure

```javascript
import { test, expect } from '@playwright/test';
import { SomePage } from '../../models/pages/admin/some-page.js';
// Admin Configuration Settings - Total tests 10 (including 3 skipped)
// Admin Configuration Settings pt2 - Total tests 6 (including 3 skipped)
// Admin Configuration Settings pt3 - Total tests 8 (including 6 skipped)

// Constants for test data (merge from all parts)
const TEST_DATA = {
    // ... combined data
};

test.describe('Admin Configuration Settings @regression', () => {
    // ... original tests
});

// //////////////////////////////////////////////////////////////////////////////
// Total Tests 6 (including 3 skipped)
test.describe('Admin Configuration Settings pt2 @regression', () => {
    // ... pt2 tests
});

// //////////////////////////////////////////////////////////////////////////////  
// Total Tests 8 (including 6 skipped)
test.describe('Admin Configuration Settings pt3 @regression', () => {
    // ... pt3 tests
});
```

## Steps

1. **Open main file** (e.g., `admin-configuration-settings.spec.js`)
2. **Update header comment** with combined test totals
3. **Copy entire test.describe blocks** from pt2 and pt3 files
4. **Add separator comments** between each describe block
5. **Merge any TEST_DATA constants** at the top
6. **Delete the pt2 and pt3 files**
7. **Run test suite** to verify everything works

## Key Points

- **Use same test suite name** for all describe blocks with "pt2"/"pt3" suffixes
- **Header shows each part** on separate lines with name and test count
- **Keep original order** - main file → pt2 → pt3 describe blocks
- Keep all imports, beforeEach hooks, and test data intact
- Maintain original test names and descriptions  
- Use the `// ////` separator pattern like in admin-user-managment.spec.js
- Test the combined file to ensure all tests pass

That's it! Simple copy/paste consolidation.