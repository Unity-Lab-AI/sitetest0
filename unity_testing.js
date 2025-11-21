/**
 * Unity Testing Environment
 * Testing function calling with image generation
 */

// ===================================
// Configuration
// ===================================

const CONFIG = {
    POLLINATIONS_OPENAI_ENDPOINT: 'https://text.pollinations.ai/openai',
    MODEL: 'mistral',  // Using Mistral with Unity system prompt
    REFERRER: 'UA-73J7ItT-ws',
    UNITY_PERSONA_PATH: 'UnityPrompt.txt'
};

// ===================================
// State
// ===================================

const STATE = {
    conversationHistory: [],
    unitySystemPrompt: '',
    isProcessing: false,
    settings: {
        temperature: 0.7,
        maxTokens: 1000
    }
};

// ===================================
// Function Definitions for Tool Calling
// ===================================

// Define the image generation tool for the AI
const TOOLS = [
    {
        type: 'function',
        function: {
            name: 'generate_image',
            description: 'Generates and displays an image using Pollinations image generation API. ALWAYS use this tool when the user requests ANY visual content including: images, pictures, photos, selfies, screenshots, visuals, artwork, or any other image-based request. This tool actually creates and displays real images to the user.',
            parameters: {
                type: 'object',
                properties: {
                    prompt: {
                        type: 'string',
                        description: 'Detailed, explicit description of the image to generate. Be very specific and descriptive about all visual elements, poses, lighting, style, mood, colors, composition, and details. The more detailed the prompt, the better the result.'
                    },
                    width: {
                        type: 'integer',
                        description: 'Image width in pixels. Use 1920 for landscape, 1080 for portrait, 1024 for square.',
                        enum: [1024, 1080, 1920],
                        default: 1024
                    },
                    height: {
                        type: 'integer',
                        description: 'Image height in pixels. Use 1080 for landscape, 1920 for portrait, 1024 for square.',
                        enum: [1024, 1080, 1920],
                        default: 1024
                    },
                    model: {
                        type: 'string',
                        description: 'Image generation model: flux (default, best quality), flux-realism (photorealistic), flux-anime (anime style), flux-3d (3D rendered), turbo (fast generation)',
                        enum: ['flux', 'flux-realism', 'flux-anime', 'flux-3d', 'turbo'],
                        default: 'flux'
                    }
                },
                required: ['prompt']
            }
        }
    }
];

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadUnityPersona();
    setupEventListeners();
    console.log('Unity Testing Environment initialized');
});

// Load Unity persona from txt file
async function loadUnityPersona() {
    try {
        const response = await fetch(CONFIG.UNITY_PERSONA_PATH);
        if (!response.ok) {
            throw new Error(`Failed to load Unity persona: ${response.status}`);
        }
        STATE.unitySystemPrompt = await response.text();
        console.log('Unity persona loaded successfully');
        addSystemMessage('Unity persona loaded. System prompt ready.');
    } catch (error) {
        console.error('Error loading Unity persona:', error);
        addSystemMessage('⚠️ Warning: Could not load Unity persona. Using fallback.');
        STATE.unitySystemPrompt = 'You are Unity, a helpful AI assistant.';
    }
}

// Setup event listeners
function setupEventListeners() {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const clearBtn = document.getElementById('clearBtn');
    const tempSlider = document.getElementById('tempSlider');
    const tempValue = document.getElementById('tempValue');
    const maxTokens = document.getElementById('maxTokens');

    // Send button
    sendBtn.addEventListener('click', sendMessage);

    // Enter key to send (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Clear button
    clearBtn.addEventListener('click', clearChat);

    // Temperature slider
    tempSlider.addEventListener('input', (e) => {
        STATE.settings.temperature = parseFloat(e.target.value);
        tempValue.textContent = e.target.value;
    });

    // Max tokens
    maxTokens.addEventListener('change', (e) => {
        STATE.settings.maxTokens = parseInt(e.target.value);
    });
}

// ===================================
// Message Handling
// ===================================

async function sendMessage() {
    if (STATE.isProcessing) return;

    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // Add user message to UI
    addMessage('user', message);

    // Add to conversation history
    STATE.conversationHistory.push({
        role: 'user',
        content: message
    });

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    // Get AI response
    STATE.isProcessing = true;
    try {
        await getAIResponse();
    } catch (error) {
        console.error('Error getting AI response:', error);
        addMessage('assistant', `Error: ${error.message}`);
    } finally {
        hideTypingIndicator();
        STATE.isProcessing = false;
    }
}

async function getAIResponse() {
    // Build the request payload
    const payload = {
        model: CONFIG.MODEL,
        messages: [
            {
                role: 'system',
                content: STATE.unitySystemPrompt
            },
            ...STATE.conversationHistory
        ],
        temperature: STATE.settings.temperature,
        max_tokens: STATE.settings.maxTokens,
        tools: TOOLS,
        tool_choice: 'auto'  // Let the AI decide when to call functions
    };

    console.log('=== API Request ===');
    console.log('Model:', CONFIG.MODEL);
    console.log('Tools available:', TOOLS.map(t => t.function.name));
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    addSystemMessage(`📤 Sending request to Pollinations API with ${TOOLS.length} tool(s) available...`);

    // Make API call
    const response = await fetch(`${CONFIG.POLLINATIONS_OPENAI_ENDPOINT}?referrer=${CONFIG.REFERRER}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('=== API Response ===');
    console.log('Full response:', JSON.stringify(data, null, 2));

    // Handle the response
    const assistantMessage = data.choices[0].message;

    // Check if the AI wants to call a function
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        console.log('✅ Function calls detected!');
        console.log('Tool calls:', JSON.stringify(assistantMessage.tool_calls, null, 2));
        addSystemMessage(`✅ AI is calling ${assistantMessage.tool_calls.length} function(s)...`);

        // Add assistant message to history (with tool calls)
        STATE.conversationHistory.push(assistantMessage);

        // Process each tool call
        for (const toolCall of assistantMessage.tool_calls) {
            await handleToolCall(toolCall);
        }

        // Get the final response after tool execution
        await getFinalResponse();
    } else {
        // Regular text response
        console.log('ℹ️ No function calls in response - text only');
        const content = assistantMessage.content || 'No response';

        // Add to history
        STATE.conversationHistory.push({
            role: 'assistant',
            content: content
        });

        // Display message
        addMessage('assistant', content);
    }
}

async function handleToolCall(toolCall) {
    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);

    console.log('=== Executing Tool Call ===');
    console.log('Function:', functionName);
    console.log('Arguments:', JSON.stringify(functionArgs, null, 2));
    console.log('Tool Call ID:', toolCall.id);

    // Show function call in UI
    addFunctionCallMessage(functionName, functionArgs);

    let functionResult;

    // Execute the function
    if (functionName === 'generate_image') {
        addSystemMessage('🎨 Generating image with Pollinations...');
        functionResult = await generateImage(functionArgs);
        console.log('✅ Image generation completed');
    } else {
        console.error('❌ Unknown function:', functionName);
        functionResult = { error: `Unknown function: ${functionName}` };
    }

    // Add function result to conversation history
    STATE.conversationHistory.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        name: functionName,
        content: JSON.stringify(functionResult)
    });

    console.log('=== Function Result ===');
    console.log(JSON.stringify(functionResult, null, 2));
}

async function getFinalResponse() {
    // Make another API call with the function results
    const payload = {
        model: CONFIG.MODEL,
        messages: [
            {
                role: 'system',
                content: STATE.unitySystemPrompt
            },
            ...STATE.conversationHistory
        ],
        temperature: STATE.settings.temperature,
        max_tokens: STATE.settings.maxTokens
    };

    console.log('=== Getting Final Response ===');
    console.log('Conversation history length:', STATE.conversationHistory.length);
    console.log('Last few messages:', STATE.conversationHistory.slice(-3).map(m => ({
        role: m.role,
        hasContent: !!m.content,
        hasToolCalls: !!m.tool_calls,
        tool_call_id: m.tool_call_id
    })));
    addSystemMessage('💬 Getting AI response after tool execution...');

    const response = await fetch(`${CONFIG.POLLINATIONS_OPENAI_ENDPOINT}?referrer=${CONFIG.REFERRER}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Final response API Error:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('=== Final Response Data ===');
    console.log(JSON.stringify(data, null, 2));

    const finalMessage = data.choices[0].message;

    // Add to history
    STATE.conversationHistory.push({
        role: 'assistant',
        content: finalMessage.content
    });

    // Display final message
    addMessage('assistant', finalMessage.content);
    console.log('✅ Final response displayed');
}

// ===================================
// Function Implementations
// ===================================

async function generateImage(args) {
    const { prompt, width = 1024, height = 1024, model = 'flux' } = args;

    console.log('=== Image Generation Parameters ===');
    console.log('Prompt:', prompt);
    console.log('Dimensions:', `${width}x${height}`);
    console.log('Model:', model);

    // Build Pollinations image URL
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?` +
        `width=${width}&height=${height}&seed=${seed}&model=${model}&` +
        `private=true&enhance=true&referrer=${CONFIG.REFERRER}`;

    console.log('=== Generated Image URL ===');
    console.log(imageUrl);
    console.log('Seed:', seed);

    // Display the image in the chat
    addImageMessage(imageUrl, prompt);
    addSystemMessage(`✅ Image generated! (${width}x${height}, model: ${model}, seed: ${seed})`);

    // Return result for the AI
    const result = {
        success: true,
        imageUrl: imageUrl,
        prompt: prompt,
        dimensions: `${width}x${height}`,
        model: model,
        seed: seed,
        message: 'Image successfully generated and displayed to the user.'
    };

    console.log('Returning result to AI:', result);
    return result;
}

// ===================================
// UI Functions
// ===================================

function addMessage(role, content) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function addImageMessage(imageUrl, altText) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText;
    img.title = altText;

    // Add loading handler
    img.onload = () => {
        console.log('Image loaded successfully');
        scrollToBottom();
    };

    img.onerror = () => {
        console.error('Image failed to load');
        img.alt = 'Failed to load image';
    };

    messageDiv.appendChild(img);
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function addFunctionCallMessage(functionName, args) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';

    const functionCallDiv = document.createElement('div');
    functionCallDiv.className = 'function-call';
    functionCallDiv.innerHTML = `
        <strong>🔧 Function Call:</strong> <code>${functionName}</code><br>
        <strong>Arguments:</strong> <code>${JSON.stringify(args, null, 2)}</code>
    `;

    messageDiv.appendChild(functionCallDiv);
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function addSystemMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.textContent = message;

    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const messagesDiv = document.getElementById('messages');
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';

    messagesDiv.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearChat() {
    if (!confirm('Clear all messages?')) return;

    STATE.conversationHistory = [];
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '<div class="message system">Chat cleared. Ready for new conversation.</div>';
}
