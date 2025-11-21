# Playwright Tests

## Overview

This directory contains automated browser tests for the Unity AI Lab website.

### Test Suites

1. **navigation.spec.js** - Navigation and page loading tests (10 tests)
2. **browser-compatibility.spec.js** - Browser compatibility & element loading tests (23 tests)

## Running Tests

### Prerequisites

For tests to run properly, you need to install Playwright browsers with system dependencies:

```bash
# Install Node.js dependencies
npm install

# Install Playwright browsers AND system dependencies
npx playwright install --with-deps
```

### Run Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test navigation.spec.js
npx playwright test browser-compatibility.spec.js

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed
```

## Known Issues

### Browser Crashes in Local Development

If you encounter "Page crashed" errors when running tests locally, this is usually due to:

1. **Missing system dependencies** - WebKit and Firefox require additional system libraries
2. **Headless mode issues** - Some JavaScript animations may cause crashes in headless browsers
3. **Permission issues** - Firefox may have issues with HOME folder permissions

### Solutions

**Option 1: Install System Dependencies (Recommended)**

```bash
# Ubuntu/Debian
npx playwright install-deps

# Or manually install for specific browsers
npx playwright install --with-deps chromium
npx playwright install --with-deps firefox
npx playwright install --with-deps webkit
```

**Option 2: Run Only Chromium Tests**

Chromium usually has the best compatibility in most environments:

```bash
npx playwright test --project=chromium
```

**Option 3: Use CI/CD**

Tests are configured to run properly in GitHub Actions where all dependencies are correctly installed. Check the `.github/workflows/deploy.yml` for the proper setup.

### Firefox Permission Issues

If Firefox fails with permission errors about HOME folder ownership:

```bash
# Set HOME environment variable
HOME=/root npx playwright test --project=firefox
```

### WebKit Missing Dependencies

If WebKit fails to launch due to missing libraries, you need to install system dependencies:

```bash
sudo npx playwright install-deps webkit
```

## Test Environment

The tests are designed to work in CI/CD environments where:

- All system dependencies are installed (`npx playwright install --with-deps`)
- Browsers run in headless mode
- Proper permissions are configured

## CI/CD

Tests run automatically in GitHub Actions on every deployment. See test results in:

- Actions tab → Workflow run → "Run Playwright Tests" job
- Test artifacts (retained for 30 days)
- HTML report (uploaded as artifact)

## Troubleshooting

### Tests Pass in CI but Fail Locally

This is normal! CI environments have all required system dependencies installed. To match CI locally:

```bash
# Install all dependencies like CI does
npx playwright install --with-deps
```

### Timeout Errors

If tests timeout:

- Check that the local server is running on port 8080
- Increase timeout in playwright.config.js
- Check JavaScript console errors in headed mode

### Element Not Found Errors

If elements can't be found:

- Run tests in headed mode to see what's happening: `npx playwright test --headed`
- Check that JavaScript has fully loaded
- Verify the site is working correctly in a regular browser

## Test Structure

### Navigation Tests

- Basic page navigation
- Link functionality
- Page loading verification
- Mobile navigation

### Browser Compatibility Tests

#### Chromium Tests (4 tests)
- HTML element loading
- JavaScript execution
- Page error checking
- Resource loading

#### Firefox Tests (5 tests)
- HTML element loading
- JavaScript execution
- Page error checking
- Resource loading
- Animation rendering

#### WebKit Tests (6 tests)
- HTML element loading
- JavaScript execution
- Page error checking
- Resource loading
- Animation rendering
- WebKit-specific CSS handling

#### Cross-Browser Tests (5 tests)
- Navigation link count
- Feature card count
- Service card count
- Footer social links
- JavaScript 'loaded' class

#### AI Demo Tests (3 tests)
- Demo page loading per browser

## Documentation

For more detailed testing information, see:

- **[Docs/TEST_GUIDE.md](../Docs/TEST_GUIDE.md)** - Comprehensive testing guide
- **[CLAUDE.md](../CLAUDE.md)** - AI assistant development guide

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report showing:
- Test results
- Screenshots of failures
- Video recordings (if enabled)
- Test timings
- Error stack traces
