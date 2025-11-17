/**
 * Template Loader - Loads reusable HTML templates (header, footer, etc.)
 */

// Track template loading status
let templatesLoaded = {
    header: false,
    footer: false
};

// Check if all templates are loaded and dispatch event
function checkTemplatesLoaded() {
    if (templatesLoaded.header && templatesLoaded.footer) {
        // Dispatch custom event to notify that templates are ready
        const event = new CustomEvent('templatesLoaded');
        document.dispatchEvent(event);
    }
}

// Load templates on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTemplate('header', 'header-placeholder');
    loadTemplate('footer', 'footer-placeholder');
});

/**
 * Load a template file into a placeholder element
 * @param {string} templateName - Name of the template file (without .html)
 * @param {string} placeholderId - ID of the element to insert the template into
 */
function loadTemplate(templateName, placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn(`Placeholder element with id "${placeholderId}" not found`);
        return;
    }

    // Determine the correct path based on current location
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.includes('/about');
    const basePath = isInSubdirectory ? '..' : '.';

    fetch(`${basePath}/${templateName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${templateName}.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;

            // Mark this template as loaded
            templatesLoaded[templateName] = true;

            // If this is the header, set active nav link
            if (templateName === 'header') {
                setActiveNavLink();
            }

            // Check if all templates are loaded
            checkTemplatesLoaded();
        })
        .catch(error => {
            console.error(`Error loading ${templateName}:`, error);
            // Mark as loaded even on error to prevent hanging
            templatesLoaded[templateName] = true;
            checkTemplatesLoaded();
        });
}

/**
 * Set the active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Check if we're on the about page
        if (currentPath.includes('/about') && href === './about') {
            link.classList.add('active');
        }
        // Check if we're on home and this is a home link
        else if ((currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.includes('sitetest0')) && href === './#home') {
            link.classList.add('active');
        }
        // Remove active from other links
        else {
            link.classList.remove('active');
        }
    });
}
