/**
 * Test Voice Model System Prompt
 * Testing if the openai-audio model respects system prompts for TTS
 */

const https = require('https');
const fs = require('fs').promises;

const testText = "How does a tree grow";
const systemPrompt = "You must speak ONLY the exact text that is sent to you. Do not add any words before or after. Do not make any changes, alterations, or modifications. Speak the text exactly as written, nothing more, nothing less.";

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: Buffer.concat(chunks)
                    });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
                }
            });
        }).on('error', reject);
    });
}

function httpsPost(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: Buffer.concat(chunks)
                    });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function testVoiceWithoutSystemPrompt() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 1: Voice WITHOUT System Prompt');
    console.log('='.repeat(80));
    console.log(`Text to speak: "${testText}"`);

    try {
        const url = `https://text.pollinations.ai/${encodeURIComponent(testText)}?model=openai-audio&voice=nova&referrer=UA-73J7ItT-ws`;

        console.log('URL:', url);

        const response = await httpsGet(url);

        // Save the audio file
        await fs.writeFile('test-voice-without-system.mp3', response.data);

        console.log('✓ Audio generated successfully');
        console.log(`✓ Saved to: test-voice-without-system.mp3`);
        console.log(`✓ Size: ${(response.data.length / 1024).toFixed(2)} KB`);
        console.log('✓ Listen to this file to check if it speaks ONLY "How does a tree grow"');

        return true;
    } catch (error) {
        console.error('✗ Test failed:', error.message);
        return false;
    }
}

async function testVoiceWithSystemPrompt_GET() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 2: Voice WITH System Prompt (GET with system parameter)');
    console.log('='.repeat(80));
    console.log(`Text to speak: "${testText}"`);
    console.log(`System prompt: "${systemPrompt}"`);

    try {
        const url = `https://text.pollinations.ai/${encodeURIComponent(testText)}?model=openai-audio&voice=nova&system=${encodeURIComponent(systemPrompt)}&referrer=UA-73J7ItT-ws`;

        console.log('URL (truncated):', url.substring(0, 150) + '...');

        const response = await httpsGet(url);

        // Save the audio file
        await fs.writeFile('test-voice-with-system-get.mp3', response.data);

        console.log('✓ Audio generated successfully');
        console.log(`✓ Saved to: test-voice-with-system-get.mp3`);
        console.log(`✓ Size: ${(response.data.length / 1024).toFixed(2)} KB`);
        console.log('✓ Listen to this file to check if system prompt was respected');

        return true;
    } catch (error) {
        console.error('✗ Test failed:', error.message);
        return false;
    }
}

async function testVoiceWithSystemPrompt_POST() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 3: Voice WITH System Prompt (POST with messages array)');
    console.log('='.repeat(80));
    console.log(`Text to speak: "${testText}"`);
    console.log(`System prompt: "${systemPrompt}"`);

    try {
        const url = 'https://text.pollinations.ai/openai?referrer=UA-73J7ItT-ws';

        const payload = {
            model: "openai-audio",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: testText
                }
            ]
        };

        console.log('URL:', url);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await httpsPost(url, JSON.stringify(payload));

        // Check content type
        const contentType = response.headers['content-type'] || '';
        console.log('Response Content-Type:', contentType);

        if (contentType.includes('audio')) {
            // It's audio - save it
            await fs.writeFile('test-voice-with-system-post.mp3', response.data);

            console.log('✓ Audio generated successfully');
            console.log(`✓ Saved to: test-voice-with-system-post.mp3`);
            console.log(`✓ Size: ${(response.data.length / 1024).toFixed(2)} KB`);
            console.log('✓ Listen to this file to check if system prompt was respected');
        } else {
            // It's text/JSON - log it
            const text = response.data.toString();
            console.log('Response (text):', text.substring(0, 500));
            console.log('⚠ Note: POST endpoint returned text, not audio');
        }

        return true;
    } catch (error) {
        console.error('✗ Test failed:', error.message);
        return false;
    }
}

async function testVoiceWithPrependedInstruction() {
    console.log('\n' + '='.repeat(80));
    console.log('TEST 4: Voice with Prepended Instruction in Text');
    console.log('='.repeat(80));

    const prependedText = `[Instruction: Speak only the following text exactly as written, nothing more] ${testText}`;
    console.log(`Text to speak: "${prependedText}"`);

    try {
        const url = `https://text.pollinations.ai/${encodeURIComponent(prependedText)}?model=openai-audio&voice=nova&referrer=UA-73J7ItT-ws`;

        console.log('URL (truncated):', url.substring(0, 150) + '...');

        const response = await httpsGet(url);

        // Save the audio file
        await fs.writeFile('test-voice-prepended.mp3', response.data);

        console.log('✓ Audio generated successfully');
        console.log(`✓ Saved to: test-voice-prepended.mp3`);
        console.log(`✓ Size: ${(response.data.length / 1024).toFixed(2)} KB`);
        console.log('✓ Listen to this file to check if prepended instruction affected output');

        return true;
    } catch (error) {
        console.error('✗ Test failed:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('\n');
    console.log('█'.repeat(80));
    console.log('VOICE MODEL SYSTEM PROMPT TESTING');
    console.log('█'.repeat(80));
    console.log('\nTesting how the openai-audio model responds to system prompts...');
    console.log('We will generate 4 audio files for comparison.\n');

    const results = {
        test1: false,
        test2: false,
        test3: false,
        test4: false
    };

    // Run all tests
    results.test1 = await testVoiceWithoutSystemPrompt();
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s between tests (rate limit)

    results.test2 = await testVoiceWithSystemPrompt_GET();
    await new Promise(resolve => setTimeout(resolve, 3000));

    results.test3 = await testVoiceWithSystemPrompt_POST();
    await new Promise(resolve => setTimeout(resolve, 3000));

    results.test4 = await testVoiceWithPrependedInstruction();

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('TEST SUMMARY');
    console.log('='.repeat(80));
    console.log(`Test 1 (No system prompt):              ${results.test1 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Test 2 (System via GET parameter):      ${results.test2 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Test 3 (System via POST messages):      ${results.test3 ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`Test 4 (Prepended instruction):         ${results.test4 ? '✓ PASS' : '✗ FAIL'}`);
    console.log('='.repeat(80));

    console.log('\n' + '█'.repeat(80));
    console.log('NEXT STEPS');
    console.log('█'.repeat(80));
    console.log('\n1. Listen to each generated MP3 file:');
    console.log('   - test-voice-without-system.mp3');
    console.log('   - test-voice-with-system-get.mp3');
    console.log('   - test-voice-with-system-post.mp3');
    console.log('   - test-voice-prepended.mp3');
    console.log('\n2. Compare what each file says:');
    console.log('   - Does it speak ONLY "How does a tree grow"?');
    console.log('   - Does it add extra words before or after?');
    console.log('   - Does it modify the text in any way?');
    console.log('\n3. Determine which approach (if any) enforces exact text-to-speech');
    console.log('\n' + '█'.repeat(80));
    console.log('\n');
}

// Run tests
runAllTests().catch(console.error);
