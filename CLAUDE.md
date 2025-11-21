# CLAUDE.md - AI Assistant Guide for Unity AI Lab Test Site

This document provides comprehensive guidance for AI assistants (like Claude) working on this codebase. It explains the project structure, workflows, best practices, and where to find important information.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Documentation Locations](#documentation-locations)
4. [TODO Lists and Project Tracking](#todo-lists-and-project-tracking)
5. [Development Workflow](#development-workflow)
6. [Git Workflow and Commit Practices](#git-workflow-and-commit-practices)
7. [Testing Guidelines](#testing-guidelines)
8. [Code Organization](#code-organization)
9. [Important Files and Their Purposes](#important-files-and-their-purposes)
10. [Common Tasks](#common-tasks)

---

## Project Overview

This is a test site for Unity AI Lab that serves as a development and testing environment for:

- **Website**: A dark-themed interactive website showcasing AI capabilities
- **AI Demo Page**: Fully functional interactive demo at /ai/demo showcasing PolliLibJS (~85% complete)
- **PolliLibJS**: JavaScript/Node.js library for Pollinations.AI (✅ 100% complete)
- **PolliLibPy**: Python library for Pollinations.AI (✅ 100% complete)

The project features complete implementations of both libraries, a functional marketing website, and a working AI demo.

**Key Technologies:**
- HTML5, CSS3, JavaScript (vanilla)
- Python 3.7+
- Pollinations.AI API
- Playwright for testing
- GitHub Actions for CI/CD

---

## Repository Structure

```
sitetest0/
├── Docs/                              # All documentation lives here
│   ├── TODO/                          # Project planning and TODO lists
│   │   ├── TODO.md                    # Main project roadmap (START HERE)
│   │   ├── website-TODO.md            # Website-specific tasks
│   │   ├── demo-page-TODO.md          # Demo page planning
│   │   ├── main-app-TODO.md           # Main app planning
│   │   ├── infrastructure-TODO.md     # Infrastructure planning
│   │   └── TODO_EXTRAS.md             # Additional tasks
│   ├── API_COVERAGE.md                # API implementation status
│   ├── CACHE-BUSTING.md               # Cache busting documentation
│   ├── PERFORMANCE_AUDIT.md           # Performance analysis
│   ├── Pollinations_API_Documentation.md  # API reference
│   ├── ROADMAP.md                     # Project roadmap
│   ├── SEO_IMPLEMENTATION.md          # SEO documentation
│   ├── TEST_GUIDE.md                  # Testing documentation
│   ├── TEST_RESULTS.md                # Test execution results
│   └── README.md                      # Docs index
│
├── PolliLibJS/                        # JavaScript library
│   ├── README.md                      # Library documentation
│   ├── TODO.md                        # Library-specific TODO
│   ├── pollylib.js                    # Core library
│   ├── text-to-image.js               # Text-to-Image module
│   ├── text-to-text.js                # Text-to-Text module
│   ├── text-to-speech.js              # Text-to-Speech module
│   ├── speech-to-text.js              # Speech-to-Text module
│   ├── image-to-text.js               # Image-to-Text module
│   ├── image-to-image.js              # Image-to-Image module
│   ├── function-calling.js            # Function calling module
│   ├── streaming-mode.js              # Streaming mode module
│   ├── model-retrieval.js             # Model retrieval module
│   ├── test-utils.js                  # Testing utilities
│   ├── test-utils-demo.js             # Testing demos
│   ├── test_safety_and_reasoning.js   # Safety/reasoning tests
│   └── package.json                   # NPM configuration
│
├── PolliLibPy/                        # Python library
│   ├── README.md                      # Library documentation
│   ├── TODO.md                        # Library-specific TODO
│   ├── pollylib.py                    # Core library
│   ├── text_to_image.py               # Text-to-Image module
│   ├── text_to_text.py                # Text-to-Text module
│   ├── text_to_speech.py              # Text-to-Speech module
│   ├── speech_to_text.py              # Speech-to-Text module
│   ├── image_to_text.py               # Image-to-Text module
│   ├── image_to_image.py              # Image-to-Image module
│   ├── function_calling.py            # Function calling module
│   ├── streaming_mode.py              # Streaming mode module
│   ├── model_retrieval.py             # Model retrieval module
│   ├── test_utils.py                  # Testing utilities
│   ├── test_utils_demo.py             # Testing demos
│   ├── test_safety_and_reasoning.py   # Safety/reasoning tests
│   └── __init__.py                    # Package initialization
│
├── tests/                             # Active Playwright tests
│   ├── navigation.spec.js             # Navigation tests
│   └── backup/                        # Backup test files
│
├── archived-tests/                    # Archived test files (see README)
│   ├── README.md                      # Archive documentation
│   ├── standalone-tool-calling-test.js        # Standalone tool test
│   ├── unity_testing.js               # Unity testing script
│   ├── unity_testing.html             # Unity test interface
│   ├── model_parameter_test.js        # Parameter test script
│   ├── model_parameter_test.html      # Parameter test interface
│   ├── test_unity_tools.html          # Unity tools test interface
│   ├── TOOL_CALLING_TESTS_README.md   # Tool calling test docs
│   ├── ANALYSIS_DEMO_PARAMETERS.md    # Demo parameter analysis
│   ├── MODEL_PARAMETER_COMPATIBILITY.md  # Model compatibility notes
│   ├── FIXES_UNITY_IMAGE_GENERATION.md   # Unity image gen fixes
│   ├── PLAYWRIGHT_CI_NOTES.md         # Playwright CI notes
│   └── playwright-tests/
│       └── tool-calling-rate-limited.spec.js  # Archived Playwright test
│
├── ai/                                # AI Chat Section
│   ├── index.html                     # AI landing page
│   └── demo/                          # Interactive demo
│       ├── index.html                 # Demo page
│       ├── demo.css                   # Demo styles
│       ├── demo.js                    # Demo functionality
│       └── test-cors.html             # CORS testing page
│
├── about/                             # About page
├── contact/                           # Contact page
├── services/                          # Services page
├── projects/                          # Projects page
│
├── index.html                         # Main landing page
├── styles.css                         # Main stylesheet
├── styles.min.css                     # Minified stylesheet
├── script.js                          # Main JavaScript
├── script.min.js                      # Minified JavaScript
├── sitemap.xml                        # SEO sitemap
├── robots.txt                         # Robots directives
├── README.md                          # Main project README
├── CLAUDE.md                          # This file
└── ... (other config files)
```

---

## Documentation Locations

### Primary Documentation

All documentation is centralized in the `Docs/` folder:

1. **[Docs/TODO/TODO.md](./Docs/TODO/TODO.md)** - **START HERE** for project status and planning
2. **[Docs/API_COVERAGE.md](./Docs/API_COVERAGE.md)** - API implementation tracking
3. **[Docs/Pollinations_API_Documentation.md](./Docs/Pollinations_API_Documentation.md)** - Complete API reference
4. **[Docs/TEST_GUIDE.md](./Docs/TEST_GUIDE.md)** - Testing procedures
5. **[Docs/PERFORMANCE_AUDIT.md](./Docs/PERFORMANCE_AUDIT.md)** - Performance metrics
6. **[Docs/SEO_IMPLEMENTATION.md](./Docs/SEO_IMPLEMENTATION.md)** - SEO implementation details

### Library-Specific Documentation

- **[PolliLibJS/README.md](./PolliLibJS/README.md)** - JavaScript library docs
- **[PolliLibPy/README.md](./PolliLibPy/README.md)** - Python library docs

### Demo Page Documentation

- **[ai/demo/index.html](./ai/demo/index.html)** - Interactive AI demo page (~85% complete)
- **[Docs/TODO/demo-page-TODO.md](./Docs/TODO/demo-page-TODO.md)** - Demo features and status

### Archived Tests Documentation

- **[archived-tests/README.md](./archived-tests/README.md)** - Documentation for archived test files
- Archived test files include tool calling tests, Unity testing utilities, and related documentation
- See the archived-tests directory for historical test implementations

### How to Update Documentation

When making changes to the codebase:

1. **Update relevant TODO files** if tasks are completed or new tasks discovered
2. **Update API_COVERAGE.md** if API features are added/modified
3. **Update library READMEs** if library interfaces change
4. **Update TEST_RESULTS.md** after running tests
5. **Update this CLAUDE.md** if project structure changes

---

## TODO Lists and Project Tracking

### Main TODO File

**[Docs/TODO/TODO.md](./Docs/TODO/TODO.md)** - This is the master project roadmap. Always check this first to understand:
- Current project priorities
- What's completed and what's pending
- Overall project status

### Specialized TODO Files

Located in `Docs/TODO/`:

- **website-TODO.md** - Website features and improvements (~90% complete)
- **demo-page-TODO.md** - Demo page tasks (✅ ~85% complete - IMPLEMENTED!)
- **main-app-TODO.md** - Main application planning (external/future)
- **infrastructure-TODO.md** - Infrastructure and deployment
- **TODO_EXTRAS.md** - Additional tasks and nice-to-haves

### Library TODO Files

- **PolliLibJS/TODO.md** - JavaScript library tasks (✅ 100% complete)
- **PolliLibPy/TODO.md** - Python library tasks (✅ 100% complete)

### Updating TODO Files

When working on tasks:

1. Mark tasks as completed with `[x]` or update status emoji
2. Add new discovered tasks to the appropriate TODO file
3. Update completion percentages and status indicators
4. Cross-reference related tasks across TODO files
5. Commit TODO updates separately from code changes

---

## Development Workflow

### 1. Understanding the Current State

Before starting any work:

```bash
# Check current branch and status
git status

# Review main TODO to understand priorities
cat Docs/TODO/TODO.md

# Check test status
cat Docs/TEST_RESULTS.md

# Review recent commits
git log --oneline -10
```

### 2. Planning Work

1. Check relevant TODO file for the area you're working on
2. Understand dependencies and related components
3. Review existing documentation for the feature/area
4. Plan your changes before coding

### 3. Making Changes

1. Create or switch to appropriate branch
2. Make focused, incremental changes
3. Test changes locally
4. Update documentation as you go
5. Commit frequently with clear messages

### 4. Testing

1. Run relevant tests (see [Testing Guidelines](#testing-guidelines))
2. Manually test in browser if UI changes
3. Verify no broken links or references
4. Update TEST_RESULTS.md if needed

---

## Git Workflow and Commit Practices

### Branch Naming

- Use descriptive branch names: `feature/name`, `fix/issue`, `docs/update`
- Claude-created branches: `claude/description-sessionid`

### Commit Messages

Use this format:

```
Type: Brief description (50 chars or less)

- Detailed bullet point 1
- Detailed bullet point 2
- Detailed bullet point 3

Explanation if needed.
```

**Types:**
- `Feat:` - New feature
- `Fix:` - Bug fix
- `Docs:` - Documentation changes
- `Refactor:` - Code restructuring
- `Test:` - Test-related changes
- `Chore:` - Maintenance tasks
- `Style:` - Formatting changes

### Commit Frequency

**✅ DO:**
- Commit after each logical unit of work
- Commit before and after major refactors
- Commit documentation updates separately
- Commit test changes separately from code

**❌ DON'T:**
- Make one massive commit at the end
- Mix unrelated changes in one commit
- Commit broken code (unless explicitly WIP)

### Example Workflow

```bash
# Make changes to files
git add specific-files
git commit -m "Feat: Add new feature X

- Implement core functionality
- Add tests for edge cases
- Update documentation"

# Continue working
git add other-files
git commit -m "Docs: Update TODO list

- Mark feature X as complete
- Add new discovered tasks"
```

---

## Testing Guidelines

### Playwright Tests

Located in `tests/` directory.

**Running Tests:**

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific test
npx playwright test tests/navigation.spec.js

# Run with UI
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

### Test Organization

- **navigation.spec.js** - Navigation and page loading tests (currently active)
- **backup/** - More comprehensive tests (disabled due to flakiness)

### After Testing

1. Review test output
2. Update `Docs/TEST_RESULTS.md` with findings
3. Fix any failing tests before committing
4. Document known issues or flaky tests

### Library Testing

**JavaScript:**
```bash
cd PolliLibJS
node test-utils-demo.js
node test_safety_and_reasoning.js
```

**Python:**
```bash
cd PolliLibPy
python test_utils_demo.py
python test_safety_and_reasoning.py
```

---

## Code Organization

### Website Code

- **index.html** - Main entry point
- **styles.css** - Global styles
- **script.js** - Main JavaScript functionality
- **Page folders** (about/, contact/, etc.) - Individual page code

### Library Code

Both PolliLibJS and PolliLibPy follow the same modular structure:

- **Core library** (pollylib.js/py) - Main class and utilities
- **Feature modules** - One per API capability
- **Test utilities** - Testing and demonstration code

### Configuration Files

- **package.json** - NPM configuration
- **playwright.config.js** - Playwright test configuration
- **.github/workflows/** - CI/CD configuration

---

## Important Files and Their Purposes

### Must-Read Before Changes

1. **README.md** - Project overview and quick start
2. **Docs/TODO/TODO.md** - Current project state
3. **CLAUDE.md** (this file) - Development guide
4. **Docs/API_COVERAGE.md** - What's implemented

### Reference Documentation

1. **Docs/Pollinations_API_Documentation.md** - API reference
2. **Docs/TEST_GUIDE.md** - How to test
3. **Library READMEs** - How to use the libraries

### Status and Results

1. **Docs/TEST_RESULTS.md** - Latest test results
2. **Docs/PERFORMANCE_AUDIT.md** - Performance metrics
3. **Docs/SEO_IMPLEMENTATION.md** - SEO status

---

## Common Tasks

### Adding a New Feature

1. Check `Docs/TODO/TODO.md` to see if it's planned
2. Read relevant documentation (API docs, library READMEs)
3. Implement the feature in appropriate files
4. Add tests for the feature
5. Update documentation:
   - Library README if library change
   - API_COVERAGE.md if new API feature
   - TODO.md to mark task complete
6. Commit with clear message
7. Test thoroughly

### Fixing a Bug

1. Reproduce the bug
2. Identify root cause
3. Write a test that fails (if applicable)
4. Fix the bug
5. Verify test passes
6. Update TEST_RESULTS.md if needed
7. Commit with fix message

### Updating Documentation

1. Make documentation changes
2. Verify all links still work
3. Check markdown formatting
4. Update related docs if needed
5. Commit with `Docs:` prefix

### Reorganizing Code

1. **IMPORTANT:** Check all references to files you're moving
2. Move files using `git mv` to preserve history
3. Update all links and imports
4. Update documentation to reflect new structure
5. Commit changes in logical groups
6. Update this CLAUDE.md if structure changes significantly

### Running a Full Test Suite

```bash
# 1. Test website functionality
npx playwright test

# 2. Test JavaScript library
cd PolliLibJS
node test-utils-demo.js
cd ..

# 3. Test Python library
cd PolliLibPy
python test_utils_demo.py
cd ..

# 4. Update test results
# Edit Docs/TEST_RESULTS.md with findings

# 5. Commit test results
git add Docs/TEST_RESULTS.md
git commit -m "Test: Update test results after full suite run"
```

---

## Project Status Quick Reference

### ✅ Complete

- PolliLibJS - All features implemented (100%)
- PolliLibPy - All features implemented (100%)
- Website - Functional and deployed (~90%)
- SEO - Comprehensive implementation
- Documentation - Well-documented
- CSS/JS Minification - Automated deployment
- Cross-browser testing - Firefox & WebKit 100% passing

### 🟢 Mostly Complete / Polishing

- AI Demo Page - Functional with core features (~85%)
  - ✅ Text-to-text chat
  - ✅ Text-to-image generation
  - ✅ Text-to-speech (TTS)
  - ❌ Speech-to-text (STT) pending
- Playwright tests - Working (10/15 passing, Chromium CI issues documented)
- Performance - Optimizations applied, ongoing improvements

### ❌ Not Started

- Main chat application (external project, not in this repo)
- Full infrastructure automation (backend services)
- STT (speech-to-text) in demo page
- Advanced demo features (conversation export, message editing)

---

## Key Principles

1. **Documentation First** - Always check documentation before making changes
2. **Test Early, Test Often** - Don't skip testing
3. **Commit Frequently** - Small, focused commits are better
4. **Update as You Go** - Don't leave documentation for later
5. **Check TODO Lists** - Stay aligned with project priorities
6. **Preserve Git History** - Use `git mv` for file moves
7. **Link Awareness** - Update all references when moving files

---

## Getting Help

### Documentation Resources

- **This file** - For development guidance
- **README.md** - For project overview
- **Docs/TODO/TODO.md** - For project status
- **Library READMEs** - For library usage

### External Resources

- [Pollinations.AI Documentation](https://github.com/pollinations/pollinations)
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Maintaining This File

This CLAUDE.md file should be updated when:

- Repository structure changes significantly
- New major features are added
- Workflow processes change
- New documentation is added
- Testing procedures change

**Keep this file accurate and up-to-date!** It's the primary guide for AI assistants working on this codebase.

---

**Last Updated:** 2025-11-21
**Version:** 1.2.0
**Maintained by:** Unity AI Lab Team
