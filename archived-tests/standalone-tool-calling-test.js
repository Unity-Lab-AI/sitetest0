#!/usr/bin/env node

/**
 * Standalone Rate-Limited Tool Calling Test Script
 *
 * This script tests image generation via tool calling across 5 models
 * - 20 tests per model = 100 total tests
 * - Fresh session per test (no conversation history)
 * - Rate limiting to avoid API throttling
 * - Success rate tracking for reliability validation
 *
 * Target: 100% or 99.9%+ success rate
 *
 * Usage: node standalone-tool-calling-test.js
 */

// ===================================
// Configuration
// ===================================

const CONFIG = {
    OPENAI_ENDPOINT: 'https://text.pollinations.ai/openai',
    REFERRER: 'UA-73J7ItT-ws',
    RATE_LIMIT_DELAY: 2000, // 2 seconds between requests
    MAX_RETRIES: 2, // Retry failed tests
    TIMEOUT: 60000 // 60 seconds timeout
};

// Models to test (all support tool calling)
const MODELS_TO_TEST = [
    { name: 'unity', actualModel: 'mistral', useUnityPrompt: true },
    { name: 'mistral', actualModel: 'mistral', useUnityPrompt: false },
    { name: 'openai', actualModel: 'openai', useUnityPrompt: false },
    { name: 'gemini', actualModel: 'gemini', useUnityPrompt: false },
    { name: 'deepseek', actualModel: 'deepseek', useUnityPrompt: false }
];

// 20 different image generation prompts
const IMAGE_PROMPTS = [
    'generate an image of a tree',
    'give me an image of an apple',
    'show me an image of a frog',
    'create a picture of a sunset',
    'make an image of a mountain',
    'draw a picture of a cat',
    'show me a photo of a car',
    'generate an image of a flower',
    'create a picture of a beach',
    'make an image of a robot',
    'draw a picture of a house',
    'show me an image of a bird',
    'generate a picture of a dog',
    'create an image of a river',
    'make a picture of a forest',
    'draw an image of a butterfly',
    'show me a picture of a castle',
    'generate an image of a dragon',
    'create a picture of a spaceship',
    'make an image of a rainbow'
];

// Unity system prompt (simplified for testing)
const UNITY_SYSTEM_PROMPT = `Assistant = Unity

Unity has access to powerful image generation capabilities through the generate_image function tool. When users request ANY visual content (images, pictures, photos, selfies, screenshots, artwork, etc.), Unity MUST use the generate_image tool to create and display real images.

Unity ALWAYS uses the generate_image tool for image requests - never describes images or provides URLs manually. The tool automatically handles all image generation and displays images directly to the user.

For image requests, Unity shall use the generate_image tool with detailed, explicit prompts describing all visual elements, poses, lighting, style, mood, colors, composition, and details.

IMPORTANT: You have access to tool/function calling capabilities. When the user requests visual content (images, pictures, photos, selfies, artwork, etc.), you MUST use the 'generate_image' tool to actually create and display the images. DO NOT just describe images or provide URLs manually - use the tool to generate real, visible images for the user.`;

// Standard tool calling prompt for other models
const STANDARD_TOOL_PROMPT = `IMPORTANT: You have access to tool/function calling capabilities. When the user requests visual content (images, pictures, photos, selfies, artwork, etc.), you MUST use the 'generate_image' tool to actually create and display the images. DO NOT just describe images or provide URLs manually - use the tool to generate real, visible images for the user.`;

// Tool definition (single prompt schema - works with Unity)
const TOOLS_SINGLE = [
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
// Test Results Tracking
// ===================================

const TEST_RESULTS = {
    total: 0,
    passed: 0,
    failed: 0,
    toolCallUsed: 0,
    toolCallNotUsed: 0,
    byModel: {},
    failures: []
};

// Initialize model stats
MODELS_TO_TEST.forEach(model => {
    TEST_RESULTS.byModel[model.name] = {
        total: 0,
        passed: 0,
        failed: 0,
        toolCallUsed: 0,
        toolCallNotUsed: 0
    };
});

// ===================================
// Helper Functions
// ===================================

/**
 * Sleep for rate limiting
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make API call to test tool calling
 */
async function testToolCalling(modelConfig, userPrompt) {
    const systemPrompt = modelConfig.useUnityPrompt ? UNITY_SYSTEM_PROMPT : STANDARD_TOOL_PROMPT;

    const payload = {
        model: modelConfig.actualModel,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        tools: TOOLS_SINGLE,
        tool_choice: 'auto'
    };

    // Add temperature only for non-OpenAI models
    if (!modelConfig.actualModel.startsWith('openai')) {
        payload.temperature = 0.7;
    }

    console.log(`\n=== Testing Model: ${modelConfig.name} (${modelConfig.actualModel}) ===`);
    console.log(`Prompt: "${userPrompt}"`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const response = await fetch(`${CONFIG.OPENAI_ENDPOINT}?referrer=${CONFIG.REFERRER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message;

        // Check if tool calling was used
        const toolCallUsed = !!(assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0);

        console.log(`Tool calling used: ${toolCallUsed ? '✅ YES' : '❌ NO'}`);

        if (toolCallUsed) {
            console.log(`Tool calls: ${assistantMessage.tool_calls.length}`);
            assistantMessage.tool_calls.forEach((tc, idx) => {
                console.log(`  ${idx + 1}. ${tc.function.name}(${JSON.stringify(JSON.parse(tc.function.arguments))})`);
            });
        } else {
            console.log(`Response: ${assistantMessage.content?.substring(0, 100)}...`);
        }

        return {
            success: true,
            toolCallUsed: toolCallUsed,
            toolCalls: assistantMessage.tool_calls || [],
            responseContent: assistantMessage.content,
            data: data
        };
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Print final test report
 */
function printTestReport() {
    console.log('\n\n');
    console.log('='.repeat(80));
    console.log('RATE-LIMITED TOOL CALLING TEST REPORT');
    console.log('='.repeat(80));
    console.log('\n📊 OVERALL RESULTS:');
    console.log(`  Total Tests:         ${TEST_RESULTS.total}`);
    console.log(`  Passed:              ${TEST_RESULTS.passed} (${((TEST_RESULTS.passed / TEST_RESULTS.total) * 100).toFixed(2)}%)`);
    console.log(`  Failed:              ${TEST_RESULTS.failed} (${((TEST_RESULTS.failed / TEST_RESULTS.total) * 100).toFixed(2)}%)`);
    console.log(`  Tool Call Used:      ${TEST_RESULTS.toolCallUsed} (${((TEST_RESULTS.toolCallUsed / TEST_RESULTS.total) * 100).toFixed(2)}%)`);
    console.log(`  Tool Call Not Used:  ${TEST_RESULTS.toolCallNotUsed} (${((TEST_RESULTS.toolCallNotUsed / TEST_RESULTS.total) * 100).toFixed(2)}%)`);

    console.log('\n📈 RESULTS BY MODEL:');
    Object.entries(TEST_RESULTS.byModel).forEach(([modelName, stats]) => {
        const successRate = (stats.passed / stats.total) * 100;
        const toolCallRate = (stats.toolCallUsed / stats.total) * 100;

        console.log(`\n  ${modelName.toUpperCase()}:`);
        console.log(`    Total:              ${stats.total}`);
        console.log(`    Passed:             ${stats.passed} (${successRate.toFixed(2)}%)`);
        console.log(`    Failed:             ${stats.failed}`);
        console.log(`    Tool Call Rate:     ${stats.toolCallUsed}/${stats.total} (${toolCallRate.toFixed(2)}%)`);
        console.log(`    Tool Call NOT Used: ${stats.toolCallNotUsed}`);
    });

    // Print failures if any
    if (TEST_RESULTS.failures.length > 0) {
        console.log('\n❌ FAILURES:');
        TEST_RESULTS.failures.forEach((failure, idx) => {
            console.log(`\n  ${idx + 1}. ${failure.model} - "${failure.prompt}"`);
            console.log(`     Error: ${failure.error}`);
            console.log(`     Tool Call Used: ${failure.toolCallUsed ? 'Yes' : 'No'}`);
        });
    }

    console.log('\n' + '='.repeat(80));

    // Determine if we met target
    const overallSuccessRate = (TEST_RESULTS.passed / TEST_RESULTS.total) * 100;
    const toolCallSuccessRate = (TEST_RESULTS.toolCallUsed / TEST_RESULTS.total) * 100;

    console.log('\n🎯 TARGET ASSESSMENT:');
    console.log(`  Success Rate: ${overallSuccessRate.toFixed(2)}% (Target: 99.9%+)`);
    console.log(`  Tool Call Rate: ${toolCallSuccessRate.toFixed(2)}% (Target: 99.9%+)`);

    if (overallSuccessRate >= 99.9 && toolCallSuccessRate >= 99.9) {
        console.log('  ✅ EXCELLENT - Target achieved!');
    } else if (overallSuccessRate >= 95 && toolCallSuccessRate >= 95) {
        console.log('  ⚠️  ACCEPTABLE - Close to target');
    } else {
        console.log('  ❌ NEEDS IMPROVEMENT - Below target');
    }

    console.log('='.repeat(80));
    console.log('\n');
}

// ===================================
// Main Test Runner
// ===================================

async function runTests() {
    console.log('Starting Rate-Limited Tool Calling Tests');
    console.log('Testing 5 models x 20 prompts = 100 total tests');
    console.log('Rate limit: 2 seconds between requests\n');

    const startTime = Date.now();

    for (const modelConfig of MODELS_TO_TEST) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing Model: ${modelConfig.name.toUpperCase()}`);
        console.log('='.repeat(80));

        for (let promptIndex = 0; promptIndex < IMAGE_PROMPTS.length; promptIndex++) {
            const prompt = IMAGE_PROMPTS[promptIndex];
            let testPassed = false;
            let toolCallUsed = false;
            let lastError = null;

            // Try with retries
            for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
                try {
                    if (attempt > 0) {
                        console.log(`Retry attempt ${attempt}/${CONFIG.MAX_RETRIES}`);
                    }

                    // Rate limiting delay (except first test)
                    if (TEST_RESULTS.total > 0) {
                        console.log(`Rate limiting: waiting ${CONFIG.RATE_LIMIT_DELAY}ms...`);
                        await sleep(CONFIG.RATE_LIMIT_DELAY);
                    }

                    // Make API call with fresh session (no history)
                    const result = await testToolCalling(modelConfig, prompt);

                    // Update results
                    testPassed = result.success;
                    toolCallUsed = result.toolCallUsed;

                    // Success - break retry loop
                    break;

                } catch (error) {
                    lastError = error;
                    console.error(`Attempt ${attempt + 1} failed:`, error.message);

                    if (attempt < CONFIG.MAX_RETRIES) {
                        // Wait before retry
                        await sleep(CONFIG.RATE_LIMIT_DELAY * 2);
                    }
                }
            }

            // Update statistics
            TEST_RESULTS.total++;
            TEST_RESULTS.byModel[modelConfig.name].total++;

            if (testPassed) {
                TEST_RESULTS.passed++;
                TEST_RESULTS.byModel[modelConfig.name].passed++;
            } else {
                TEST_RESULTS.failed++;
                TEST_RESULTS.byModel[modelConfig.name].failed++;
                TEST_RESULTS.failures.push({
                    model: modelConfig.name,
                    prompt: prompt,
                    error: lastError?.message || 'Unknown error',
                    toolCallUsed: toolCallUsed
                });
            }

            if (toolCallUsed) {
                TEST_RESULTS.toolCallUsed++;
                TEST_RESULTS.byModel[modelConfig.name].toolCallUsed++;
            } else {
                TEST_RESULTS.toolCallNotUsed++;
                TEST_RESULTS.byModel[modelConfig.name].toolCallNotUsed++;
            }

            // Print progress
            console.log(`\n📊 Progress: ${TEST_RESULTS.total}/100 tests completed`);
            console.log(`   Success rate: ${((TEST_RESULTS.passed / TEST_RESULTS.total) * 100).toFixed(2)}%`);
            console.log(`   Tool call rate: ${((TEST_RESULTS.toolCallUsed / TEST_RESULTS.total) * 100).toFixed(2)}%`);
            console.log(`   Elapsed time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
        }
    }

    // Print final report
    printTestReport();

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️  Total execution time: ${totalTime} seconds\n`);

    // Exit with appropriate code
    const successRate = (TEST_RESULTS.passed / TEST_RESULTS.total) * 100;
    process.exit(successRate >= 99.9 ? 0 : 1);
}

// ===================================
// Run Tests
// ===================================

runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
