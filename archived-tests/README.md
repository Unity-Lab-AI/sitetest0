# Archived Tests

This directory contains archived test files, test utilities, and test-related documentation that are no longer actively used in the main test suite but preserved for reference.

## Directory Structure

```
archived-tests/
├── README.md                                  # This file
├── standalone-tool-calling-test.js            # Standalone Node.js tool calling test
├── TOOL_CALLING_TESTS_README.md               # Tool calling test documentation
├── unity_testing.js                           # Unity model testing script
├── unity_testing.html                         # Unity testing HTML interface
├── model_parameter_test.js                    # Model parameter compatibility tests
├── model_parameter_test.html                  # Model parameter testing interface
├── test_unity_tools.html                      # Unity tools testing interface
├── ANALYSIS_DEMO_PARAMETERS.md                # Demo parameter analysis
├── MODEL_PARAMETER_COMPATIBILITY.md           # Model parameter compatibility notes
├── FIXES_UNITY_IMAGE_GENERATION.md            # Unity image generation fixes
├── PLAYWRIGHT_CI_NOTES.md                     # Playwright CI testing notes
└── playwright-tests/
    └── tool-calling-rate-limited.spec.js      # Archived Playwright tool calling test
```

## Archive Contents

### Test Scripts

- **standalone-tool-calling-test.js** - Standalone Node.js script for testing tool calling across 5 models (100 tests total)
- **unity_testing.js** - Testing script specifically for Unity model functionality
- **model_parameter_test.js** - Tests for model parameter compatibility across different models

### Test HTML Interfaces

- **unity_testing.html** - Browser-based interface for testing Unity model
- **model_parameter_test.html** - Browser-based interface for parameter compatibility testing
- **test_unity_tools.html** - Browser-based interface for Unity tools testing

### Playwright Tests

- **tool-calling-rate-limited.spec.js** - Playwright test suite for rate-limited tool calling (archived from tests/)

### Documentation

- **TOOL_CALLING_TESTS_README.md** - Comprehensive documentation for tool calling test suite
- **ANALYSIS_DEMO_PARAMETERS.md** - Analysis of demo page parameters
- **MODEL_PARAMETER_COMPATIBILITY.md** - Documentation on model parameter compatibility
- **FIXES_UNITY_IMAGE_GENERATION.md** - Documentation of Unity image generation fixes
- **PLAYWRIGHT_CI_NOTES.md** - Notes on Playwright CI testing configurations

## Why Archived?

These files were archived during a repo cleanup to:

1. **Reduce Root Clutter**: Move test files out of root directory
2. **Organize Test Assets**: Consolidate test-related files in one location
3. **Preserve History**: Keep historical test implementations for reference
4. **Active Tests**: Focus on maintaining only active tests in `tests/` folder

## Active Tests

Current active tests are maintained in:
- `/tests/smoke.spec.js` - Main smoke tests for website functionality
- `/tests/backup/` - Backup test files

## Usage

These archived tests can still be run if needed:

### Standalone Tool Calling Test
```bash
node archived-tests/standalone-tool-calling-test.js
```

### Playwright Tool Calling Test
```bash
npx playwright test archived-tests/playwright-tests/tool-calling-rate-limited.spec.js
```

### Unity Testing (Browser)
Open `archived-tests/unity_testing.html` in a browser

### Model Parameter Testing (Browser)
Open `archived-tests/model_parameter_test.html` in a browser

## Notes

- These tests are preserved for historical reference and potential future use
- They may require updates to work with current API versions
- For active testing, use the tests in `/tests/` folder
- Documentation here may reference older configurations

---

**Archived**: 2025-11-21
**Reason**: Repository cleanup and organization
**Maintained By**: Unity AI Lab Team
