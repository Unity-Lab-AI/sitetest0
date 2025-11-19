# Playwright Test Suite - Accessibility & Performance Testing

## Overview

Comprehensive automated test suite to validate and boost accessibility and performance scores for the UnityAILab website.

**Test Coverage:**
- ✅ WCAG 2.1 Level AA Accessibility Compliance
- ✅ Keyboard Navigation & Focus Management
- ✅ Performance & Loading Speed
- ✅ Responsive Design (7 viewports)
- ✅ SEO & Meta Tags

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

### Run Specific Test Suites
```bash
npm run test:accessibility  # WCAG compliance tests
npm run test:keyboard       # Keyboard navigation tests
npm run test:performance    # Performance & loading tests
npm run test:responsive     # Responsive design tests
npm run test:seo            # SEO & meta tag tests
```

### View HTML Report
```bash
npm run test:report
```

---

## Test Suites

### 1. Accessibility Tests (`tests/accessibility.spec.js`)

**Tests 10+ accessibility requirements:**

✅ **Automated WCAG Scans**
- Runs axe-core against all pages
- Tests WCAG 2.1 Level AA compliance
- Detects color contrast, missing labels, invalid ARIA

✅ **ARIA Landmarks**
- Validates role="navigation", role="main", role="contentinfo"
- Checks aria-label attributes
- Verifies proper semantic structure

✅ **Form Accessibility**
- All inputs have associated `<label>` elements
- Proper aria-required attributes
- Screen reader compatibility

✅ **Skip Links**
- "Skip to main content" link present
- Keyboard accessible (first Tab target)
- Points to correct anchor (#main-content)

✅ **Image Alt Text**
- All images have alt attributes
- Alt text is descriptive (not filenames)

✅ **Interactive Elements**
- Buttons have accessible names (text or aria-label)
- Links have descriptive text
- Decorative icons have aria-hidden="true"

✅ **Color Contrast**
- Text meets WCAG AA standards (4.5:1 ratio)
- Large text meets 3:1 ratio

✅ **Navbar Accessibility**
- Toggle has aria-controls, aria-expanded, aria-label
- Proper ARIA attributes for mobile menu

**Expected Impact:** +30-40 accessibility score points

---

### 2. Keyboard Navigation Tests (`tests/keyboard-navigation.spec.js`)

**Tests 10+ keyboard interaction patterns:**

✅ **Tab Order**
- Skip link is first focusable element
- Logical tab order through navigation
- No keyboard traps

✅ **Form Navigation**
- Tab through all form inputs
- Enter and Space activate buttons
- Escape closes modals

✅ **Focus Visibility**
- Focus ring visible on all interactive elements
- Focus indicators meet contrast requirements
- Custom skip-link visible on focus

✅ **Shift+Tab Reverse Navigation**
- Backwards navigation works
- Focus moves to correct previous element

✅ **Mobile Navigation**
- Navbar toggle keyboard accessible
- Enter/Space toggles menu
- Proper aria-expanded state

**Expected Impact:** +5-10 accessibility score points

---

### 3. Performance Tests (`tests/performance.spec.js`)

**Tests 10+ performance metrics:**

✅ **Page Load Speed**
- All pages load under 5 seconds
- First Contentful Paint under 3 seconds
- Network idle state reached quickly

✅ **Resource Loading**
- AOS CSS in <head> (no layout shift)
- JavaScript doesn't block rendering
- Fonts load efficiently

✅ **Caching**
- Resources cached on repeat visits
- Cache headers properly set
- Transfer size = 0 for cached resources

✅ **Error Detection**
- No console errors on load
- No 404 or failed requests
- All images load successfully

✅ **Network Optimization**
- Total requests under 50
- No unnecessary network calls
- Efficient resource loading

✅ **Content Visibility**
- Hero section visible within 3s
- Main content accessible quickly
- No long blocking tasks

**Expected Impact:** +15-20 performance score points

---

### 4. Responsive Design Tests (`tests/responsive.spec.js`)

**Tests 7 viewport sizes + orientation:**

**Viewports:**
- Mobile (iPhone 12): 390x844
- Mobile (Samsung Galaxy S21): 360x800
- Tablet (iPad): 768x1024
- Tablet (iPad Pro): 1024x1366
- Laptop (13"): 1280x800
- Desktop (1080p): 1920x1080
- Desktop (4K): 3840x2160

✅ **Layout Tests**
- No horizontal scroll on any viewport
- Content visible and accessible
- Proper text wrapping

✅ **Mobile Navigation**
- Navbar collapses on mobile (<768px)
- Hamburger menu visible
- Navbar expanded on desktop

✅ **Touch Targets**
- Buttons ≥44x44px on mobile
- Proper spacing between elements
- Easy to tap on touchscreens

✅ **Text Readability**
- Font size ≥14px on all viewports
- Proper line height
- Good contrast ratios

✅ **Image Scaling**
- Images don't exceed viewport width
- Responsive image sizing
- Proper aspect ratios maintained

✅ **Form Usability**
- Forms usable on mobile
- Input fields properly sized
- Buttons accessible

✅ **Orientation Support**
- Portrait and landscape work
- No layout breaks on rotation
- Content reflows properly

**Expected Impact:** +10-15 performance/accessibility score points

---

### 5. SEO Tests (`tests/seo.spec.js`)

**Tests 15+ SEO requirements:**

✅ **Meta Tags**
- Proper title tags (unique per page)
- Meta descriptions (50-160 characters)
- Viewport meta tag present
- Charset properly declared

✅ **Open Graph Tags**
- og:type, og:url, og:title present
- og:description, og:site_name present
- Proper social sharing metadata

✅ **Twitter Cards**
- twitter:card, twitter:title present
- twitter:description present
- Better Twitter appearance

✅ **Heading Hierarchy**
- Exactly one H1 per page
- H1 before H2, H2 before H3
- Logical heading structure

✅ **Link Quality**
- All links have descriptive text
- No generic "click here" links
- Internal links functional

✅ **Image SEO**
- Alt text present and descriptive
- No filename-only alt text

✅ **HTML Structure**
- Valid lang attribute (lang="en")
- Proper HTML5 semantics
- No blocking robots meta

✅ **Internal Links**
- No broken internal links
- All links return < 400 status

**Expected Impact:** +5-10 SEO score points

---

## Test Results Interpretation

### Passing Tests ✅
- Indicates WCAG/performance requirement met
- Feature working as expected
- No action needed

### Failing Tests ❌
- Identifies specific accessibility/performance issue
- Provides detailed error messages
- Test output shows exact problem and location

### Example Output
```
✓ Home page should have proper ARIA landmarks (234ms)
✗ Color contrast should meet WCAG AA standards (432ms)
  - color-contrast: Elements must have sufficient color contrast
    Impact: serious
    Nodes: 3
```

---

## Continuous Improvement Workflow

1. **Run Tests**: `npm test`
2. **Review Failures**: Check test output for specific issues
3. **Fix Issues**: Update HTML/CSS/JS based on test failures
4. **Re-run Tests**: Verify fixes work
5. **Commit**: Push improvements to git
6. **Monitor**: Track score improvements over time

---

## Score Improvement Targets

### Before Test Suite Implementation
- **Accessibility:** ~45/100 ❌
- **Performance:** ~60/100 ⚠️
- **SEO:** ~75/100 🟡

### After All P0 + P1 Fixes
- **Accessibility:** ~85-90/100 ✅
- **Performance:** ~85-90/100 ✅
- **SEO:** ~90-95/100 ✅

### After Potential P2 Fixes (Minification, etc.)
- **Accessibility:** ~95-100/100 🎯
- **Performance:** ~95-100/100 🎯
- **SEO:** ~95-100/100 🎯

---

## CI/CD Integration

The tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run accessibility tests
  run: npm run test:accessibility

- name: Upload test report
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: test-results/html
```

---

## Test Maintenance

### Updating Tests
- Add new test cases in respective spec files
- Follow existing patterns for consistency
- Use descriptive test names

### Baseline Updates
- Update expected values as site improves
- Document why baselines changed
- Keep tests realistic and achievable

### Test Data
- Update page URLs in test constants
- Add new pages to coverage
- Keep viewport sizes current

---

## Tools Used

- **@playwright/test**: Modern browser automation
- **@axe-core/playwright**: Accessibility testing engine
- **lighthouse**: Google's performance auditing tool

---

## Further Reading

- [Playwright Documentation](https://playwright.dev)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)

---

**Created:** 2025-11-19
**Test Suite Version:** 1.0
**Coverage:** 122 total tests across 5 test suites
