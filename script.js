// ===================================
// Gothic Theme - Custom JavaScript
// Cross-Browser Compatible
// ===================================

// ===================================
// Polyfills for older browsers
// ===================================

// NodeList.forEach polyfill for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Element.closest polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// scrollTo polyfill for smooth scrolling
(function() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        var Element = window.HTMLElement || window.Element;

        var originalScrollTo = window.scrollTo;

        window.scrollTo = function() {
            if (arguments.length === 1 && typeof arguments[0] === 'object') {
                var options = arguments[0];
                if (options.behavior === 'smooth') {
                    smoothScrollTo(options.top || 0, options.left || 0);
                } else {
                    originalScrollTo.call(window, options.left || 0, options.top || 0);
                }
            } else {
                originalScrollTo.apply(window, arguments);
            }
        };

        function smoothScrollTo(endY, endX) {
            var startY = window.pageYOffset || document.documentElement.scrollTop;
            var startX = window.pageXOffset || document.documentElement.scrollLeft;
            var distanceY = endY - startY;
            var distanceX = endX - startX;
            var startTime = new Date().getTime();
            var duration = 400;

            var timer = setInterval(function() {
                var time = new Date().getTime() - startTime;
                var newY = easeInOutQuad(time, startY, distanceY, duration);
                var newX = easeInOutQuad(time, startX, distanceX, duration);
                if (time >= duration) {
                    clearInterval(timer);
                }
                window.scroll(newX, newY);
            }, 1000 / 60);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
    }
})();

// requestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                       window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
})();

// Initialize AOS (Animate On Scroll) - Check if AOS exists
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            disable: function() {
                // Disable on mobile devices with limited performance
                return window.innerWidth < 768;
            }
        });
    }

    // Initialize all interactive features
    initNavbar();
    initSmoothScroll();
    initScrollIndicator();
    initParallax();
    initFormValidation();
    initHoverEffects();
    initCursorEffect();
    initMobileMenu();
});

// ===================================
// Navbar Scroll Effect
// ===================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Highlight active nav link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===================================
// Smooth Scrolling (Cross-browser)
// ===================================
function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');

            // Only prevent default if it's an actual section link
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                var target = document.querySelector(href);

                if (target) {
                    var offsetTop = target.offsetTop - 80;

                    // Use polyfilled scrollTo
                    window.scrollTo({
                        top: offsetTop,
                        left: 0,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    var navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            }
        });
    });
}

// ===================================
// Scroll Indicator
// ===================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hide scroll indicator when scrolling down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ===================================
// Parallax Effect (with feature detection)
// ===================================
function initParallax() {
    // Only enable parallax on desktop devices
    if (window.innerWidth > 992 && !isTouchDevice()) {
        var ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
                    var heroContent = document.querySelector('.hero-content');

                    if (heroContent && scrolled < 800) {
                        var translateY = scrolled * 0.5;
                        var opacity = 1 - (scrolled / 600);

                        // Use vendor prefixes
                        heroContent.style.webkitTransform = 'translateY(' + translateY + 'px)';
                        heroContent.style.mozTransform = 'translateY(' + translateY + 'px)';
                        heroContent.style.msTransform = 'translateY(' + translateY + 'px)';
                        heroContent.style.oTransform = 'translateY(' + translateY + 'px)';
                        heroContent.style.transform = 'translateY(' + translateY + 'px)';
                        heroContent.style.opacity = Math.max(0, opacity);
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }
}

// Helper function to detect touch devices
function isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

// ===================================
// Form Validation
// ===================================
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputs = this.querySelectorAll('.gothic-input');
            let isValid = true;

            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ff0033';

                    // Reset border color after 2 seconds
                    setTimeout(() => {
                        input.style.borderColor = 'rgba(220, 20, 60, 0.3)';
                    }, 2000);
                } else {
                    input.style.borderColor = '#dc143c';
                }
            });

            if (isValid) {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });

        // Add focus effects
        const inputs = contactForm.querySelectorAll('.gothic-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#dc143c' : '#ff0033'};
        color: white;
        font-family: 'Cinzel', serif;
        border-radius: 0;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        box-shadow: 0 5px 30px rgba(220, 20, 60, 0.5);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Hover Effects
// ===================================
function initHoverEffects() {
    // Feature cards tilt effect
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // Gallery items glow effect
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 60px rgba(220, 20, 60, 0.7)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// ===================================
// Custom Cursor Effect (Desktop only, cross-browser)
// ===================================
function initCursorEffect() {
    // Only show custom cursor on desktop (non-touch) devices
    if (window.innerWidth > 768 && !isTouchDevice()) {
        var cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = 'width:20px;height:20px;border:2px solid #dc143c;border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transition:all 0.1s ease;display:block;';
        document.body.appendChild(cursor);

        var cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        cursorDot.style.cssText = 'width:4px;height:4px;background:#dc143c;border-radius:50%;position:fixed;pointer-events:none;z-index:10000;display:block;';
        document.body.appendChild(cursorDot);

        document.addEventListener('mousemove', function(e) {
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';

            cursorDot.style.left = (e.clientX - 2) + 'px';
            cursorDot.style.top = (e.clientY - 2) + 'px';
        });

        // Expand cursor on hover over clickable elements
        var clickables = document.querySelectorAll('a, button, .feature-card, .gallery-item, .service-card');

        clickables.forEach(function(el) {
            el.addEventListener('mouseenter', function() {
                cursor.style.webkitTransform = 'scale(2)';
                cursor.style.mozTransform = 'scale(2)';
                cursor.style.msTransform = 'scale(2)';
                cursor.style.oTransform = 'scale(2)';
                cursor.style.transform = 'scale(2)';
                cursor.style.borderColor = '#ff0033';
            });

            el.addEventListener('mouseleave', function() {
                cursor.style.webkitTransform = 'scale(1)';
                cursor.style.mozTransform = 'scale(1)';
                cursor.style.msTransform = 'scale(1)';
                cursor.style.oTransform = 'scale(1)';
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#dc143c';
            });
        });
    }
}

// ===================================
// Mobile Menu Handler
// ===================================
function initMobileMenu() {
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            var isClickInside = navbarToggler.contains(e.target) || navbarCollapse.contains(e.target);

            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });

        // Prevent body scroll when menu is open on mobile
        navbarToggler.addEventListener('click', function() {
            setTimeout(function() {
                if (navbarCollapse.classList.contains('show')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }, 350);
        });
    }
}

// ===================================
// Red Streaks Animation Enhancement
// ===================================
function enhanceRedStreaks() {
    const streaks = document.querySelector('.red-streaks');

    if (streaks) {
        let intensity = 0.02;

        window.addEventListener('scroll', function() {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            intensity = 0.02 + (scrollPercent * 0.05);

            streaks.style.opacity = Math.min(1, 0.5 + scrollPercent);
        });
    }
}

enhanceRedStreaks();

// ===================================
// Performance: Throttled scroll handler
// ===================================
(function() {
    var lastScrollTop = 0;
    var ticking = false;

    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Only update if scroll position changed significantly
                if (Math.abs(scrollTop - lastScrollTop) > 5) {
                    lastScrollTop = scrollTop;
                }
                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });
})();

// ===================================
// Viewport and device detection
// ===================================
function getViewportSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}

// Detect reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===================================
// Resize handler (throttled)
// ===================================
(function() {
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Re-initialize features that depend on viewport size
            var viewport = getViewportSize();

            // Refresh AOS on resize if available
            if (typeof AOS !== 'undefined' && viewport.width >= 768) {
                AOS.refresh();
            }
        }, 250);
    });
})();

// ===================================
// Console Message
// ===================================
console.log('%c⚔️ Gothic Realm ⚔️', 'color: #dc143c; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to the darkness...', 'color: #cccccc; font-size: 14px;');
