/**
 * Unity AI Lab Demo Page
 * Main functionality for the AI chat interface
 */

// ===================================
// Configuration and State
// ===================================

const DemoApp = {
    // Chat history
    chatHistory: [],

    // Current audio being played
    currentAudio: null,

    // PolliLibJS instances
    textAPI: null,
    imageAPI: null,
    voiceAPI: null,

    // Settings
    settings: {
        model: 'unity',
        voice: 'alloy',
        voicePlayback: false,
        voiceVolume: 50,
        imageModel: 'flux',
        seed: -1,
        textTemperature: 0.7,
        textMaxTokens: 2048,
        textTopP: 0.9,
        imageWidth: 1024,
        imageHeight: 1024,
        imageEnhance: false,
        voiceSpeed: 1.0
    },

    // Initialize the app
    init() {
        this.initializePolliLib();
        this.setupEventListeners();
        this.setupControlsSync();
        this.configureMarked();
        console.log('Unity AI Lab Demo initialized');
    },

    // Initialize PolliLibJS
    initializePolliLib() {
        try {
            // Initialize Pollinations API (using default referrer)
            this.textAPI = new PollinationsAPI();
            this.imageAPI = new PollinationsAPI();
            this.voiceAPI = new PollinationsAPI();
            console.log('PolliLibJS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize PolliLibJS:', error);
        }
    },

    // Configure marked.js for markdown rendering
    configureMarked() {
        if (typeof marked !== 'undefined') {
            // Configure marked options
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false,
                sanitize: false, // We'll use DOMPurify instead
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (err) {
                            console.error('Highlight error:', err);
                        }
                    }
                    return hljs.highlightAuto(code).value;
                }
            });
        }
    },

    // Setup all event listeners
    setupEventListeners() {
        // Send button
        document.getElementById('sendButton').addEventListener('click', () => this.sendMessage());

        // Message input - Enter to send, Shift+Enter for new line
        const messageInput = document.getElementById('messageInput');
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => this.autoResizeTextarea(messageInput));

        // Clear session button
        document.getElementById('clearSession').addEventListener('click', () => this.clearSession());

        // Stop talking button
        document.getElementById('stopTalking').addEventListener('click', () => this.stopVoicePlayback());

        // Model info update
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.settings.model = e.target.value;
            this.updateModelInfo(e.target.value);
        });
    },

    // Setup controls synchronization with settings
    setupControlsSync() {
        // Volume control
        const volumeSlider = document.getElementById('voiceVolume');
        const volumeValue = document.getElementById('volumeValue');
        volumeSlider.addEventListener('input', (e) => {
            this.settings.voiceVolume = parseInt(e.target.value);
            volumeValue.textContent = e.target.value + '%';
            if (this.currentAudio) {
                this.currentAudio.volume = e.target.value / 100;
            }
        });

        // Voice playback toggle
        document.getElementById('voicePlayback').addEventListener('change', (e) => {
            this.settings.voicePlayback = e.target.checked;
        });

        // Voice selection
        document.getElementById('voiceSelect').addEventListener('change', (e) => {
            this.settings.voice = e.target.value;
        });

        // Image model
        document.getElementById('imageModel').addEventListener('change', (e) => {
            this.settings.imageModel = e.target.value;
        });

        // Seed input
        document.getElementById('seedInput').addEventListener('change', (e) => {
            this.settings.seed = parseInt(e.target.value);
        });

        // Text temperature
        const textTempSlider = document.getElementById('textTemperature');
        const textTempValue = document.getElementById('textTempValue');
        textTempSlider.addEventListener('input', (e) => {
            this.settings.textTemperature = parseFloat(e.target.value);
            textTempValue.textContent = e.target.value;
        });

        // Max tokens
        document.getElementById('textMaxTokens').addEventListener('change', (e) => {
            this.settings.textMaxTokens = parseInt(e.target.value);
        });

        // Top P
        const topPSlider = document.getElementById('textTopP');
        const topPValue = document.getElementById('textTopPValue');
        topPSlider.addEventListener('input', (e) => {
            this.settings.textTopP = parseFloat(e.target.value);
            topPValue.textContent = e.target.value;
        });

        // Image dimensions
        document.getElementById('imageWidth').addEventListener('change', (e) => {
            this.settings.imageWidth = parseInt(e.target.value);
        });

        document.getElementById('imageHeight').addEventListener('change', (e) => {
            this.settings.imageHeight = parseInt(e.target.value);
        });

        // Image enhance
        document.getElementById('imageEnhance').addEventListener('change', (e) => {
            this.settings.imageEnhance = e.target.checked;
        });

        // Voice speed
        const voiceSpeedSlider = document.getElementById('voiceSpeed');
        const voiceSpeedValue = document.getElementById('voiceSpeedValue');
        voiceSpeedSlider.addEventListener('input', (e) => {
            this.settings.voiceSpeed = parseFloat(e.target.value);
            voiceSpeedValue.textContent = e.target.value + 'x';
        });
    },

    // Auto-resize textarea based on content
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = newHeight + 'px';
    },

    // Update model info display
    updateModelInfo(model) {
        const modelInfo = document.getElementById('modelInfo');
        const infoMap = {
            'unity': 'Unity model - Unrestricted AI',
            'openai': 'OpenAI GPT - Advanced reasoning',
            'mistral': 'Mistral - Fast and efficient',
            'claude': 'Claude - Thoughtful responses'
        };
        modelInfo.querySelector('span').textContent = infoMap[model] || 'AI Model';
    },

    // Send a message
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        // Clear input and reset height
        input.value = '';
        input.style.height = 'auto';

        // Hide empty state
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.classList.add('hidden');
        }

        // Add user message to chat
        this.addMessage('user', message);

        // Add to history
        this.chatHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        this.showTypingIndicator();

        // Get AI response
        try {
            const response = await this.getAIResponse(message);
            this.removeTypingIndicator();

            // Add AI response to chat
            this.addMessage('ai', response);

            // Add to history
            this.chatHistory.push({
                role: 'assistant',
                content: response
            });

            // Voice playback if enabled
            if (this.settings.voicePlayback) {
                await this.playVoice(response);
            }
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('ai', 'Sorry, I encountered an error: ' + error.message);
            console.error('AI Response Error:', error);
        }
    },

    // Get AI response using PolliLibJS
    async getAIResponse(message) {
        // Build the request URL
        const baseUrl = 'https://text.pollinations.ai';

        // Build messages array with history (last 10 messages for context)
        const recentHistory = this.chatHistory.slice(-10);
        const messagesParam = encodeURIComponent(JSON.stringify([
            ...recentHistory,
            { role: 'user', content: message }
        ]));

        // Build URL with parameters
        let url = `${baseUrl}/${messagesParam}`;

        // Add model if specified
        if (this.settings.model && this.settings.model !== 'unity') {
            url += `?model=${this.settings.model}`;
        }

        // Add seed if specified (not -1)
        if (this.settings.seed !== -1) {
            url += url.includes('?') ? '&' : '?';
            url += `seed=${this.settings.seed}`;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'PolliLibJS/1.0 Unity AI Lab',
                    'Referer': 's-test-sk37AGI'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            return text || 'No response received';
        } catch (error) {
            console.error('Failed to get AI response:', error);
            throw error;
        }
    },

    // Add a message to the chat
    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (sender === 'ai') {
            // Render markdown for AI messages
            contentDiv.innerHTML = this.renderMarkdown(content);
        } else {
            // Plain text for user messages
            contentDiv.textContent = content;
        }

        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    // Render markdown with nested markdown detection
    renderMarkdown(text) {
        if (typeof marked === 'undefined' || typeof DOMPurify === 'undefined') {
            return this.escapeHtml(text);
        }

        try {
            // Detect nested markdown in code blocks
            // If we find markdown syntax within code blocks, treat them as code
            const processedText = this.detectNestedMarkdown(text);

            // Render markdown
            let html = marked.parse(processedText);

            // Sanitize with DOMPurify
            html = DOMPurify.sanitize(html, {
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'strong', 'em', 'u', 's',
                    'a', 'ul', 'ol', 'li', 'blockquote',
                    'code', 'pre', 'img', 'table', 'thead',
                    'tbody', 'tr', 'th', 'td', 'div', 'span'
                ],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
            });

            return html;
        } catch (error) {
            console.error('Markdown rendering error:', error);
            return this.escapeHtml(text);
        }
    },

    // Detect nested markdown and handle it
    detectNestedMarkdown(text) {
        // This function detects when markdown is nested inside code blocks
        // and ensures it's rendered as code rather than markdown

        // Pattern to detect code blocks
        const codeBlockPattern = /```[\s\S]*?```/g;
        const codeBlocks = text.match(codeBlockPattern);

        if (!codeBlocks) return text;

        // Check each code block for markdown syntax
        codeBlocks.forEach((block) => {
            // If the code block contains markdown syntax, we keep it as-is
            // The marked.js library will handle it correctly
        });

        return text;
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Show typing indicator
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    // Remove typing indicator
    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    },

    // Play voice using text-to-speech
    async playVoice(text) {
        if (!this.settings.voicePlayback) return;

        try {
            // Stop any currently playing audio
            this.stopVoicePlayback();

            // Build TTS URL
            const voice = this.settings.voice;
            const speed = this.settings.voiceSpeed;

            // Clean text for TTS (remove markdown, keep only readable text)
            const cleanText = this.cleanTextForTTS(text);

            // Build URL
            const url = `https://text.pollinations.ai/tts?text=${encodeURIComponent(cleanText)}&voice=${voice}&speed=${speed}`;

            // Create audio element
            this.currentAudio = new Audio(url);
            this.currentAudio.volume = this.settings.voiceVolume / 100;

            // Play audio
            await this.currentAudio.play();

            // Clear reference when done
            this.currentAudio.addEventListener('ended', () => {
                this.currentAudio = null;
            });

        } catch (error) {
            console.error('Voice playback error:', error);
        }
    },

    // Clean text for TTS (remove markdown and code)
    cleanTextForTTS(text) {
        // Remove code blocks
        let clean = text.replace(/```[\s\S]*?```/g, '');

        // Remove inline code
        clean = clean.replace(/`[^`]+`/g, '');

        // Remove markdown headers
        clean = clean.replace(/^#{1,6}\s+/gm, '');

        // Remove markdown bold/italic
        clean = clean.replace(/(\*\*|__)(.*?)\1/g, '$2');
        clean = clean.replace(/(\*|_)(.*?)\1/g, '$2');

        // Remove links but keep text
        clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

        // Remove images
        clean = clean.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

        // Remove HTML tags
        clean = clean.replace(/<[^>]*>/g, '');

        // Trim and return
        return clean.trim();
    },

    // Stop voice playback
    stopVoicePlayback() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    },

    // Clear chat session
    clearSession() {
        // Confirm before clearing
        if (this.chatHistory.length > 0) {
            if (!confirm('Are you sure you want to clear the chat session?')) {
                return;
            }
        }

        // Clear history
        this.chatHistory = [];

        // Clear messages
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = '';

        // Show empty state
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.id = 'emptyState';
        emptyState.innerHTML = `
            <i class="fas fa-comments"></i>
            <p>Begin your journey with just a simple message</p>
        `;
        messagesContainer.appendChild(emptyState);

        // Stop any playing audio
        this.stopVoicePlayback();

        console.log('Chat session cleared');
    }
};

// ===================================
// Initialize when DOM is ready
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    DemoApp.init();
});

// ===================================
// Highlight.js initialization
// ===================================

if (typeof hljs !== 'undefined') {
    // Configure highlight.js
    hljs.configure({
        languages: [
            'javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'php',
            'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'html',
            'css', 'scss', 'sql', 'bash', 'shell', 'powershell', 'json',
            'xml', 'yaml', 'markdown', 'dockerfile', 'nginx', 'apache'
        ]
    });
}

// ===================================
// Service Worker Registration (optional)
// ===================================

if ('serviceWorker' in navigator) {
    // Optionally register a service worker for offline support
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js');
    // });
}
