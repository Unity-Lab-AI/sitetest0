# Demo Page Parameters Analysis
## Pollinations API vs Current Implementation

### Summary
After reviewing the official Pollinations API documentation and the current demo page implementation, here's what parameters are available and what we're currently exposing.

---

## Text Generation API

### Currently Exposed in Demo:
- ✅ **temperature** (0.7 default) - Range slider 0-2, step 0.1
- ✅ **max_tokens** (2048 default) - Input field 1-8192
- ⚠️ **top_p** (0.9 default) - Range slider 0-1, step 0.05 - **NOT IN API DOCS**

### Available in API but NOT Exposed:
- ❌ **system** - System prompt/instructions for AI behavior (string)
- ❌ **json** - Force JSON response format (boolean)
- ❌ **stream** - Real-time streaming response (boolean)
- ❌ **reasoning_effort** - Control thinking depth (minimal/low/medium/high)

### Notes:
- **top_p** is in the demo but NOT documented in Pollinations API docs - might not work!
- Simple GET API supports: model, seed, temperature, system, json, stream
- Advanced POST API supports: temperature, max_tokens, stream, reasoning_effort, tools

---

## Image Generation API

### Currently Exposed in Demo:
- ✅ **model** (flux default) - Dropdown select
- ✅ **width** (1024 default) - Input field 256-2048, step 64
- ✅ **height** (1024 default) - Input field 256-2048, step 64
- ✅ **enhance** (false default) - Toggle switch

### Available in API but NOT Exposed:
- ❌ **nologo** - Remove Pollinations watermark (boolean, requires account)
- ❌ **private** - Hide image from public feeds (boolean)
- ❌ **safe** - Enable strict NSFW filtering (boolean)

### Notes:
- All currently exposed parameters are correctly documented in API
- **nologo** requires paid account tier
- **private** and **safe** are useful options we could add

---

## Audio/Voice (TTS) API

### Currently Exposed in Demo:
- ✅ **voice** (alloy default) - Dropdown with 6 voices
- ⚠️ **speed** (1.0 default) - Range slider 0.25-4.0, step 0.25 - **NOT IN API DOCS**
- ✅ **volume** (50 default) - Local browser control, not API parameter

### Available Voices:
- alloy - Neutral, professional
- echo - Deep, resonant
- fable - Storyteller vibe
- onyx - Warm, rich
- nova - Bright, friendly
- shimmer - Soft, melodic

### Notes:
- **speed** parameter is NOT documented in Pollinations API docs for simple TTS
- Might still work as an undocumented parameter, needs testing
- Voice volume is browser-side audio control only

---

## General Settings

### Currently Exposed:
- ✅ **seed** (-1 for random) - Works for both text and image generation

---

## Recommendations

### High Priority - Add These (Documented & Useful):
1. **system** (text) - Allow users to set AI personality/behavior
2. **safe** (image) - Add NSFW filtering toggle for image generation
3. **reasoning_effort** (text) - Let users control thinking depth (minimal/low/medium/high)

### Medium Priority - Consider Adding:
4. **stream** (text) - Enable real-time response streaming
5. **private** (image) - Hide images from public feeds
6. **json** (text) - Force JSON output mode

### Low Priority - Requires Account:
7. **nologo** (image) - Remove watermark (needs paid tier)

### Should Remove or Verify:
- ⚠️ **top_p** - Not in API docs, may not work
- ⚠️ **voiceSpeed** - Not in API docs for simple TTS, may not work

---

## Parameter Support Matrix

| Parameter | Text API | Image API | Audio API | Currently Exposed | Working? |
|-----------|----------|-----------|-----------|-------------------|----------|
| model | ✅ | ✅ | ✅ | ✅ | ✅ |
| seed | ✅ | ✅ | - | ✅ | ✅ |
| temperature | ✅ | - | - | ✅ | ✅ |
| max_tokens | ✅ | - | - | ✅ | ✅ |
| top_p | ❓ | - | - | ✅ | ❓ Unknown |
| system | ✅ | - | - | ❌ | - |
| json | ✅ | - | - | ❌ | - |
| stream | ✅ | - | - | ❌ | - |
| reasoning_effort | ✅ | - | - | ❌ | - |
| width | - | ✅ | - | ✅ | ✅ |
| height | - | ✅ | - | ✅ | ✅ |
| enhance | - | ✅ | - | ✅ | ✅ |
| nologo | - | ✅ | - | ❌ | - |
| private | - | ✅ | - | ❌ | - |
| safe | - | ✅ | - | ❌ | - |
| voice | - | - | ✅ | ✅ | ✅ |
| speed | - | - | ❓ | ✅ | ❓ Unknown |

---

## Current Demo Settings Object

```javascript
settings: {
    model: 'unity',           // ✅ Working
    voice: 'alloy',           // ✅ Working
    voicePlayback: false,     // ✅ Local control
    voiceVolume: 50,          // ✅ Local control
    imageModel: 'flux',       // ✅ Working
    seed: -1,                 // ✅ Working
    textTemperature: 0.7,     // ✅ Working
    textMaxTokens: 2048,      // ✅ Working
    textTopP: 0.9,            // ❓ NOT IN API DOCS
    imageWidth: 1024,         // ✅ Working
    imageHeight: 1024,        // ✅ Working
    imageEnhance: false,      // ✅ Working
    voiceSpeed: 1.0           // ❓ NOT IN API DOCS
}
```

---

## Testing Recommendations

1. **Test top_p parameter** - Make a text request with top_p and verify if it has any effect
2. **Test voiceSpeed parameter** - Generate TTS with different speeds and verify if it works
3. **If they don't work, remove from UI** - Don't confuse users with non-functional settings

---

## API Endpoint Structure

### Text Generation (Simple):
```
GET https://text.pollinations.ai/{prompt}?model={model}&seed={seed}&temperature={temp}&system={system}&json={bool}&stream={bool}
```

### Text Generation (Advanced):
```
POST https://text.pollinations.ai/openai
{
  "model": "openai",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false,
  "reasoning_effort": "medium"
}
```

### Image Generation:
```
GET https://image.pollinations.ai/prompt/{prompt}?model={model}&width={w}&height={h}&seed={seed}&enhance={bool}&nologo={bool}&private={bool}&safe={bool}
```

### Audio/TTS (Simple):
```
GET https://text.pollinations.ai/{text}?model=openai-audio&voice={voice}
```

---

Generated: 2025-11-20
