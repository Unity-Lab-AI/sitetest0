# Rate-Limited Tool Calling Test Suite

## Overview

This test suite validates image generation tool calling consistency across 5 AI models with **100 comprehensive tests** (20 per model):

- **Unity** (via Mistral with Unity persona)
- **Mistral**
- **OpenAI**
- **Gemini**
- **DeepSeek**

## Test Objectives

1. **Validate Tool Calling Reliability**: Ensure models consistently use the `generate_image` function when requested
2. **Test Rate Limiting**: Verify system handles 100 sequential requests with proper rate limiting
3. **Fresh Session Testing**: Each test uses a clean session (no conversation history) to ensure independence
4. **Target Success Rate**: Achieve 99.9%+ success rate for both API calls and tool calling usage

## Test Files

### 1. `tests/tool-calling-rate-limited.spec.js`
- **Playwright test suite**
- Integrates with existing test infrastructure
- Best for CI/CD environments

### 2. `standalone-tool-calling-test.js`
- **Standalone Node.js script**
- Can be run directly without test framework
- Provides detailed console output and progress tracking
- **Recommended for manual testing**

## Running the Tests

### Prerequisites

```bash
npm install
```

### Option 1: Standalone Script (Recommended)

```bash
# Direct execution
node standalone-tool-calling-test.js

# Or make it executable
chmod +x standalone-tool-calling-test.js
./standalone-tool-calling-test.js
```

**Output**: Detailed progress logs with real-time statistics and final comprehensive report.

### Option 2: Playwright Test Suite

```bash
# Run with Playwright
npx playwright test tests/tool-calling-rate-limited.spec.js --reporter=line

# Run with specific timeout
npx playwright test tests/tool-calling-rate-limited.spec.js --timeout=60000

# Run with single worker (sequential)
npx playwright test tests/tool-calling-rate-limited.spec.js --workers=1
```

## Test Configuration

### Rate Limiting

- **Delay Between Tests**: 2 seconds (2000ms)
- **Retry Logic**: Up to 2 retries per failed test
- **Timeout Per Test**: 60 seconds

### Models Tested

```javascript
const MODELS_TO_TEST = [
    { name: 'unity', actualModel: 'mistral', useUnityPrompt: true },
    { name: 'mistral', actualModel: 'mistral', useUnityPrompt: false },
    { name: 'openai', actualModel: 'openai', useUnityPrompt: false },
    { name: 'gemini', actualModel: 'gemini', useUnityPrompt: false },
    { name: 'deepseek', actualModel: 'deepseek', useUnityPrompt: false }
];
```

### Test Prompts (20 variations)

```javascript
const IMAGE_PROMPTS = [
    'generate an image of a tree',
    'give me an image of an apple',
    'show me an image of a frog',
    'create a picture of a sunset',
    'make an image of a mountain',
    // ... 15 more variations
];
```

## Understanding Test Results

### Success Criteria

✅ **EXCELLENT (Target Met)**:
- Overall Success Rate: ≥ 99.9%
- Tool Call Usage Rate: ≥ 99.9%

⚠️ **ACCEPTABLE (Close to Target)**:
- Overall Success Rate: ≥ 95%
- Tool Call Usage Rate: ≥ 95%

❌ **NEEDS IMPROVEMENT**:
- Below 95% on either metric

### Sample Report Output

```
================================================================================
RATE-LIMITED TOOL CALLING TEST REPORT
================================================================================

📊 OVERALL RESULTS:
  Total Tests:         100
  Passed:              99 (99.00%)
  Failed:              1 (1.00%)
  Tool Call Used:      99 (99.00%)
  Tool Call Not Used:  1 (1.00%)

📈 RESULTS BY MODEL:

  UNITY:
    Total:              20
    Passed:             20 (100.00%)
    Failed:             0
    Tool Call Rate:     20/20 (100.00%)
    Tool Call NOT Used: 0

  MISTRAL:
    Total:              20
    Passed:             20 (100.00%)
    Failed:             0
    Tool Call Rate:     20/20 (100.00%)
    Tool Call NOT Used: 0

  [... continues for all models ...]

================================================================================

🎯 TARGET ASSESSMENT:
  Success Rate: 99.00% (Target: 99.9%+)
  Tool Call Rate: 99.00% (Target: 99.9%+)
  ⚠️  ACCEPTABLE - Close to target
================================================================================
```

## What's Being Tested

### 1. Tool Calling Detection

Each test verifies that when a user requests an image:
```
User: "generate an image of a tree"
```

The model responds with a **tool call** instead of just text:
```json
{
  "tool_calls": [{
    "function": {
      "name": "generate_image",
      "arguments": {
        "prompt": "A detailed image of a tree...",
        "width": 1024,
        "height": 1024,
        "model": "flux"
      }
    }
  }]
}
```

### 2. Fresh Session Isolation

- Each test starts with a **clean conversation history**
- No context bleeding between tests
- Ensures consistent behavior regardless of previous interactions

### 3. Rate Limiting Compliance

- 2-second delays between requests
- Prevents API throttling
- Validates system behavior under sustained load

### 4. Retry Logic

- Automatic retry on transient failures
- Up to 2 retries per test
- Distinguishes between permanent failures and temporary issues

## Troubleshooting

### Network Errors

If you see `fetch failed` or `EAI_AGAIN` errors:
- Check internet connectivity
- Verify firewall/proxy settings
- Ensure `text.pollinations.ai` is accessible

### API Errors

If you see API error responses:
- Check API endpoint availability
- Verify referrer parameter is correct
- Review rate limiting (may need to increase delays)

### Tool Calling Not Used

If tests pass but tool calling shows 0%:
- Review system prompts (may need strengthening)
- Check model compatibility
- Verify tool schema is correct for the model

## Expected Runtime

- **Total Tests**: 100
- **Rate Limit**: 2 seconds between tests
- **Average Test Duration**: ~4-6 seconds (including retries)
- **Estimated Total Time**: ~8-10 minutes

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Tool Calling Tests

on: [push, pull_request]

jobs:
  test-tool-calling:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node standalone-tool-calling-test.js
```

## Modifying Tests

### Adding More Models

Edit the `MODELS_TO_TEST` array:
```javascript
MODELS_TO_TEST.push({
    name: 'new-model',
    actualModel: 'new-model',
    useUnityPrompt: false
});
```

### Adding More Prompts

Edit the `IMAGE_PROMPTS` array:
```javascript
IMAGE_PROMPTS.push('create an image of a dolphin');
```

### Adjusting Rate Limits

Edit `CONFIG`:
```javascript
const CONFIG = {
    RATE_LIMIT_DELAY: 3000, // 3 seconds
    MAX_RETRIES: 3,  // 3 retries
    TIMEOUT: 90000   // 90 second timeout
};
```

## Success Indicators

When the tests complete successfully, you should see:

1. ✅ **100/100 tests completed**
2. ✅ **Tool calling used in 99%+ of tests**
3. ✅ **Success rate of 99%+ overall**
4. ✅ **Consistent performance across all models**

## Failure Analysis

If tests fail:

1. **Check the failure report** - Lists specific models and prompts that failed
2. **Review error messages** - Network vs API vs tool calling issues
3. **Examine per-model statistics** - Identify problematic models
4. **Verify tool call usage** - Ensure models are actually using the function

## Next Steps

After running these tests:

1. **Review Results**: Analyze success rates and tool calling consistency
2. **Identify Issues**: Focus on models with <99% success rates
3. **Tune Prompts**: Adjust system prompts if tool calling rate is low
4. **Report Findings**: Document any inconsistencies or patterns
5. **Iterate**: Re-run tests after making changes

## Support

For issues or questions:
- Check existing test results in `standalone-test-results.log`
- Review API documentation at Pollinations.AI
- Examine tool definition schemas
- Test individual models manually using `unity_testing.js`

---

**Last Updated**: 2025-11-21
**Version**: 1.0.0
**Test Count**: 100 (5 models × 20 prompts)
**Target Success Rate**: 99.9%+
