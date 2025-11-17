# Automatic Cache-Busting System

This repository uses an automated cache-busting system to ensure GitHub Pages always serves the latest versions of assets (CSS and JavaScript files).

## How It Works

The system uses **git commit hashes** as version identifiers for assets. Each time you update `script.js` or `styles.css`, the version automatically updates to match the current git commit.

### Components

1. **HTTP Meta Tags** (in `index.html`)
   - Cache-Control headers that discourage browser caching
   - Located in the `<head>` section

2. **Version Query Parameters**
   - Assets are loaded with `?v=HASH` query strings
   - Example: `script.js?v=67ee1b3`
   - These automatically update on each commit

3. **Manual Update Script** (`update-version.sh`)
   - Run manually: `./update-version.sh`
   - Updates all asset versions to current git hash
   - Useful when you want to force an update

4. **Git Pre-Commit Hook** (`.git/hooks/pre-commit`)
   - Automatically runs when committing changes to `script.js` or `styles.css`
   - Updates `index.html` with new version numbers
   - Ensures versions are always in sync

5. **GitHub Actions Workflow** (`.github/workflows/update-cache-busting.yml`)
   - Runs on push to main/master branch
   - Automatically updates versions when assets change
   - Commits the updated `index.html` back to the repository

## Usage

### Automatic (Recommended)

Just commit your changes normally:

```bash
git add script.js styles.css
git commit -m "Update smoke effects"
git push
```

The pre-commit hook and GitHub Actions will handle version updates automatically.

### Manual

If you need to manually update versions:

```bash
./update-version.sh
git add index.html
git commit -m "Update cache-busting versions"
git push
```

## Why This Solves the Caching Issue

1. **Unique Versions**: Each commit creates a unique hash, so browsers see assets as "new files"
2. **No CDN Lag**: GitHub Pages CDN recognizes different query parameters as different resources
3. **Automatic Updates**: No manual version number management needed
4. **Git-Aligned**: Versions match your git history, making debugging easier

## Benefits

- ✅ GitHub Pages always serves fresh content
- ✅ No need to manually increment version numbers
- ✅ Works across all browsers and CDNs
- ✅ Automatic with git workflow integration
- ✅ Version history matches git commits

## Troubleshooting

If you still see old content:

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Check the version**: View page source and verify the `?v=` parameter matches latest commit
3. **Wait for GitHub Pages**: Allow 1-2 minutes for GitHub Pages to rebuild after pushing
4. **Clear browser cache**: In browser settings, clear cached images and files

## Notes

- The `.git/hooks/pre-commit` file is local only (not pushed to the repository)
- If setting up on a new machine, run: `chmod +x update-version.sh .git/hooks/pre-commit`
- The GitHub Actions workflow handles this automatically in CI/CD
