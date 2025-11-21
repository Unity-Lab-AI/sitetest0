# Playwright Test Suite - Navigation Tests

## Overview

Automated test suite for the UnityAILab website focusing on navigation and page loading functionality.

**Test Coverage:**
- Basic page loading and navigation
- JavaScript functionality verification
- Mobile responsiveness
- Form interactivity
- Footer presence across pages

---

## Installation

```bash
npm install
npx playwright install chromium
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### View HTML Report
```bash
npm run test:report
```

---

## Test Suite

### Navigation Tests (`tests/navigation.spec.js`)

**Tests core navigation functionality:**

#### 1. Complete User Flow Through All Pages

Simulates a real user journey:
- Loads home page and verifies h1 visibility
- Checks JavaScript loaded (verifies feature cards present)
- Tests scrolling functionality
- Navigates to About page via navbar
- Navigates to Services page and verifies service cards
- Navigates to Projects page
- Navigates to Contact page
- Tests contact form interactivity (filling name input)
- Verifies footer with GitHub link

**Purpose:** Ensures the basic flow through the site works without JavaScript errors or navigation issues.

---

#### 2. Mobile Navigation Works

Tests mobile-specific functionality:
- Sets mobile viewport (375x667)
- Verifies navbar toggle button visible
- Clicks toggle to open menu
- Navigates to About page from mobile menu
- Verifies page loads correctly

**Purpose:** Ensures mobile navigation (hamburger menu) functions properly.

---

#### 3. All Pages Return 200 Status

Tests all pages for successful loading:
- `/` (Home)
- `/about/`
- `/services/`
- `/projects/`
- `/contact/`

**Purpose:** Verifies server is serving all pages correctly without 404s or errors.

---

#### 4. JavaScript Loads Correctly

Verifies JavaScript execution:
- Checks navbar exists (Bootstrap loaded)
- Waits for network idle
- Verifies body has `.loaded` class added by JavaScript

**Purpose:** Ensures script.js executes successfully and applies expected DOM modifications.

---

#### 5. Footer Appears on All Pages

Tests footer consistency:
- Loads each page
- Verifies footer is visible
- Checks copyright text contains "UnityAILab"

**Purpose:** Ensures footer component is present across all pages.

---

## Note on Animation Performance Limits

To prevent performance degradation, the smoke throwing animation has built-in limits:

### Limits Implemented (script.js)

**Smoke Puffs:**
- Preferred maximum: 6 puffs on screen
- Hard limit: 10 puffs
- Behavior: When over 6 puffs, dissipation speed increases automatically
- At 10 puffs: Oldest puff is deleted when new one spawns

**Smoke Balls:**
- Preferred maximum: 6 balls
- Hard limit: 10 balls
- Behavior: When limit reached, oldest ball is removed

### Performance Constants

```javascript
var MAX_SMOKE_PUFFS = 6;        // Preferred max
var HARD_LIMIT_PUFFS = 10;      // Hard limit
var MAX_SMOKE_BALLS = 6;        // Preferred max
var HARD_LIMIT_BALLS = 10;      // Hard limit
```

When puff count exceeds the preferred max, dissipation rate increases:
- Base decay rate: 0.006
- Multiplier when over max: 1 + (count - MAX) * 0.5
- Maximum multiplier: 3.0

**Note:** These navigation tests do NOT test the smoke animations themselves - they're purely for navigation and page loading verification.

---

## Configuration

### Test Settings (playwright.config.js)

- **Test directory:** `./tests`
- **Ignored directories:** `**/backup/**`
- **Workers:** 1 (sequential execution for stability)
- **Retries:** 2 in CI, 0 locally
- **Timeout:** 30 seconds per test
- **Expect timeout:** 10 seconds
- **Base URL:** http://localhost:8080

### Reporters

Tests generate three types of reports:
1. **HTML Report:** Interactive report in `playwright-report/`
2. **JSON Report:** Machine-readable results in `test-results/results.json`
3. **List:** Console output during test execution

---

## CI/CD Integration

Tests automatically run in GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    CI: true
```

The workflow:
1. Installs dependencies
2. Installs Playwright browsers (Chromium only)
3. Starts local server on port 8080
4. Runs all tests
5. Uploads test results as artifacts (retained 30 days)

---

## Test Results Interpretation

### Passing Tests ✅
- Indicates core functionality working
- Feature accessible and interactive
- No action needed

### Failing Tests ❌
- Identifies specific issue
- Provides error messages and stack traces
- Screenshots available for failures

### Example Output
```
✓ Complete user flow through all pages (2.3s)
✓ Mobile navigation works (1.1s)
✓ All pages return 200 status (892ms)
✓ JavaScript loads correctly (445ms)
✓ Footer appears on all pages (1.2s)

  5 passed (6.0s)
```

---

## Local Development Workflow

1. **Make Changes:** Update HTML/CSS/JS
2. **Run Tests:** `npm test`
3. **Review Failures:** Check console output
4. **Fix Issues:** Address any failing tests
5. **Re-run:** Verify fixes work
6. **Commit:** Push changes to git

---

## Troubleshooting

### Tests Timing Out

If tests timeout (exceed 30s), check:
- Local server is running on port 8080
- JavaScript has no infinite loops or errors
- Network requests to CDNs are succeeding
- Browser console for JavaScript errors

### Tests Failing to Find Elements

If selectors don't match:
- Verify HTML structure hasn't changed
- Check class names and IDs are correct
- Ensure JavaScript has finished loading before tests run
- Wait for network idle before assertions

### Server Not Starting

If web server fails to start:
```bash
# Kill any existing server
pkill -f "python3 -m http.server"

# Start fresh
python3 -m http.server 8080
```

---

## Backup Tests

Previous comprehensive test suites have been moved to `tests/backup/`:
- `accessibility.spec.js` - WCAG 2.1 AA compliance tests
- `keyboard-navigation.spec.js` - Keyboard accessibility tests
- `performance.spec.js` - Performance metric tests
- `responsive.spec.js` - Multi-viewport responsive tests
- `seo.spec.js` - SEO and meta tag tests
- `functional.spec.js` - Detailed page functionality tests

These can be re-enabled by moving them back to `tests/` if more thorough testing is needed.

---

## Tools Used

- **@playwright/test**: Modern browser automation framework
- **Chromium**: Headless browser for testing

---

## Further Reading

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests](https://playwright.dev/docs/writing-tests)

---

**Created:** 2025-11-19
**Last Updated:** 2025-11-21
**Test Suite Version:** 3.0 (Navigation Tests)
**Total Tests:** 10 navigation tests
**Test Focus:** Site navigation, page loading, and link verification
