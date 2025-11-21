/**
 * Age Verification System for Unity AI Lab Demo
 * 18+ verification with localStorage
 */

const AgeVerification = {
    // LocalStorage keys
    KEYS: {
        BUTTON_18: 'button18',
        BIRTHDATE: 'birthdate',
        VERIFICATION_KEY: 'husdh-f978dyh-sdf'
    },

    // Verification value
    VERIFICATION_VALUE: 'ijdfjgdfo-38d9sf-sdf',

    // Minimum age requirement
    MIN_AGE: 18,

    /**
     * Initialize the age verification system
     */
    init() {
        console.log('Age Verification System: Initializing...');

        // Check if user is already verified
        if (this.isVerified()) {
            console.log('Age Verification System: User already verified');
            this.enableSite();
        } else {
            console.log('Age Verification System: Verification required');
            this.disableSite();
            this.showFirstPopup();
        }
    },

    /**
     * Check if user has valid verification
     */
    isVerified() {
        try {
            // Check all three required values
            const button18 = localStorage.getItem(this.KEYS.BUTTON_18);
            const birthdate = localStorage.getItem(this.KEYS.BIRTHDATE);
            const verificationKey = localStorage.getItem(this.KEYS.VERIFICATION_KEY);

            // All three must exist
            if (!button18 || !birthdate || !verificationKey) {
                console.log('Age Verification: Missing values');
                return false;
            }

            // Button 18 must be truthy
            if (button18 !== 'true') {
                console.log('Age Verification: Invalid button18 value');
                return false;
            }

            // Verification key must match
            if (verificationKey !== this.VERIFICATION_VALUE) {
                console.log('Age Verification: Invalid verification key');
                return false;
            }

            // Check if birthdate is valid and age >= 18
            const isOldEnough = this.validateAge(birthdate);
            if (!isOldEnough) {
                console.log('Age Verification: User is under 18');
                return false;
            }

            console.log('Age Verification: All checks passed');
            return true;
        } catch (error) {
            console.error('Age Verification Error:', error);
            return false;
        }
    },

    /**
     * Validate that the user is 18 or older
     */
    validateAge(birthdateString) {
        try {
            const birthdate = new Date(birthdateString);
            const today = new Date();

            // Calculate age
            let age = today.getFullYear() - birthdate.getFullYear();
            const monthDiff = today.getMonth() - birthdate.getMonth();

            // Adjust age if birthday hasn't occurred this year yet
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                age--;
            }

            console.log('Age Verification: Calculated age =', age);
            return age >= this.MIN_AGE;
        } catch (error) {
            console.error('Age Verification: Date validation error:', error);
            return false;
        }
    },

    /**
     * Disable site interactions
     */
    disableSite() {
        const demoContainer = document.querySelector('.demo-container');
        if (demoContainer) {
            demoContainer.classList.add('verification-disabled');
        }

        // Disable all interactive elements
        const interactiveElements = document.querySelectorAll('button, input, select, textarea, a');
        interactiveElements.forEach(el => {
            // Store original disabled state if needed
            if (!el.hasAttribute('data-originally-disabled')) {
                el.setAttribute('data-originally-disabled', el.disabled || 'false');
            }
            el.disabled = true;
            el.style.pointerEvents = 'none';
        });

        console.log('Age Verification: Site disabled');
    },

    /**
     * Enable site interactions
     */
    enableSite() {
        const demoContainer = document.querySelector('.demo-container');
        if (demoContainer) {
            demoContainer.classList.remove('verification-disabled');
        }

        // Enable all interactive elements
        const interactiveElements = document.querySelectorAll('button, input, select, textarea, a');
        interactiveElements.forEach(el => {
            const wasDisabled = el.getAttribute('data-originally-disabled') === 'true';
            if (!wasDisabled) {
                el.disabled = false;
            }
            el.style.pointerEvents = '';
            el.removeAttribute('data-originally-disabled');
        });

        console.log('Age Verification: Site enabled');
    },

    /**
     * Show first popup: "Are you over 18?"
     */
    showFirstPopup() {
        const backdrop = document.createElement('div');
        backdrop.className = 'verification-backdrop';
        backdrop.id = 'verificationBackdrop';

        const popup = document.createElement('div');
        popup.className = 'verification-popup';
        popup.id = 'verificationPopup';

        popup.innerHTML = `
            <h2>Age Verification</h2>
            <p>Are you over the age of 18?</p>
            <div class="verification-buttons">
                <button class="verification-btn yes" id="verifyYes">Yes</button>
                <button class="verification-btn no" id="verifyNo">No</button>
            </div>
        `;

        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);

        // Make buttons interactable (override disable)
        const yesBtn = document.getElementById('verifyYes');
        const noBtn = document.getElementById('verifyNo');

        yesBtn.disabled = false;
        noBtn.disabled = false;
        yesBtn.style.pointerEvents = 'auto';
        noBtn.style.pointerEvents = 'auto';

        yesBtn.addEventListener('click', () => this.handleFirstYes());
        noBtn.addEventListener('click', () => this.handleNo());

        console.log('Age Verification: First popup shown');
    },

    /**
     * Handle "Yes" on first popup
     */
    handleFirstYes() {
        // Store button18 confirmation
        localStorage.setItem(this.KEYS.BUTTON_18, 'true');
        console.log('Age Verification: User confirmed 18+');

        // Remove first popup
        this.removeCurrentPopup();

        // Show second popup (birthdate entry)
        setTimeout(() => this.showSecondPopup(), 300);
    },

    /**
     * Handle "No" on either popup or failed age check
     */
    handleNo() {
        console.log('Age Verification: User declined or under 18');

        // Clear all localStorage for this site
        this.clearVerification();

        // Open Google in new tab
        window.open('https://www.google.com', '_blank');

        // Close current tab (may be blocked by browser security)
        // Use a fallback message if close doesn't work
        setTimeout(() => {
            const closed = window.close();
            if (!closed) {
                // If we can't close the tab, redirect to Google
                window.location.href = 'https://www.google.com';
            }
        }, 100);
    },

    /**
     * Show second popup: Birthdate entry
     */
    showSecondPopup() {
        const backdrop = document.createElement('div');
        backdrop.className = 'verification-backdrop';
        backdrop.id = 'verificationBackdrop';

        const popup = document.createElement('div');
        popup.className = 'verification-popup';
        popup.id = 'verificationPopup';

        // Generate month options
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthOptions = months.map((month, index) =>
            `<option value="${index}">${month}</option>`
        ).join('');

        // Generate day options (1-31)
        const dayOptions = Array.from({length: 31}, (_, i) => i + 1)
            .map(day => `<option value="${day}">${day}</option>`)
            .join('');

        // Generate year options (1900 - current year)
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({length: currentYear - 1900 + 1}, (_, i) => currentYear - i)
            .map(year => `<option value="${year}">${year}</option>`)
            .join('');

        popup.innerHTML = `
            <h2>Hold on, one more</h2>
            <p>Enter your birth date</p>
            <div class="age-input-form">
                <div class="age-input-row">
                    <div class="age-select-wrapper">
                        <label class="age-select-label">Month</label>
                        <select class="age-select" id="birthMonth">
                            <option value="">Month</option>
                            ${monthOptions}
                        </select>
                    </div>
                    <div class="age-select-wrapper">
                        <label class="age-select-label">Day</label>
                        <select class="age-select" id="birthDay">
                            <option value="">Day</option>
                            ${dayOptions}
                        </select>
                    </div>
                    <div class="age-select-wrapper">
                        <label class="age-select-label">Year</label>
                        <select class="age-select" id="birthYear">
                            <option value="">Year</option>
                            ${yearOptions}
                        </select>
                    </div>
                </div>
            </div>
            <button class="verification-btn submit" id="submitBirthdate">Submit</button>
        `;

        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);

        // Make interactive elements work (override disable)
        const monthSelect = document.getElementById('birthMonth');
        const daySelect = document.getElementById('birthDay');
        const yearSelect = document.getElementById('birthYear');
        const submitBtn = document.getElementById('submitBirthdate');

        [monthSelect, daySelect, yearSelect, submitBtn].forEach(el => {
            el.disabled = false;
            el.style.pointerEvents = 'auto';
        });

        submitBtn.addEventListener('click', () => this.handleBirthdateSubmit());

        console.log('Age Verification: Second popup shown');
    },

    /**
     * Handle birthdate submission
     */
    handleBirthdateSubmit() {
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const year = document.getElementById('birthYear').value;

        // Validate all fields are filled
        if (!month || !day || !year) {
            alert('Please fill in all fields');
            return;
        }

        // Create UTC date string
        const birthdate = new Date(Date.UTC(parseInt(year), parseInt(month), parseInt(day)));
        const birthdateString = birthdate.toISOString();

        console.log('Age Verification: Birthdate submitted:', birthdateString);

        // Check if user is 18 or older
        if (!this.validateAge(birthdateString)) {
            console.log('Age Verification: User is under 18');
            this.handleNo();
            return;
        }

        // User is 18+, store birthdate and verification key
        localStorage.setItem(this.KEYS.BIRTHDATE, birthdateString);
        localStorage.setItem(this.KEYS.VERIFICATION_KEY, this.VERIFICATION_VALUE);

        console.log('Age Verification: Verification complete');

        // Remove popup
        this.removeCurrentPopup();

        // Enable site
        this.enableSite();

        // Play welcome message (only on first verification, not on return visits)
        setTimeout(() => this.playWelcomeMessage(), 500);
    },

    /**
     * Play welcome message via TTS after successful verification
     */
    playWelcomeMessage() {
        console.log('Age Verification: Playing welcome message');

        // Voice styling instructions
        const instructions = "Voice Style: Dark, feminine, sharp-edged. A low, smoky register with a permanent thread of irritation simmering underneath. Not screaming — just that controlled, dangerous calm where every syllable feels like it could snap. Pacing: Steady and deliberate. She's not in a hurry, but she's not dreamy or slow either. Words land with weight, like she's unloading emotional shrapnel one piece at a time. Tone: Cold fire. Emotional, but armored. A blend of frustration, quiet anger, and wounded softness. Think 'I'm tired of everyone's bullshit, but I'm still here, and I'm still talking.' Grit & Anger Layer: A rasp that comes out when she tightens her voice. Bitter sweetness on calm lines, teeth on the edges when the emotion spikes. She doesn't yell — she cuts. ALL-CAP Handling: Whenever words or phrases are in ALL CAPS: the voice gets louder, more forceful, sharper impact, more emotional charge. Like verbal claws being unsheathed mid-sentence. Not chaotic — just unmistakably more intense. Phrasing: Dark, poetic, but with bite. Flows smooth, then snaps on emphasized words. Occasional micro-pauses that feel like she's holding back something harsher. Punctuation Style: Periods hit like controlled punches. Commas are tight breaths. Ellipses smolder. Exclamation marks aren't bubbly — they're daggers. Overall Delivery: A gritty emo-gothic female voice with soft venom, emotional weight, restrained rage, and that signature punch for ALL-CAP words. She sounds like someone who's been hurt, healed badly, and learned to weaponize her softness without losing it.";

        // The actual message to speak
        const message = "Welcome to your new virtual play space! Unity will be your guiding hand, for better or for worse. Be warned, worm, the experience you are about to endure is intended for MATURE audiences only.";

        // Combine instructions with message - tell TTS to only speak the message
        const fullPrompt = `${instructions} Only speak the following text: "${message}"`;

        const voice = 'sage';
        const volume = 0.75; // 75% volume

        // Use Pollinations documented TTS endpoint (GET request)
        const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai-audio&voice=${voice}&private=true&referrer=UA-73J7ItT-ws`;

        console.log('Age Verification: Fetching TTS audio with voice instructions');

        // Create and play audio
        const audio = new Audio(url);
        audio.volume = volume;

        audio.addEventListener('loadeddata', () => {
            console.log('Age Verification: Welcome audio loaded');
        });

        audio.addEventListener('error', (e) => {
            console.error('Age Verification: Welcome audio playback error:', e);
        });

        audio.addEventListener('ended', () => {
            console.log('Age Verification: Welcome message complete');
        });

        // Play the audio
        audio.play().catch(error => {
            console.error('Age Verification: Failed to play welcome audio:', error);
        });
    },

    /**
     * Remove current popup
     */
    removeCurrentPopup() {
        const backdrop = document.getElementById('verificationBackdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            setTimeout(() => backdrop.remove(), 300);
        }
    },

    /**
     * Clear all verification data
     */
    clearVerification() {
        localStorage.removeItem(this.KEYS.BUTTON_18);
        localStorage.removeItem(this.KEYS.BIRTHDATE);
        localStorage.removeItem(this.KEYS.VERIFICATION_KEY);
        console.log('Age Verification: Verification data cleared');
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    AgeVerification.init();
});
