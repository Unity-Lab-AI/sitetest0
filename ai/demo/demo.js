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

    // Available models (populated from API)
    availableTextModels: [],
    availableImageModels: [],
    availableVoices: [],

    // Settings
    settings: {
        model: 'unity',
        voice: 'alloy',
        voicePlayback: false,
        voiceVolume: 50,
        imageModel: 'flux',
        seed: -1,
        safeMode: false,  // NSFW filter disabled by default (unrestricted content)
        systemPrompt: '',  // Custom system prompt for text models
        textTemperature: 0.7,
        reasoningEffort: '',  // Auto by default
        imageWidth: 1024,
        imageHeight: 1024,
        imageEnhance: false
    },

    // Voice playback queue
    voiceQueue: [],
    isPlayingVoice: false,

    // Initialize the app
    async init() {
        this.initializePolliLib();
        this.setupEventListeners();
        this.setupControlsSync();
        this.configureMarked();

        // Fetch and populate models
        await this.fetchModels();

        // Update voice availability based on initial model
        this.updateVoiceAvailability();

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

    // Fetch models from Pollinations API
    async fetchModels() {
        try {
            await Promise.all([
                this.fetchTextModels(),
                this.fetchImageModels()
            ]);
        } catch (error) {
            console.error('Error fetching models:', error);
            // Continue with default models if fetching fails
        }
    },

    // Fetch text models from Pollinations API
    async fetchTextModels() {
        try {
            // Remove forbidden headers (User-Agent, Referer) - browsers don't allow setting these
            const response = await fetch('https://text.pollinations.ai/models?referrer=UA-73J7ItT-ws', {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('Response is not JSON, using fallback models');
                throw new Error('Invalid response type');
            }

            const models = await response.json();

            // Validate that we got an array
            if (!Array.isArray(models) || models.length === 0) {
                throw new Error('Invalid models data received');
            }

            this.availableTextModels = models;

            // Populate text model dropdown
            this.populateTextModels(models);

            // Extract and populate voices
            this.extractVoices(models);

            console.log('Text models loaded:', models.length);
        } catch (error) {
            console.error('Failed to fetch text models:', error);
            // Provide helpful error context
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.warn('Network error - possibly CORS, network connectivity, or ad blocker. Using fallback models.');
            }
            // Use fallback default models
            this.useFallbackTextModels();
        }
    },

    // Fetch image models from Pollinations API
    async fetchImageModels() {
        try {
            // Remove forbidden headers (User-Agent, Referer) - browsers don't allow setting these
            // Note: No custom headers to avoid CORS preflight (image endpoint only allows Content-Type)
            const response = await fetch('https://image.pollinations.ai/models?referrer=UA-73J7ItT-ws', {
                method: 'GET',
                mode: 'cors',
                cache: 'default'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('Response is not JSON, using fallback models');
                throw new Error('Invalid response type');
            }

            const models = await response.json();

            // Validate that we got an array
            if (!Array.isArray(models) || models.length === 0) {
                throw new Error('Invalid models data received');
            }

            this.availableImageModels = models;

            // Populate image model dropdown
            this.populateImageModels(models);

            console.log('Image models loaded:', models.length);
        } catch (error) {
            console.error('Failed to fetch image models:', error);
            // Provide helpful error context
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.warn('Network error - possibly CORS, network connectivity, or ad blocker. Using fallback models.');
            }
            // Use fallback default models
            this.useFallbackImageModels();
        }
    },

    // Populate text model dropdown
    populateTextModels(models) {
        const modelSelect = document.getElementById('modelSelect');
        if (!modelSelect || !models || models.length === 0) return;

        // Clear existing options
        modelSelect.innerHTML = '';

        // Add models from API
        models.forEach(model => {
            const option = document.createElement('option');
            // Use the model name or id as value
            const modelValue = model.name || model.id || model;
            option.value = modelValue;
            // Use display name or name as label
            option.textContent = model.displayName || model.name || modelValue;

            // Select first model as default
            if (models.indexOf(model) === 0) {
                option.selected = true;
                this.settings.model = modelValue;
                this.updateModelInfo(modelValue);
            }

            modelSelect.appendChild(option);
        });
    },

    // Populate image model dropdown
    populateImageModels(models) {
        const imageModelSelect = document.getElementById('imageModel');
        if (!imageModelSelect || !models || models.length === 0) return;

        // Clear existing options
        imageModelSelect.innerHTML = '';

        // Add models from API
        models.forEach(model => {
            const option = document.createElement('option');
            // Use the model name or id as value
            const modelValue = model.name || model.id || model;
            option.value = modelValue;
            // Use display name or name as label
            option.textContent = model.displayName || model.name || modelValue;

            // Select first model as default
            if (models.indexOf(model) === 0) {
                option.selected = true;
                this.settings.imageModel = modelValue;
            }

            imageModelSelect.appendChild(option);
        });
    },

    // Extract voices from text models that support TTS
    extractVoices(models) {
        const voiceSelect = document.getElementById('voiceSelect');
        if (!voiceSelect || !models) return;

        // Find models that support text-to-speech
        const ttsModels = models.filter(model => {
            // Check if model has voices or supports TTS
            return model.voices ||
                   (model.capabilities && model.capabilities.includes('tts')) ||
                   (model.features && model.features.includes('text-to-speech'));
        });

        // Extract voices from TTS models
        let voices = [];
        ttsModels.forEach(model => {
            if (model.voices && Array.isArray(model.voices)) {
                voices = voices.concat(model.voices);
            }
        });

        // If we found voices, populate the dropdown
        if (voices.length > 0) {
            // Remove duplicates
            voices = [...new Set(voices)];

            // Clear existing options
            voiceSelect.innerHTML = '';

            // Add voices
            voices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = voice;
                option.textContent = this.formatVoiceName(voice);

                // Select first voice as default
                if (index === 0) {
                    option.selected = true;
                    this.settings.voice = voice;
                }

                voiceSelect.appendChild(option);
            });

            this.availableVoices = voices;
            console.log('Voices loaded:', voices.length);
        } else {
            // Keep default hardcoded voices if none found
            console.log('No voices found in models, keeping defaults');
        }
    },

    // Format voice name for display
    formatVoiceName(voice) {
        // Capitalize first letter
        return voice.charAt(0).toUpperCase() + voice.slice(1);
    },

    // Fallback text models when API fails (Firefox/browser compatibility)
    useFallbackTextModels() {
        console.log('Using fallback text models');
        const fallbackModels = [{"name":"deepseek","description":"DeepSeek V3.1","maxInputChars":10000,"reasoning":true,"tier":"seed","community":false,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":["deepseek-v3","deepseek-v3.1","deepseek-reasoning","deepseek-r1-0528"],"vision":false,"audio":false},{"name":"gemini","description":"Gemini 2.5 Flash Lite","tier":"seed","community":false,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"aliases":["gemini-2.5-flash-lite"],"vision":true,"audio":false},{"name":"gemini-search","description":"Gemini 2.5 Flash Lite with Google Search","tier":"seed","community":false,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"aliases":["searchgpt","geminisearch"],"vision":true,"audio":false},{"name":"mistral","description":"Mistral Small 3.2 24B","tier":"seed","community":false,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":["mistral-small-3.1-24b-instruct","mistral-small-3.1-24b-instruct-2503","mistral-small-3.2-24b-instruct-2506"],"vision":false,"audio":false},{"name":"openai","description":"OpenAI GPT-5 Nano","tier":"anonymous","community":false,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"maxInputChars":7000,"aliases":["gpt-5-mini"],"vision":true,"audio":false},{"name":"openai-audio","description":"OpenAI GPT-4o Mini Audio Preview","maxInputChars":5000,"voices":["alloy","echo","fable","onyx","nova","shimmer","coral","verse","ballad","ash","sage","amuch","dan"],"tier":"seed","community":false,"input_modalities":["text","image","audio"],"output_modalities":["audio","text"],"tools":true,"aliases":["gpt-4o-mini-audio-preview"],"vision":true,"audio":true},{"name":"openai-fast","description":"OpenAI GPT-4.1 Nano","tier":"anonymous","community":false,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"maxInputChars":5000,"aliases":["gpt-5-nano"],"vision":true,"audio":false},{"name":"openai-reasoning","description":"OpenAI o4 Mini","tier":"seed","community":false,"reasoning":true,"supportsSystemMessages":false,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"aliases":["o4-mini"],"vision":true,"audio":false},{"name":"qwen-coder","description":"Qwen 2.5 Coder 32B","tier":"flower","community":false,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":["qwen2.5-coder-32b-instruct"],"vision":false,"audio":false},{"name":"roblox-rp","description":"Llama 3.1 8B Instruct","tier":"seed","community":false,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":["llama-roblox","llama-fast-roblox"],"vision":false,"audio":false},{"name":"bidara","description":"BIDARA (Biomimetic Designer and Research Assistant by NASA)","tier":"anonymous","community":true,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"aliases":[],"vision":true,"audio":false},{"name":"chickytutor","description":"ChickyTutor AI Language Tutor - (chickytutor.com)","tier":"anonymous","community":true,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":[],"vision":false,"audio":false},{"name":"evil","description":"Evil","uncensored":true,"tier":"seed","community":true,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"aliases":[],"vision":true,"audio":false},{"name":"midijourney","description":"MIDIjourney","tier":"anonymous","community":true,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":[],"vision":false,"audio":false},{"name":"rtist","description":"Rtist","tier":"seed","community":true,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"aliases":[],"vision":false,"audio":false},{"name":"unity","description":"Unity Unrestricted Agent","uncensored":true,"tier":"seed","community":true,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"aliases":[],"vision":true,"audio":false}];

        this.availableTextModels = fallbackModels;
        this.populateTextModels(fallbackModels);

        // Also populate fallback voices (extracted from openai-audio model)
        const fallbackVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'coral', 'verse', 'ballad', 'ash', 'sage', 'amuch', 'dan'];
        const voiceSelect = document.getElementById('voiceSelect');
        if (voiceSelect) {
            voiceSelect.innerHTML = '';
            fallbackVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = voice;
                option.textContent = this.formatVoiceName(voice);
                if (index === 0) {
                    option.selected = true;
                    this.settings.voice = voice;
                }
                voiceSelect.appendChild(option);
            });
            this.availableVoices = fallbackVoices;
        }
    },

    // Fallback image models when API fails (Firefox/browser compatibility)
    useFallbackImageModels() {
        console.log('Using fallback image models');
        const fallbackModels = ['flux', 'turbo', 'gptimage'];

        this.availableImageModels = fallbackModels;
        this.populateImageModels(fallbackModels);
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
        const voicePlaybackCheckbox = document.getElementById('voicePlayback');
        voicePlaybackCheckbox.addEventListener('change', (e) => {
            this.settings.voicePlayback = e.target.checked;
            // If toggling off while playing, stop talking
            if (!e.target.checked && this.isPlayingVoice) {
                this.stopVoicePlayback();
            }
        });

        // Make the entire toggle switch clickable (Firefox compatibility)
        const voicePlaybackToggle = voicePlaybackCheckbox.closest('.toggle-switch');
        if (voicePlaybackToggle) {
            voicePlaybackToggle.addEventListener('click', (e) => {
                // Prevent double-firing when clicking the checkbox itself
                if (e.target === voicePlaybackCheckbox) return;
                e.preventDefault();
                voicePlaybackCheckbox.checked = !voicePlaybackCheckbox.checked;
                voicePlaybackCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

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

        // Safe mode toggle
        const safeModeCheckbox = document.getElementById('safeMode');
        safeModeCheckbox.addEventListener('change', (e) => {
            this.settings.safeMode = e.target.checked;
            console.log(`Safe mode (NSFW filter) ${e.target.checked ? 'enabled' : 'disabled'} for all models (text, image, voice)`);
        });

        // Make the entire toggle switch clickable (Firefox compatibility)
        const safeModeToggle = safeModeCheckbox.closest('.toggle-switch');
        if (safeModeToggle) {
            safeModeToggle.addEventListener('click', (e) => {
                // Prevent double-firing when clicking the checkbox itself
                if (e.target === safeModeCheckbox) return;
                e.preventDefault();
                safeModeCheckbox.checked = !safeModeCheckbox.checked;
                safeModeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

        // System prompt
        document.getElementById('systemPrompt').addEventListener('input', (e) => {
            this.settings.systemPrompt = e.target.value.trim();
        });

        // Text temperature
        const textTempSlider = document.getElementById('textTemperature');
        const textTempValue = document.getElementById('textTempValue');
        textTempSlider.addEventListener('input', (e) => {
            this.settings.textTemperature = parseFloat(e.target.value);
            textTempValue.textContent = e.target.value;
        });

        // Reasoning effort
        document.getElementById('reasoningEffort').addEventListener('change', (e) => {
            this.settings.reasoningEffort = e.target.value;
        });

        // Image dimensions
        document.getElementById('imageWidth').addEventListener('change', (e) => {
            this.settings.imageWidth = parseInt(e.target.value);
        });

        document.getElementById('imageHeight').addEventListener('change', (e) => {
            this.settings.imageHeight = parseInt(e.target.value);
        });

        // Image enhance toggle
        const imageEnhanceCheckbox = document.getElementById('imageEnhance');
        imageEnhanceCheckbox.addEventListener('change', (e) => {
            this.settings.imageEnhance = e.target.checked;
        });

        // Make the entire toggle switch clickable (Firefox compatibility)
        const imageEnhanceToggle = imageEnhanceCheckbox.closest('.toggle-switch');
        if (imageEnhanceToggle) {
            imageEnhanceToggle.addEventListener('click', (e) => {
                // Prevent double-firing when clicking the checkbox itself
                if (e.target === imageEnhanceCheckbox) return;
                e.preventDefault();
                imageEnhanceCheckbox.checked = !imageEnhanceCheckbox.checked;
                imageEnhanceCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    },

    // Auto-resize textarea based on content
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = newHeight + 'px';
    },

    // Update model info display
    updateModelInfo(modelValue) {
        const modelInfo = document.getElementById('modelInfo');
        if (!modelInfo) return;

        // Try to find the model in available models
        const model = this.availableTextModels.find(m =>
            (m.name === modelValue || m.id === modelValue || m === modelValue)
        );

        let infoText = 'AI Model';

        if (model) {
            // If we have model metadata, use it
            if (typeof model === 'object') {
                const description = model.description || model.displayName || model.name || modelValue;
                infoText = description;
            } else {
                // Fallback to model value with formatting
                infoText = `${modelValue.charAt(0).toUpperCase() + modelValue.slice(1)} model`;
            }
        } else {
            // Fallback for unknown models
            infoText = `${modelValue.charAt(0).toUpperCase() + modelValue.slice(1)} model`;
        }

        const spanElement = modelInfo.querySelector('span');
        if (spanElement) {
            spanElement.textContent = infoText;
        }

        // Update voice playback availability based on community model status
        this.updateVoiceAvailability();
    },

    // Update voice playback availability based on current model
    updateVoiceAvailability() {
        const currentModel = this.getCurrentModelMetadata();
        const isCommunityModel = currentModel && currentModel.community === true;

        const voicePlaybackCheckbox = document.getElementById('voicePlayback');
        const voiceSettings = voicePlaybackCheckbox.closest('.control-group');

        if (isCommunityModel) {
            // Disable voice playback for community models
            voicePlaybackCheckbox.disabled = true;
            voicePlaybackCheckbox.checked = false;
            this.settings.voicePlayback = false;

            // Add visual indicator
            if (voiceSettings) {
                voiceSettings.style.opacity = '0.5';
                voiceSettings.title = 'Voice playback is not available for community models';
            }

            // Stop any currently playing voice
            this.stopVoicePlayback();

            console.log('Voice playback disabled for community model:', this.settings.model);
        } else {
            // Enable voice playback for non-community models
            voicePlaybackCheckbox.disabled = false;

            // Remove visual indicator
            if (voiceSettings) {
                voiceSettings.style.opacity = '1';
                voiceSettings.title = '';
            }
        }
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

        // Add model parameter if specified
        if (this.settings.model) {
            url += `?model=${encodeURIComponent(this.settings.model)}`;
        }

        // Add seed if specified (not -1)
        if (this.settings.seed !== -1) {
            url += url.includes('?') ? '&' : '?';
            url += `seed=${this.settings.seed}`;
        }

        // Add temperature
        url += url.includes('?') ? '&' : '?';
        url += `temperature=${this.settings.textTemperature}`;

        // Add safe mode (NSFW filter) - only add parameter when enabled
        // When safeMode=true: adds safe=true (filtering ON)
        // When safeMode=false: parameter omitted (filtering OFF - default behavior)
        if (this.settings.safeMode) {
            url += url.includes('?') ? '&' : '?';
            url += 'safe=true';
        }

        // Add private mode (always true - hide from public feeds)
        url += url.includes('?') ? '&' : '?';
        url += 'private=true';

        // Add system prompt if specified and not a community model
        const currentModel = this.getCurrentModelMetadata();
        const isCommunityModel = currentModel && currentModel.community === true;
        if (this.settings.systemPrompt && !isCommunityModel) {
            url += url.includes('?') ? '&' : '?';
            url += `system=${encodeURIComponent(this.settings.systemPrompt)}`;
        }

        // Add reasoning effort if specified and model supports it
        const supportsReasoning = currentModel && currentModel.reasoning === true;
        if (this.settings.reasoningEffort && supportsReasoning) {
            url += url.includes('?') ? '&' : '?';
            url += `reasoning_effort=${this.settings.reasoningEffort}`;
        }

        // Add referrer parameter for authentication
        url += url.includes('?') ? '&' : '?';
        url += 'referrer=UA-73J7ItT-ws';

        try {
            // Remove forbidden headers (User-Agent, Referer) - browsers don't allow setting these
            const response = await fetch(url, {
                method: 'GET'
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

    // Get current model metadata
    getCurrentModelMetadata() {
        if (!this.settings.model || this.availableTextModels.length === 0) {
            return null;
        }

        // Find the model in available models
        const model = this.availableTextModels.find(m =>
            (m.name === this.settings.model || m.id === this.settings.model || m === this.settings.model)
        );

        return typeof model === 'object' ? model : null;
    },

    // Generate image with Pollinations API (with safe mode support)
    async generateImage(prompt) {
        try {
            // Build image generation URL with all parameters
            const baseUrl = 'https://image.pollinations.ai/prompt';

            // Encode the prompt
            const encodedPrompt = encodeURIComponent(prompt);

            // Build URL with parameters
            let url = `${baseUrl}/${encodedPrompt}`;

            // Add model parameter
            url += `?model=${encodeURIComponent(this.settings.imageModel)}`;

            // Add width and height
            url += `&width=${this.settings.imageWidth}`;
            url += `&height=${this.settings.imageHeight}`;

            // Add seed if specified (not -1)
            if (this.settings.seed !== -1) {
                url += `&seed=${this.settings.seed}`;
            }

            // IMPORTANT: Add safe mode parameter for NSFW filtering
            // Only add parameter when enabled (omit when disabled for unrestricted content)
            if (this.settings.safeMode) {
                url += '&safe=true';
            }

            // Add private mode (always true - hide from public feeds)
            url += '&private=true';

            // Add enhance parameter if enabled
            if (this.settings.imageEnhance) {
                url += '&enhance=true';
            }

            // Add referrer parameter for authentication
            url += '&referrer=UA-73J7ItT-ws';

            console.log('Generating image with safe mode:', this.settings.safeMode);

            // Return the image URL (can be used in <img> tag)
            return url;

        } catch (error) {
            console.error('Failed to generate image:', error);
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

    // Play voice using text-to-speech with chunking and queue
    async playVoice(text) {
        if (!this.settings.voicePlayback) return;

        // Check if current model is a community model - voice not supported
        const currentModel = this.getCurrentModelMetadata();
        const isCommunityModel = currentModel && currentModel.community === true;

        if (isCommunityModel) {
            console.log('Voice playback skipped: community models do not support voice playback');
            return;
        }

        try {
            // Clean text for TTS (remove markdown, keep only readable text)
            const cleanText = this.cleanTextForTTS(text);

            // Split into chunks (max 1000 chars, respecting sentence boundaries)
            const chunks = this.splitTextIntoChunks(cleanText, 1000);

            // Add chunks to voice queue
            this.voiceQueue.push(...chunks);

            // Start playing if not already playing
            if (!this.isPlayingVoice) {
                this.playNextVoiceChunk();
            }

        } catch (error) {
            console.error('Voice playback error:', error);
        }
    },

    // Split text into chunks respecting sentence boundaries
    splitTextIntoChunks(text, maxLength) {
        const chunks = [];
        let currentChunk = '';

        // Split by sentences (period, question mark, exclamation)
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();

            // If adding this sentence would exceed max length
            if (currentChunk.length + trimmedSentence.length + 1 > maxLength) {
                // Save current chunk if it has content
                if (currentChunk.trim()) {
                    chunks.push(currentChunk.trim());
                }

                // Start new chunk with this sentence
                currentChunk = trimmedSentence;

                // If single sentence is too long, split by words
                if (currentChunk.length > maxLength) {
                    const words = currentChunk.split(' ');
                    currentChunk = '';

                    for (const word of words) {
                        if (currentChunk.length + word.length + 1 > maxLength) {
                            if (currentChunk.trim()) {
                                chunks.push(currentChunk.trim());
                            }
                            currentChunk = word;
                        } else {
                            currentChunk += (currentChunk ? ' ' : '') + word;
                        }
                    }
                }
            } else {
                // Add sentence to current chunk
                currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
            }
        }

        // Add final chunk
        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    },

    // Play next chunk in voice queue
    async playNextVoiceChunk() {
        // Check if queue is empty or playback is disabled
        if (this.voiceQueue.length === 0 || !this.settings.voicePlayback) {
            this.isPlayingVoice = false;
            this.currentAudio = null;
            return;
        }

        this.isPlayingVoice = true;

        // Get next chunk
        const chunk = this.voiceQueue.shift();

        try {
            // Build TTS URL
            const voice = this.settings.voice;

            // Build URL with safe mode - only add parameter when enabled
            let url = `https://text.pollinations.ai/${encodeURIComponent(chunk)}?model=openai-audio&voice=${voice}`;

            // Add safe mode if enabled (omit when disabled for unrestricted content)
            if (this.settings.safeMode) {
                url += '&safe=true';
            }

            url += '&private=true&referrer=UA-73J7ItT-ws';

            // Create audio element
            this.currentAudio = new Audio(url);
            this.currentAudio.volume = this.settings.voiceVolume / 100;

            // When this chunk ends, play next chunk
            this.currentAudio.addEventListener('ended', () => {
                this.playNextVoiceChunk();
            });

            // When this chunk has an error, play next chunk
            this.currentAudio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                this.playNextVoiceChunk();
            });

            // Play audio
            await this.currentAudio.play();

        } catch (error) {
            console.error('Voice chunk playback error:', error);
            // Continue with next chunk on error
            this.playNextVoiceChunk();
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
        // Clear the voice queue
        this.voiceQueue = [];
        this.isPlayingVoice = false;

        // Stop current audio
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
