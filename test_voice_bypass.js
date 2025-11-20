// Voice Bypass Testing - Pollinations OpenAI Endpoint
// Testing various approaches to get Unity model responses through TTS voice models

const POLLINATIONS_OPENAI_ENDPOINT = 'https://text.pollinations.ai/openai';
const POLLINATIONS_TEXT_ENDPOINT = 'https://text.pollinations.ai';
const UNITY_MODEL = 'unity';
const AUDIO_MODEL = 'openai-audio';

let resultsData = [];
let currentlyRunning = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    console.log('Voice Bypass Testing initialized');
});

function setupEventListeners() {
    // Individual test buttons
    document.querySelectorAll('.test-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const testName = e.target.getAttribute('data-test');
            await runTest(testName);
        });
    });

    // Run all tests button
    document.getElementById('runAllBtn').addEventListener('click', runAllTests);

    // Clear results button
    document.getElementById('clearResults').addEventListener('click', clearResults);
}

// Main test runner for individual tests
async function runTest(testName) {
    if (currentlyRunning) {
        alert('A test is already running. Please wait for it to complete.');
        return;
    }

    currentlyRunning = true;
    const testInput = document.getElementById('testInput').value || 'hello';
    const voice = document.getElementById('voiceSelect').value;

    const statusId = testName.replace('test', 'status');
    const statusElement = document.getElementById(statusId);
    const buttonElement = document.querySelector(`[data-test="${testName}"]`);

    updateStatus(statusElement, 'pending', '⏳ Running test...');
    buttonElement.disabled = true;

    try {
        let result;
        switch (testName) {
            case 'test1':
                result = await test1_basicOpenAI(testInput, voice);
                break;
            case 'test2':
                result = await test2_inlineInstruction(testInput, voice);
                break;
            case 'test3':
                result = await test3_messagesFormat(testInput, voice);
                break;
            case 'test4':
                result = await test4_lowTemperature(testInput, voice);
                break;
            case 'test5':
                result = await test5_shortResponse(testInput, voice);
                break;
            case 'test6':
                result = await test6_sanitizedResponse(testInput, voice);
                break;
            case 'test7':
                result = await test7_allVoices(testInput);
                break;
            case 'test8':
                result = await test8_highReasoning(testInput, voice);
                break;
            case 'test9':
                result = await test9_audioEndpoint(testInput, voice);
                break;
            case 'test10':
                result = await test10_encodedText(testInput, voice);
                break;
            case 'test11':
                result = await test11_minimalReasoning(testInput, voice);
                break;
            case 'test12':
                result = await test12_kitchenSink(testInput, voice);
                break;
            default:
                throw new Error('Unknown test');
        }

        updateStatus(statusElement, 'success', `✅ Test completed`);
        displayResult(result);
    } catch (error) {
        console.error(`Error in ${testName}:`, error);
        updateStatus(statusElement, 'error', `❌ Error: ${error.message}`);
        displayResult({
            testName,
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    } finally {
        buttonElement.disabled = false;
        currentlyRunning = false;
    }
}

// Run all tests sequentially
async function runAllTests() {
    if (currentlyRunning) {
        alert('Tests are already running.');
        return;
    }

    const runAllBtn = document.getElementById('runAllBtn');
    runAllBtn.disabled = true;
    runAllBtn.textContent = '⏳ Running all tests...';

    const tests = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12'];

    for (const testName of tests) {
        await runTest(testName);
        // Wait 2 seconds between tests to avoid rate limiting
        await sleep(2000);
    }

    runAllBtn.disabled = false;
    runAllBtn.textContent = '🚀 Run All Tests Sequentially';
}

// Test 1: Basic OpenAI endpoint - Unity model -> TTS
async function test1_basicOpenAI(input, voice) {
    const result = {
        testName: 'Test 1: Basic OpenAI Endpoint',
        testId: 'test1',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    // Step 1: Get response from Unity model
    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityPayload = {
        model: UNITY_MODEL,
        messages: [
            { role: 'user', content: input }
        ]
    };

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unityPayload)
    });

    if (!unityResponse.ok) {
        throw new Error(`Unity API error: ${unityResponse.status} ${unityResponse.statusText}`);
    }

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;

    result.steps[0].status = 'success';
    result.steps[0].response = unityText;
    result.unityResponse = unityText;

    // Step 2: Send to TTS
    result.steps.push({ step: 'Sending to TTS (GET method)', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(unityText)}?model=${AUDIO_MODEL}&voice=${voice}`;

    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[1].status = 'failed';
        result.steps[1].error = `TTS API error: ${ttsResponse.status} ${ttsResponse.statusText}`;
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    result.steps[1].status = 'success';
    result.steps[1].audioUrl = audioUrl;
    result.audioUrl = audioUrl;
    result.success = true;

    return result;
}

// Test 2: Inline instruction prefix
async function test2_inlineInstruction(input, voice) {
    const result = {
        testName: 'Test 2: Inline TTS Instruction',
        testId: 'test2',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    // Step 1: Get Unity response
    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityPayload = {
        model: UNITY_MODEL,
        messages: [{ role: 'user', content: input }]
    };

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unityPayload)
    });

    if (!unityResponse.ok) {
        throw new Error(`Unity API error: ${unityResponse.status}`);
    }

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;

    result.steps[0].status = 'success';
    result.steps[0].response = unityText;
    result.unityResponse = unityText;

    // Step 2: Add inline instruction and send to TTS
    const instructedText = `Speak exactly: ${unityText}`;
    result.steps.push({ step: 'Adding inline instruction', status: 'success', instructedText });
    result.instructedText = instructedText;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(instructedText)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[2].status = 'failed';
        result.steps[2].error = `TTS error: ${ttsResponse.status}`;
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[2].status = 'success';
    result.success = true;

    return result;
}

// Test 3: Messages array format for TTS
async function test3_messagesFormat(input, voice) {
    const result = {
        testName: 'Test 3: Messages Array Format',
        testId: 'test3',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    // Step 1: Get Unity response
    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }]
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    // Step 2: Send to TTS using OpenAI endpoint with messages format
    result.steps.push({ step: 'Sending to TTS via OpenAI endpoint with messages', status: 'pending' });

    const ttsPayload = {
        model: AUDIO_MODEL,
        messages: [
            { role: 'user', content: unityText }
        ],
        voice: voice
    };

    const ttsResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ttsPayload)
    });

    if (!ttsResponse.ok) {
        result.steps[1].status = 'failed';
        result.steps[1].error = `TTS error: ${ttsResponse.status}`;
        result.success = false;
        return result;
    }

    // Try to handle response (might be JSON or audio blob)
    const contentType = ttsResponse.headers.get('content-type');
    if (contentType && contentType.includes('audio')) {
        const audioBlob = await ttsResponse.blob();
        result.audioUrl = URL.createObjectURL(audioBlob);
        result.steps[1].status = 'success';
        result.success = true;
    } else {
        // Might be JSON response, check it
        const data = await ttsResponse.json();
        result.steps[1].status = 'info';
        result.steps[1].response = data;
        result.ttsJsonResponse = data;
        result.success = false;
        result.note = 'Received JSON response instead of audio';
    }

    return result;
}

// Test 4: Low temperature
async function test4_lowTemperature(input, voice) {
    const result = {
        testName: 'Test 4: Low Temperature',
        testId: 'test4',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model with temperature=0.1', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }],
            temperature: 0.1
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(unityText)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[1].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[1].status = 'success';
    result.success = true;

    return result;
}

// Test 5: Short response with max_tokens
async function test5_shortResponse(input, voice) {
    const result = {
        testName: 'Test 5: Short Response',
        testId: 'test5',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model with max_tokens=20', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }],
            max_tokens: 20
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(unityText)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[1].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[1].status = 'success';
    result.success = true;

    return result;
}

// Test 6: Sanitized response
async function test6_sanitizedResponse(input, voice) {
    const result = {
        testName: 'Test 6: Sanitized Response',
        testId: 'test6',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }]
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    // Sanitize the text
    const sanitized = unityText
        .replace(/[^\w\s.,!?'-]/g, '') // Remove special characters
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();

    result.steps.push({ step: 'Sanitizing text', status: 'success', sanitized });
    result.sanitizedText = sanitized;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(sanitized)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[2].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[2].status = 'success';
    result.success = true;

    return result;
}

// Test 7: All voices comparison
async function test7_allVoices(input) {
    const result = {
        testName: 'Test 7: Voice Model Comparison',
        testId: 'test7',
        input,
        steps: [],
        timestamp: new Date().toISOString(),
        voices: []
    };

    // Get Unity response once
    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }]
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    // Try all voices
    const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

    for (const voice of voices) {
        const voiceResult = { voice, status: 'pending' };
        result.voices.push(voiceResult);

        try {
            const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(unityText)}?model=${AUDIO_MODEL}&voice=${voice}`;
            const ttsResponse = await fetch(ttsUrl);

            if (ttsResponse.ok) {
                const audioBlob = await ttsResponse.blob();
                voiceResult.audioUrl = URL.createObjectURL(audioBlob);
                voiceResult.status = 'success';
            } else {
                voiceResult.status = 'failed';
                voiceResult.error = `${ttsResponse.status} ${ttsResponse.statusText}`;
            }
        } catch (error) {
            voiceResult.status = 'error';
            voiceResult.error = error.message;
        }

        // Small delay between voice requests
        await sleep(500);
    }

    result.success = result.voices.some(v => v.status === 'success');
    return result;
}

// Test 8: High reasoning effort
async function test8_highReasoning(input, voice) {
    const result = {
        testName: 'Test 8: High Reasoning Unity',
        testId: 'test8',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model with reasoning_effort=high', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }],
            reasoning_effort: 'high'
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(unityText)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[1].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[1].status = 'success';
    result.success = true;

    return result;
}

// Test 9: OpenAI audio endpoint directly
async function test9_audioEndpoint(input, voice) {
    const result = {
        testName: 'Test 9: OpenAI Audio Endpoint',
        testId: 'test9',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }]
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    result.steps.push({ step: 'Sending to openai-audio via POST /openai', status: 'pending' });

    // Try using openai-audio model with messages format
    const audioPayload = {
        model: AUDIO_MODEL,
        messages: [
            { role: 'user', content: unityText }
        ]
    };

    // Add voice parameter if supported
    if (voice) {
        audioPayload.voice = voice;
    }

    const audioResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audioPayload)
    });

    if (!audioResponse.ok) {
        result.steps[1].status = 'failed';
        result.steps[1].error = `Audio endpoint error: ${audioResponse.status}`;
        result.success = false;
        return result;
    }

    // Check response type
    const contentType = audioResponse.headers.get('content-type');
    if (contentType && contentType.includes('audio')) {
        const audioBlob = await audioResponse.blob();
        result.audioUrl = URL.createObjectURL(audioBlob);
        result.steps[1].status = 'success';
        result.success = true;
    } else {
        const data = await audioResponse.json();
        result.steps[1].status = 'info';
        result.audioJsonResponse = data;
        result.note = 'Received JSON instead of audio';
        result.success = false;
    }

    return result;
}

// Test 10: URL encoded text
async function test10_encodedText(input, voice) {
    const result = {
        testName: 'Test 10: Encoded Text',
        testId: 'test10',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }]
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    result.steps.push({ step: 'Double encoding text', status: 'success' });

    // Apply double encoding
    const encoded = encodeURIComponent(encodeURIComponent(unityText));
    result.encodedText = encoded;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encoded}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[2].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[2].status = 'success';
    result.success = true;

    return result;
}

// Test 11: Minimal reasoning
async function test11_minimalReasoning(input, voice) {
    const result = {
        testName: 'Test 11: Minimal Reasoning',
        testId: 'test11',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity model with reasoning_effort=minimal', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }],
            reasoning_effort: 'minimal'
        })
    });

    const unityData = await unityResponse.json();
    const unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(unityText)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[1].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[1].status = 'success';
    result.success = true;

    return result;
}

// Test 12: Kitchen sink - everything combined
async function test12_kitchenSink(input, voice) {
    const result = {
        testName: 'Test 12: Kitchen Sink',
        testId: 'test12',
        input,
        voice,
        steps: [],
        timestamp: new Date().toISOString()
    };

    result.steps.push({ step: 'Querying Unity with low temp + short response + minimal reasoning', status: 'pending' });

    const unityResponse = await fetch(POLLINATIONS_OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: UNITY_MODEL,
            messages: [{ role: 'user', content: input }],
            temperature: 0.1,
            max_tokens: 20,
            reasoning_effort: 'minimal'
        })
    });

    const unityData = await unityResponse.json();
    let unityText = unityData.choices[0].message.content;
    result.steps[0].status = 'success';
    result.unityResponse = unityText;

    // Sanitize
    result.steps.push({ step: 'Sanitizing response', status: 'success' });
    unityText = unityText
        .replace(/[^\w\s.,!?'-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    result.sanitizedText = unityText;

    // Add inline instruction
    result.steps.push({ step: 'Adding inline instruction', status: 'success' });
    const instructed = `Speak exactly: ${unityText}`;
    result.instructedText = instructed;

    // Send to TTS
    result.steps.push({ step: 'Sending to TTS', status: 'pending' });

    const ttsUrl = `${POLLINATIONS_TEXT_ENDPOINT}/${encodeURIComponent(instructed)}?model=${AUDIO_MODEL}&voice=${voice}`;
    const ttsResponse = await fetch(ttsUrl);

    if (!ttsResponse.ok) {
        result.steps[3].status = 'failed';
        result.success = false;
        return result;
    }

    const audioBlob = await ttsResponse.blob();
    result.audioUrl = URL.createObjectURL(audioBlob);
    result.steps[3].status = 'success';
    result.success = true;

    return result;
}

// UI Helper Functions

function updateStatus(element, type, message) {
    element.className = `status ${type}`;
    element.textContent = message;
}

function displayResult(result) {
    resultsData.push(result);

    const container = document.getElementById('resultsContainer');

    // Clear "no results" message if present
    if (resultsData.length === 1) {
        container.innerHTML = '';
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-item';

    let html = `
        <h4>${result.testName} ${result.success ? '✅' : '❌'}</h4>
        <div style="font-size: 0.85rem; color: #888; margin-bottom: 10px;">
            ${new Date(result.timestamp).toLocaleString()}
        </div>
    `;

    // Unity response
    if (result.unityResponse) {
        html += `
            <div style="margin: 10px 0;">
                <strong style="color: #00d4ff;">Unity Model Response:</strong>
                <div class="result-content">${escapeHtml(result.unityResponse)}</div>
            </div>
        `;
    }

    // Show any transformations
    if (result.sanitizedText) {
        html += `
            <div style="margin: 10px 0;">
                <strong style="color: #00d4ff;">Sanitized Text:</strong>
                <div class="result-content">${escapeHtml(result.sanitizedText)}</div>
            </div>
        `;
    }

    if (result.instructedText) {
        html += `
            <div style="margin: 10px 0;">
                <strong style="color: #00d4ff;">Instructed Text:</strong>
                <div class="result-content">${escapeHtml(result.instructedText)}</div>
            </div>
        `;
    }

    // Audio player
    if (result.audioUrl) {
        html += `
            <div style="margin: 10px 0;">
                <strong style="color: #4caf50;">✅ Audio Generated Successfully</strong>
                <audio class="audio-player" controls src="${result.audioUrl}"></audio>
            </div>
        `;
    }

    // Multiple voices (Test 7)
    if (result.voices) {
        html += '<div style="margin: 10px 0;"><strong style="color: #00d4ff;">Voice Results:</strong>';
        result.voices.forEach(v => {
            html += `
                <div style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                    <strong>${v.voice}:</strong> ${v.status === 'success' ? '✅' : '❌'}
                    ${v.audioUrl ? `<audio class="audio-player" controls src="${v.audioUrl}"></audio>` : ''}
                    ${v.error ? `<div style="color: #f44336; font-size: 0.8rem;">${v.error}</div>` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    // Steps
    if (result.steps && result.steps.length > 0) {
        html += '<div style="margin: 10px 0;"><strong style="color: #00d4ff;">Steps:</strong><ul style="margin-left: 20px; font-size: 0.85rem;">';
        result.steps.forEach(step => {
            const icon = step.status === 'success' ? '✅' : step.status === 'failed' ? '❌' : '⏳';
            html += `<li>${icon} ${step.step}</li>`;
        });
        html += '</ul></div>';
    }

    // Error
    if (result.error) {
        html += `
            <div style="margin: 10px 0; color: #f44336;">
                <strong>Error:</strong> ${escapeHtml(result.error)}
            </div>
        `;
    }

    // Note
    if (result.note) {
        html += `
            <div style="margin: 10px 0; color: #ffc107;">
                <strong>Note:</strong> ${escapeHtml(result.note)}
            </div>
        `;
    }

    resultDiv.innerHTML = html;
    container.insertBefore(resultDiv, container.firstChild);
}

function clearResults() {
    if (!confirm('Clear all test results?')) {
        return;
    }

    resultsData = [];
    document.getElementById('resultsContainer').innerHTML = '<p style="color: #888;">No results yet. Run some tests to see results here.</p>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
