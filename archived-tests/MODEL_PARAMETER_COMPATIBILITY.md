# Model Parameter Compatibility Matrix

This document tracks which parameters each Pollinations AI model supports.

## Purpose

Different models have different parameter requirements and restrictions. This matrix helps identify:
- Which parameters cause 400 errors with specific models
- Optimal parameter configurations for each model
- Differences between working (unity_testing.html) and non-working (demo page) implementations

## Known Issues

### OpenAI Models

**Issue**: Temperature parameter incompatibility
```
Error: azure-openai error: Unsupported value: 'temperature' does not support 0.7 with this model.
Only the default (1) value is supported.
```

**Models Affected**:
- `openai` (GPT-5 Nano)
- `openai-fast` (GPT-4.1 Nano)
- Possibly `openai-audio` and `openai-reasoning`

**Solution**:
- Either omit `temperature` parameter entirely (uses default 1)
- OR explicitly set `temperature: 1`
- Do NOT use custom temperature values like 0.7, 0.5, etc.

### Unity Model Image Generation

**Issue**: Unity model says it cannot generate images when using demo page, but works in unity_testing.html

**Potential Causes**:
1. **Tool Schema Difference**:
   - Demo page uses: `images` array schema (multiple images per call)
   - Unity testing uses: Single `prompt` schema (one image per call)

2. **System Prompt Difference**:
   - Demo page: Unity persona + tool calling addon
   - Unity testing: Unity persona from file + tool calling addon

3. **Parameter Differences**: To be investigated

**Testing Required**: Use `model_parameter_test.html` to identify exact cause

## Testing Procedure

### Using the Test Page

1. Open `model_parameter_test.html` in your browser
2. Configure test parameters:
   - Select model
   - Choose temperature setting
   - Select system prompt type
   - Choose tool schema (Array vs Single)
3. Click "Run Test" for single test or "Test All Models" for comprehensive testing

### Test Scenarios to Run

#### Scenario 1: Temperature Testing (OpenAI models)
- Model: `openai`
- Temperature: Try `none`, `1`, `0.7`
- Document which values work

#### Scenario 2: Unity Image Generation
Test both schemas:
1. **Array Schema** (current demo page):
   - Model: `unity` (uses mistral)
   - Use Array Schema: ✓
   - System Prompt: Unity Full Persona
   - Message: "Generate an image of a robot"

2. **Single Schema** (unity testing):
   - Model: `unity` (uses mistral)
   - Use Single Schema: ✓
   - System Prompt: Unity Full Persona
   - Message: "Generate an image of a robot"

#### Scenario 3: All Models Baseline
- Click "Test All Models" with default settings
- Document which models succeed/fail
- Note any error messages

## Parameter Compatibility Matrix

| Model | Temperature | Max Tokens | Tools | Tool Choice | Notes |
|-------|-------------|------------|-------|-------------|-------|
| mistral | ✓ 0.7 | ✓ All | ✓ | ✓ auto | Fully compatible |
| unity (mistral) | ? | ? | ? | ? | **TESTING REQUIRED** |
| openai | ❌ 0.7, ✓ 1 or omit | ✓ All | ✓ | ✓ auto | Temperature restricted to default (1) |
| openai-fast | ❌ 0.7, ✓ 1 or omit | ✓ All | ✓ | ✓ auto | Temperature restricted to default (1) |
| openai-audio | ? | ? | ✓ | ? | **TESTING REQUIRED** |
| openai-reasoning | ? | ? | ✓ | ? | **TESTING REQUIRED** |
| gemini | ? | ? | ✓ | ? | **TESTING REQUIRED** |
| deepseek | ✓ 0.7 | ✓ All | ✓ | ✓ auto | **TESTING REQUIRED** |
| qwen-coder | ? | ? | ✓ | ? | **TESTING REQUIRED** |

**Legend**:
- ✓ = Supported
- ❌ = Not supported / causes error
- ? = Unknown, testing required

## Tool Schema Comparison

### Array Schema (Demo Page)
```json
{
  "name": "generate_image",
  "parameters": {
    "type": "object",
    "properties": {
      "images": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "prompt": { "type": "string" },
            "width": { "type": "integer" },
            "height": { "type": "integer" },
            "model": { "type": "string" }
          }
        }
      }
    }
  }
}
```

**Pros**: Can generate multiple images in one call
**Cons**: May be more complex for AI to use correctly

### Single Schema (Unity Testing)
```json
{
  "name": "generate_image",
  "parameters": {
    "type": "object",
    "properties": {
      "prompt": { "type": "string" },
      "width": { "type": "integer" },
      "height": { "type": "integer" },
      "model": { "type": "string" }
    }
  }
}
```

**Pros**: Simpler, proven to work with Unity testing
**Cons**: Can only generate one image per call

## Recommended Fixes

### Fix 1: Conditional Temperature for OpenAI Models

```javascript
// Get current model metadata
const modelName = this.settings.model;
const isOpenAI = modelName.startsWith('openai');

// Build payload
const payload = {
    model: actualModel,
    messages: [...],
    max_tokens: 4000,
    tools: TOOLS,
    tool_choice: 'auto'
};

// Only add temperature for non-OpenAI models
if (!isOpenAI) {
    payload.temperature = this.settings.textTemperature;
}
// OpenAI models will use their default (1)
```

### Fix 2: Unity Tool Schema Fix

Option A: Use single schema for Unity model
```javascript
// Use different tool schema for Unity
const tools = (this.settings.model === 'unity') ? TOOLS_SINGLE_SCHEMA : TOOLS_ARRAY_SCHEMA;

payload.tools = tools;
```

Option B: Improve system prompt to guide AI better
```javascript
// Add explicit instruction for tool usage
const UNITY_TOOL_ADDON = `

CRITICAL: When user requests images, you MUST call the generate_image function with this exact format:
{
  "images": [
    {
      "prompt": "detailed description",
      "width": 1024,
      "height": 1024,
      "model": "flux"
    }
  ]
}
`;
```

## Next Steps

1. ✅ Create test page (`model_parameter_test.html`)
2. ⏳ Run comprehensive tests on all models
3. ⏳ Document findings in this file
4. ⏳ Implement fixes in demo page
5. ⏳ Verify all models work correctly
6. ⏳ Update demo page documentation

## Test Results Log

### Test Session: [DATE]

**Tester**: [NAME]
**Browser**: [BROWSER]

#### Test 1: [Model Name]
- Configuration: [parameters]
- Result: ✅ Success / ❌ Failed
- Notes: [observations]
- Tool Calls Detected: Yes/No
- Image Generated: Yes/No

[Add more test results here as you run tests]

---

**Last Updated**: 2025-11-21
**Status**: Initial documentation, testing in progress
