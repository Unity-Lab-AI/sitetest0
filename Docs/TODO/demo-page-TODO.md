# /demo Page - Demo AI Chat App TODO

> **Status:** ❌ **NOT STARTED** (0%)
> Lightweight demo chat interface showcasing PolliLib capabilities

---

## Overview

The `/demo` page will be a lightweight, self-contained demonstration of the PolliLib libraries' capabilities. This is a **public-facing demo** meant to showcase features without requiring user accounts or complex setup.

**Target URL:** `https://unity-lab-ai.github.io/sitetest0/demo`

**Scope:**
- Simple chat interface using PolliLibJS
- Text-to-text generation
- Text-to-image generation
- Voice features (TTS/STT)
- Model selection
- Basic chat history
- No backend required (client-side only)

---

## Core Chat Interface

### P1 Input & Output
- [ ] Text input box
  - [ ] Multi-line textarea support
  - [ ] Auto-resize as user types
  - [ ] Character/token counter
  - [ ] Placeholder text hints
- [ ] Send button
  - [ ] Clickable button
  - [ ] Disabled when input is empty
  - [ ] Loading state during API calls
  - [ ] Keyboard shortcut indicator
- [ ] Enter key submits message
  - [ ] Enter = send
  - [ ] Shift+Enter = newline
  - [ ] Clear input after sending
- [ ] User messages on the right
  - [ ] Right-aligned bubbles
  - [ ] User avatar/icon
  - [ ] Timestamp display
- [ ] AI messages on the left
  - [ ] Left-aligned bubbles
  - [ ] AI avatar/icon
  - [ ] Timestamp display
  - [ ] Loading indicator during generation
- [ ] Chat bubble styling
  - [ ] Rounded corners
  - [ ] Shadow effects
  - [ ] Color differentiation (user vs AI)
  - [ ] Responsive sizing

---

## Voice Features

### P1 Speech Integration
- [ ] Voice recognition toggle
  - [ ] Microphone button
  - [ ] Browser speech recognition API
  - [ ] Recording indicator
  - [ ] Fallback for unsupported browsers
  - [ ] Permission handling
- [ ] Voice-to-voice toggle
  - [ ] Enable TTS for AI responses
  - [ ] Auto-play option
  - [ ] Speaker icon indicator
  - [ ] Volume control
  - [ ] Voice selection (6 available voices)

---

## Image Generation

### P1 Image Panel
- [ ] Separate image display panel
  - [ ] Dedicated section for generated images
  - [ ] Grid layout for multiple images
  - [ ] Thumbnail preview
  - [ ] Full-size view on click
  - [ ] Loading placeholder during generation
- [ ] Image actions
  - [ ] Save image button
  - [ ] Copy image to clipboard
  - [ ] Re-generate with new seed
  - [ ] Open image in new tab
  - [ ] Share image link
  - [ ] Delete from current session

---

## Message Actions

### P1 Text Actions
- [ ] Copy text button
  - [ ] Copy to clipboard
  - [ ] Visual confirmation
  - [ ] Markdown preserved
- [ ] Edit text inline
  - [ ] Edit user messages
  - [ ] Re-submit edited message
  - [ ] Indicate edited messages
- [ ] Regenerate response
  - [ ] Request new AI response
  - [ ] Keep original in history
  - [ ] Option to replace or append

---

## Controls & Settings

### P0 Generation Controls
- [ ] Stop generation button
  - [ ] Cancel in-progress requests
  - [ ] Visible during generation
  - [ ] Graceful cleanup
- [ ] Reset demo button
  - [ ] Clear all chat history
  - [ ] Confirmation dialog
  - [ ] Reset to default settings
  - [ ] Clear local storage

### P1 Model Selector
- [ ] Model drop-down
  - [ ] List available text models
  - [ ] Show model descriptions
  - [ ] Indicate current selection
  - [ ] Switch models mid-conversation
  - [ ] Default to openai

---

## Display & Formatting

### P1 Rich Text Support
- [ ] Markdown rendering
  - [ ] Headers (H1-H6)
  - [ ] Bold, italic, strikethrough
  - [ ] Lists (ordered, unordered)
  - [ ] Blockquotes
  - [ ] Links (clickable)
  - [ ] Images in markdown
- [ ] Code block highlighting
  - [ ] Syntax highlighting
  - [ ] Copy code button
  - [ ] Language detection
  - [ ] Line numbers
  - [ ] Multiple language support (JavaScript, Python, etc.)

---

## Usage Metrics

### P1 Display Stats
- [ ] Token usage display
  - [ ] Input tokens
  - [ ] Output tokens
  - [ ] Total per message
  - [ ] Session total
- [ ] Latency display
  - [ ] Request time
  - [ ] Generation time
  - [ ] Total response time
  - [ ] Average across session

---

## Chat History

### P1 Local Storage
- [ ] Save chat history locally
  - [ ] Browser localStorage
  - [ ] Persist across page reloads
  - [ ] Expire after 7 days
  - [ ] Privacy notice
- [ ] Max history transmitted
  - [ ] Limit context sent to API
  - [ ] Configurable (e.g., last 10 messages)
  - [ ] Indicate truncation to user
- [ ] Automatic context compression
  - [ ] Summarize old messages
  - [ ] Keep recent messages full
  - [ ] Smart truncation algorithm

---

## User Experience

### P1 Accessibility & Polish
- [ ] Loading indicators
  - [ ] Spinner during API calls
  - [ ] Progress for long operations
  - [ ] Skeleton screens
- [ ] Error handling
  - [ ] Display API errors gracefully
  - [ ] Retry failed requests
  - [ ] User-friendly error messages
  - [ ] Network error detection
- [ ] Auto-scroll to latest message
  - [ ] Scroll to bottom on new message
  - [ ] Stay at scroll position when reading history
  - [ ] Scroll-to-bottom button when not at bottom
- [ ] Responsive design
  - [ ] Mobile-friendly layout
  - [ ] Touch-friendly buttons
  - [ ] Landscape/portrait support
  - [ ] Tablet optimization

---

## Safety & Moderation

### P1 Content Filtering
- [ ] Safe mode toggle
  - [ ] Enable/disable NSFW filtering
  - [ ] Default to safe mode ON
  - [ ] Warning when disabling
  - [ ] Remember preference
- [ ] Content warnings
  - [ ] Warn before generating potentially sensitive content
  - [ ] Blur sensitive images
  - [ ] Click-to-reveal
  - [ ] Age gate (if needed)

---

## Technical Implementation

### File Structure
```
demo/
├── index.html           # Main demo page
├── demo.css            # Demo-specific styles
├── demo.js             # Demo app logic
└── README.md           # Demo documentation
```

### Dependencies
- [ ] PolliLibJS (from ../PolliLibJS/)
- [ ] Markdown parser (marked.js or similar)
- [ ] Syntax highlighter (highlight.js or similar)
- [ ] Bootstrap 5 (for layout)
- [ ] Font Awesome (for icons)

---

## Integration Points

### P0 PolliLibJS Integration
- [ ] Import text-to-text module
- [ ] Import text-to-image module
- [ ] Import text-to-speech module
- [ ] Import speech-to-text module
- [ ] Configure API client with default referrer

---

## Open Questions

- [ ] Should demo have model temperature controls?
- [ ] Should demo show "thinking" process for reasoning models?
- [ ] Should demo include image-to-text (vision) features?
- [ ] Should demo support conversation export (JSON, markdown)?
- [ ] Should demo have example prompts/templates?
- [ ] Rate limiting strategy (client-side throttling)?

---

## Future Enhancements (P2)

- [ ] Conversation templates
- [ ] Example prompt library
- [ ] Export chat history (JSON, PDF)
- [ ] Share conversation via URL
- [ ] Keyboard shortcuts reference
- [ ] Dark/light theme toggle
- [ ] Conversation search
- [ ] Message reactions/ratings
- [ ] Multi-model comparison mode
- [ ] Streaming text display (typewriter effect)

---

## Priority Breakdown

**P0 (MVP - Minimum Viable Demo):**
- Basic text chat interface
- Send/receive messages
- Model selector
- Stop generation
- Reset demo
- Markdown rendering
- Code highlighting

**P1 (Full Demo Experience):**
- All voice features
- Image generation & actions
- Text actions
- Usage metrics
- Chat history
- Responsive design

**P2 (Nice to Have):**
- Templates & examples
- Export/share features
- Advanced customization

---

## Related Documentation

- **Master TODO:** [TODO.md](TODO.md)
- **PolliLibJS:** [PolliLibJS/TODO.md](PolliLibJS/TODO.md)
- **Main App TODO:** [main-app-TODO.md](main-app-TODO.md)

---

**Status:** ❌ Not started - awaiting prioritization
**Estimated Effort:** 40-60 hours
**Target Completion:** TBD
**Last Updated:** 2025-11-18
