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
    initSmokeEffect();
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
// Smoke Effect System (Desktop & Mobile)
// ===================================
function initSmokeEffect() {
    // Create canvas for smoke
    var smokeCanvas = document.createElement('canvas');
    smokeCanvas.id = 'smoke-canvas';
    smokeCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(smokeCanvas);

    var ctx = smokeCanvas.getContext('2d');
    var particles = [];
    var mouseX = 0;
    var mouseY = 0;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var mouseVelocityX = 0;
    var mouseVelocityY = 0;
    var lastMoveTime = Date.now();
    var isMoving = false;

    // Set canvas size
    function resizeCanvas() {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Smoke particle class
    function SmokeParticle(x, y, velocityX, velocityY, size, type) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX || (Math.random() - 0.5) * 0.5;
        this.velocityY = velocityY || -Math.random() * 1.5 - 0.5; // Always rises
        this.size = size || Math.random() * 20 + 10;
        this.maxSize = this.size * 3;
        this.alpha = 0.6;
        this.life = 1.0;
        this.decayRate = type === 'puff' ? 0.008 : 0.012;
        this.growRate = type === 'puff' ? 0.8 : 0.3;
        this.type = type || 'normal';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    SmokeParticle.prototype.update = function() {
        // Rise and drift
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Slow down horizontal movement
        this.velocityX *= 0.99;

        // Increase upward movement slightly
        this.velocityY -= 0.02;

        // Grow and fade
        if (this.size < this.maxSize) {
            this.size += this.growRate;
        }

        this.life -= this.decayRate;
        this.alpha = this.life * 0.6;
        this.rotation += this.rotationSpeed;

        return this.life > 0;
    };

    SmokeParticle.prototype.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(100, 100, 100, ' + this.alpha + ')');
        gradient.addColorStop(0.5, 'rgba(70, 70, 70, ' + (this.alpha * 0.5) + ')');
        gradient.addColorStop(1, 'rgba(40, 40, 40, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);

        ctx.restore();
    };

    // Smoke ball for fling effect
    function SmokeBall(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.size = 30;
        this.alpha = 0.8;
        this.life = 1.0;
        this.active = true;
    }

    SmokeBall.prototype.update = function() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Check if hit edge
        if (this.x < 0 || this.x > smokeCanvas.width || this.y < 0 || this.y > smokeCanvas.height) {
            this.explode();
            return false;
        }

        return this.active;
    };

    SmokeBall.prototype.draw = function() {
        ctx.save();

        var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(120, 120, 120, ' + this.alpha + ')');
        gradient.addColorStop(0.6, 'rgba(80, 80, 80, ' + (this.alpha * 0.5) + ')');
        gradient.addColorStop(1, 'rgba(50, 50, 50, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    };

    SmokeBall.prototype.explode = function() {
        // Create explosion puff
        for (var i = 0; i < 15; i++) {
            var angle = (Math.PI * 2 * i) / 15;
            var speed = Math.random() * 3 + 2;
            particles.push(new SmokeParticle(
                this.x,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                Math.random() * 15 + 10,
                'puff'
            ));
        }
        this.active = false;
    };

    var smokeBalls = [];

    // Mouse movement tracking
    function updateMousePosition(x, y) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = x;
        mouseY = y;

        var currentTime = Date.now();
        var deltaTime = currentTime - lastMoveTime;

        if (deltaTime > 0) {
            mouseVelocityX = (mouseX - lastMouseX) / deltaTime * 16;
            mouseVelocityY = (mouseY - lastMouseY) / deltaTime * 16;
        }

        lastMoveTime = currentTime;
        isMoving = true;

        // Create trail particles
        if (Math.random() < 0.3) {
            particles.push(new SmokeParticle(
                mouseX + (Math.random() - 0.5) * 10,
                mouseY + (Math.random() - 0.5) * 10,
                mouseVelocityX * 0.1,
                -Math.random() * 1 - 1
            ));
        }
    }

    // Desktop mouse events
    document.addEventListener('mousemove', function(e) {
        updateMousePosition(e.clientX, e.clientY);
    });

    document.addEventListener('click', function(e) {
        // Create big puff on click
        for (var i = 0; i < 30; i++) {
            var angle = (Math.PI * 2 * i) / 30;
            var speed = Math.random() * 2 + 1;
            particles.push(new SmokeParticle(
                e.clientX,
                e.clientY,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 1,
                Math.random() * 25 + 15,
                'puff'
            ));
        }
    });

    // Track mouse stop for fling effect
    var moveCheckInterval = setInterval(function() {
        if (isMoving) {
            var timeSinceMove = Date.now() - lastMoveTime;

            // If mouse stopped abruptly with velocity
            if (timeSinceMove > 50) {
                var speed = Math.sqrt(mouseVelocityX * mouseVelocityX + mouseVelocityY * mouseVelocityY);

                if (speed > 5) {
                    // Fling smoke ball
                    smokeBalls.push(new SmokeBall(
                        mouseX,
                        mouseY,
                        mouseVelocityX * 0.5,
                        mouseVelocityY * 0.5
                    ));
                }

                isMoving = false;
                mouseVelocityX = 0;
                mouseVelocityY = 0;
            }
        }
    }, 50);

    // Mobile touch events
    var lastTouchX = 0;
    var lastTouchY = 0;

    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            var touch = e.touches[0];
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
            updateMousePosition(touch.clientX, touch.clientY);

            // Small puff on touch start
            for (var i = 0; i < 10; i++) {
                particles.push(new SmokeParticle(
                    touch.clientX,
                    touch.clientY,
                    (Math.random() - 0.5) * 2,
                    -Math.random() * 2 - 1,
                    Math.random() * 15 + 8,
                    'puff'
                ));
            }
        }
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            var touch = e.touches[0];
            updateMousePosition(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        isMoving = false;
    }, { passive: true });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

        // Update and draw particles
        particles = particles.filter(function(particle) {
            var alive = particle.update();
            if (alive) {
                particle.draw();
            }
            return alive;
        });

        // Update and draw smoke balls
        smokeBalls = smokeBalls.filter(function(ball) {
            var active = ball.update();
            if (active) {
                ball.draw();
            }
            return active;
        });

        requestAnimationFrame(animate);
    }

    animate();
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
console.log('%c🧠 UnityAILab 🧠', 'color: #dc143c; font-size: 24px; font-weight: bold;');
console.log('%cPushing AI to its limits...', 'color: #cccccc; font-size: 14px;');
