/**
 * Model Parameter Testing Script
 * Tests different models with various parameter combinations
 */

// ===================================
// Configuration
// ===================================

const CONFIG = {
    OPENAI_ENDPOINT: 'https://text.pollinations.ai/openai',
    REFERRER: 'UA-73J7ItT-ws'
};

// Tool Calling Addon for system prompts
const TOOL_CALLING_ADDON = `

IMPORTANT: You have access to tool/function calling capabilities. When the user requests visual content (images, pictures, photos, selfies, artwork, etc.), you MUST use the 'generate_image' tool to actually create and display the images. DO NOT just describe images or provide URLs manually - use the tool to generate real, visible images for the user.`;

// Simple system prompt
const SIMPLE_SYSTEM_PROMPT = 'You are a helpful AI assistant.';

// ===================================
// Tool Definitions
// ===================================

// Array-based schema (used in demo page)
const TOOLS_ARRAY_SCHEMA = [
    {
        type: 'function',
        function: {
            name: 'generate_image',
            description: 'Generates and displays an image using Pollinations image generation API. ALWAYS use this tool when the user requests ANY visual content including: images, pictures, photos, selfies, screenshots, visuals, artwork, or any other image-based request. This tool actually creates and displays real images to the user.',
            parameters: {
                type: 'object',
                properties: {
                    images: {
                        type: 'array',
                        description: 'Array of image generation requests.',
                        items: {
                            type: 'object',
                            properties: {
                                prompt: {
                                    type: 'string',
                                    description: 'Detailed description of the image to generate.'
                                },
                                width: {
                                    type: 'integer',
                                    enum: [1024, 1080, 1920],
                                    default: 1024
                                },
                                height: {
                                    type: 'integer',
                                    enum: [1024, 1080, 1920],
                                    default: 1024
                                }
                            },
                            required: ['prompt']
                        }
                    }
                },
                required: ['images']
            }
        }
    }
];

// Single prompt schema (used in Unity testing)
const TOOLS_SINGLE_SCHEMA = [
    {
        type: 'function',
        function: {
            name: 'generate_image',
            description: 'Generates and displays an image using Pollinations image generation API. ALWAYS use this tool when the user requests ANY visual content.',
            parameters: {
                type: 'object',
                properties: {
                    prompt: {
                        type: 'string',
                        description: 'Detailed description of the image to generate.'
                    },
                    width: {
                        type: 'integer',
                        enum: [1024, 1080, 1920],
                        default: 1024
                    },
                    height: {
                        type: 'integer',
                        enum: [1024, 1080, 1920],
                        default: 1024
                    }
                },
                required: ['prompt']
            }
        }
    }
];

// ===================================
// State
// ===================================

const STATE = {
    isRunning: false,
    testResults: []
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    console.log('Model Parameter Test initialized');
});

function setupEventListeners() {
    document.getElementById('runTestBtn').addEventListener('click', runSingleTest);
    document.getElementById('runAllModelsBtn').addEventListener('click', runAllModelsTest);
    document.getElementById('clearResultsBtn').addEventListener('click', clearResults);
}

// ===================================
// Test Execution
// ===================================

async function runSingleTest() {
    if (STATE.isRunning) return;

    STATE.isRunning = true;
    updateButtonStates(true);

    const config = getTestConfiguration();
    await executeTest(config);

    STATE.isRunning = false;
    updateButtonStates(false);
}

async function runAllModelsTest() {
    if (STATE.isRunning) return;

    STATE.isRunning = true;
    updateButtonStates(true);

    const models = ['mistral', 'unity', 'openai', 'openai-fast', 'gemini', 'deepseek', 'qwen-coder'];

    addInfoMessage('🎯 Running tests for all models...');

    for (const model of models) {
        const config = getTestConfiguration();
        config.model = model;
        config.testName = `Auto Test: ${model}`;

        await executeTest(config);

        // Wait a bit between tests to avoid rate limiting
        await sleep(1000);
    }

    addInfoMessage('✅ All model tests completed!');

    STATE.isRunning = false;
    updateButtonStates(false);
}

async function executeTest(config) {
    const startTime = Date.now();

    addInfoMessage(`🔄 Starting test: ${config.testName || config.model}`);

    try {
        // Build the payload
        const payload = buildPayload(config);

        console.log('=== Test Configuration ===');
        console.log(JSON.stringify(config, null, 2));
        console.log('=== Request Payload ===');
        console.log(JSON.stringify(payload, null, 2));

        // Make API call
        const response = await fetch(`${CONFIG.OPENAI_ENDPOINT}?referrer=${CONFIG.REFERRER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const duration = Date.now() - startTime;

        // Parse response
        let responseData;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        console.log('=== API Response ===');
        console.log('Status:', response.status);
        console.log('Response:', responseData);

        // Check if successful
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}\n${JSON.stringify(responseData, null, 2)}`);
        }

        // Handle tool calls if present
        let toolCallsDetected = false;
        let imageGenerated = false;

        if (responseData.choices && responseData.choices[0]) {
            const message = responseData.choices[0].message;

            if (message.tool_calls && message.tool_calls.length > 0) {
                toolCallsDetected = true;
                console.log('Tool calls detected:', message.tool_calls);

                // Check if it's an image generation call
                const imageCall = message.tool_calls.find(tc => tc.function.name === 'generate_image');
                if (imageCall) {
                    imageGenerated = true;
                }
            }
        }

        // Display success result
        displayResult({
            success: true,
            config: config,
            payload: payload,
            response: responseData,
            duration: duration,
            toolCallsDetected: toolCallsDetected,
            imageGenerated: imageGenerated
        });

    } catch (error) {
        const duration = Date.now() - startTime;

        console.error('Test failed:', error);

        // Display error result
        displayResult({
            success: false,
            config: config,
            payload: buildPayload(config),
            error: error.message,
            duration: duration
        });
    }
}

// ===================================
// Configuration
// ===================================

function getTestConfiguration() {
    return {
        model: document.getElementById('testModel').value,
        temperature: document.getElementById('temperatureValue').value,
        maxTokens: document.getElementById('maxTokensValue').value,
        toolChoice: document.getElementById('toolChoiceValue').value,
        message: document.getElementById('testMessage').value,
        systemPromptType: document.getElementById('systemPromptType').value,
        includeTools: document.getElementById('includeTools').checked,
        useArraySchema: document.getElementById('useArraySchema').checked,
        useSingleSchema: document.getElementById('useSingleSchema').checked
    };
}

function buildPayload(config) {
    const payload = {
        model: config.model === 'unity' ? 'mistral' : config.model,
        messages: []
    };

    // Add system prompt
    if (config.systemPromptType !== 'none') {
        let systemPrompt = '';

        if (config.systemPromptType === 'simple') {
            systemPrompt = SIMPLE_SYSTEM_PROMPT;
        } else if (config.systemPromptType === 'tool-calling') {
            systemPrompt = SIMPLE_SYSTEM_PROMPT + TOOL_CALLING_ADDON;
        } else if (config.systemPromptType === 'unity') {
            systemPrompt = 'You are Unity, a helpful AI assistant.' + TOOL_CALLING_ADDON;
        }

        payload.messages.push({
            role: 'system',
            content: systemPrompt
        });
    }

    // Add user message
    payload.messages.push({
        role: 'user',
        content: config.message
    });

    // Add temperature
    if (config.temperature !== 'none') {
        payload.temperature = parseFloat(config.temperature);
    }

    // Add max_tokens
    if (config.maxTokens !== 'none') {
        payload.max_tokens = parseInt(config.maxTokens);
    }

    // Add tools
    if (config.includeTools) {
        if (config.useArraySchema) {
            payload.tools = TOOLS_ARRAY_SCHEMA;
        } else if (config.useSingleSchema) {
            payload.tools = TOOLS_SINGLE_SCHEMA;
        }

        if (config.toolChoice !== 'none') {
            payload.tool_choice = config.toolChoice;
        }
    }

    return payload;
}

// ===================================
// UI Functions
// ===================================

function displayResult(result) {
    const container = document.getElementById('resultsContainer');

    // Clear "no tests" message
    if (container.querySelector('p')) {
        container.innerHTML = '';
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = `result-item ${result.success ? 'success' : 'error'}`;

    // Header
    const header = document.createElement('div');
    header.className = 'result-header';

    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = `${result.config.testName || result.config.model.toUpperCase()} - ${new Date().toLocaleTimeString()}`;

    const status = document.createElement('div');
    status.className = `result-status ${result.success ? 'success' : 'error'}`;
    status.textContent = result.success ? '✅ SUCCESS' : '❌ ERROR';

    header.appendChild(title);
    header.appendChild(status);
    resultDiv.appendChild(header);

    // Details
    const details = document.createElement('div');
    details.className = 'result-details';

    let detailsText = '';
    detailsText += `Model: ${result.config.model}\n`;
    detailsText += `Duration: ${result.duration}ms\n`;
    detailsText += `Temperature: ${result.config.temperature}\n`;
    detailsText += `Max Tokens: ${result.config.maxTokens}\n`;
    detailsText += `Tools Included: ${result.config.includeTools}\n`;

    if (result.config.includeTools) {
        detailsText += `Tool Schema: ${result.config.useArraySchema ? 'Array' : 'Single'}\n`;
        detailsText += `Tool Choice: ${result.config.toolChoice}\n`;
    }

    detailsText += `\n`;

    if (result.success) {
        detailsText += `Tool Calls Detected: ${result.toolCallsDetected ? 'YES' : 'NO'}\n`;
        detailsText += `Image Generation: ${result.imageGenerated ? 'YES' : 'NO'}\n`;
        detailsText += `\n--- Response ---\n`;
        detailsText += JSON.stringify(result.response, null, 2);
    } else {
        detailsText += `\n--- Error ---\n`;
        detailsText += result.error;
        detailsText += `\n\n--- Payload Sent ---\n`;
        detailsText += JSON.stringify(result.payload, null, 2);
    }

    details.textContent = detailsText;
    resultDiv.appendChild(details);

    // Add to top of results
    container.insertBefore(resultDiv, container.firstChild);

    // Store result
    STATE.testResults.push(result);
}

function addInfoMessage(message) {
    const container = document.getElementById('resultsContainer');

    // Clear "no tests" message
    if (container.querySelector('p')) {
        container.innerHTML = '';
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'result-item';
    infoDiv.style.borderLeftColor = '#ffc107';

    const content = document.createElement('div');
    content.textContent = message;
    content.style.fontWeight = '600';
    content.style.color = '#ffc107';

    infoDiv.appendChild(content);
    container.insertBefore(infoDiv, container.firstChild);
}

function clearResults() {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '<p style="color: #888; text-align: center;">No tests run yet. Click "Run Test" to begin.</p>';
    STATE.testResults = [];
}

function updateButtonStates(disabled) {
    document.getElementById('runTestBtn').disabled = disabled;
    document.getElementById('runAllModelsBtn').disabled = disabled;
}

// ===================================
// Utilities
// ===================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
