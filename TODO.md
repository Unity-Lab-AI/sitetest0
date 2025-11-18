# TODO List

> Single source of truth for near-term work. Keep items atomic, prefer verbs, and track owners/dates when known.

---

## Project Vision & Goals

**Overview:**
This project is a comprehensive AI-powered website showcasing the Pollinations API through a landing page, demo environment, and full-featured chat application.

**Key Components:**

1. **Landing Page (index.html)** - ~90% complete
   - Professional showcase of UnityAILab
   - Navigation to Demo and AI pages
   - Clean links to in-repo projects only (no external project links)
   - Responsive design across all devices
   - External links ONLY for libraries, services, and platforms

2. **Demo Page (/demo)** - Not yet implemented
   - Showcase 50-75% of Pollinations API functionality
   - Simple, focused demo environment
   - Text-to-Text, Text-to-Image, TTS, STT, Image-to-Text
   - Minimal UI for testing features
   - Links to full /ai app for complete experience

3. **AI Chat App (/ai)** - Not yet implemented
   - Full-featured chat app (like ChatGPT, Gemini, DeepSeek)
   - 100% Pollinations API coverage
   - Advanced features: sessions, folders, agents, memory
   - Custom features: live voice chat, page control, system connector (future)
   - Professional layout with sidebar navigation

**Architecture:**
- **PolliLibPy**: Python reference implementation (direct from Pollinations docs)
- **PolliLibJS**: JavaScript browser-based version (mirrors Python functionality)
- **Development Flow**: Python files as reference, JavaScript for serverless browser execution

**Standards:**
- **Responsiveness**: Seamless experience from extra small to extra large screens
- **Cross-Browser**: Works across Chrome, Firefox, Safari, Edge with proper fallbacks
- **Accessibility**: WCAG AA compliance, keyboard navigation, screen reader support
- **Performance**: Optimized loading, minimal layout shifts, responsive images

**Link Policy:**
- In-repo projects: Link freely (pages in this repo)
- External projects: Do NOT link to other projects (like unity.unityailab.com, CodeWringer)
- External services: OK to link (libraries, platforms, Discord, GitHub org, npm packages, CDNs)

**Current Priorities:**
1. Update landing page navigation (add Demo and AI links)
2. Clean up external project links on landing page
3. Plan and structure /demo page
4. Plan and structure /ai page
5. Establish and implement responsiveness standards
6. Ensure cross-browser compatibility

---

## Conventions
- [ ] Use `- [ ]` for open, `- [x]` for done.
- [ ] Prefix priority: **P0** (urgent), **P1** (next), **P2** (nice-to-have).
- [ ] Every task should start with a verb.
- [ ] Add an **Owner** and optional **Due** date where helpful.
- [ ] Keep headings stable; move items rather than renaming sections.
- [ ] Group related subtasks under a parent task.
- [ ] Keep scope small; split big tasks.

---

## Library Features (Python & JavaScript)

**Architecture Overview:**
- **PolliLibPy**: Direct copies from Pollinations documentation (Python reference implementation)
- **PolliLibJS**: JavaScript versions of Python files, designed to run serverless in the browser
- **Development Flow**: Python files serve as reference; JavaScript implementations mirror Python functionality for browser use

**Legend:**
- ✓ = Complete in both Python (PolliLibPy) and JavaScript (PolliLibJS)
- Items marked [x] with ✓ are fully implemented in BOTH languages
- Items marked [ ] may be complete in Python only, or not yet implemented

**Status Summary:**
- ✅ Complete in Both: Model Retrieval, Text-to-Image, Text-to-Text, TTS, STT, Image-to-Text, Image-to-Image, Function Calling, Streaming Mode, Seed-Based Generation, Exponential Backoff, Safety Filtering, Reasoning Controls
- 🔴 Not Implemented: None

- [x] P1 **Model Retrieval** ✓ Complete in Python & JavaScript
  - [x] List text models
    - [x] Return normalized model schema
    - [x] Include name and description
    - [x] Include max input tokens
    - [x] Include reasoning capability flag
    - [x] Include tier
    - [x] Include community supported flag
    - [x] Include input types array
    - [x] Include output types array
    - [x] Include tool use / function calling flag
    - [x] Include aliases array
    - [x] Include vision flag
    - [x] Include audio flag
    - [x] Include voices array
    - [x] Include system messages supported flag
    - [x] Include uncensored flag
  - [x] List image models
    - [x] Include style tags
    - [x] Include input/output limits
    - [x] Include supported formats

- [x] P1 **Text-to-Image Generation** ✓ Complete in Python & JavaScript
  - [x] Generate images across all supported models
  - [x] Provide N variants with same prompt
  - [x] Add seed support for determinism
  - [x] Apply safety filters on prompts
  - [x] Report blocked content clearly
  - [x] Support image size selection
  - [x] Support PNG and JPEG export
  - [x] Expose inference time in logs

- [x] P1 **Text-to-Text Generation** ✓ Complete in Python & JavaScript
  - [x] Single-turn completion with temperature control
  - [x] Multi-turn conversation with stored state
  - [x] Thread retrieval by conversation ID
  - [x] Apply input and output safety checks
  - [x] Redact sensitive strings in logs
  - [x] Add stop sequence configuration
  - [x] Add system prompt support where allowed
  - [x] Add top-k and top-p controls

- [x] P1 **Text-to-Speech (TTS)** ✓ Complete in Python & JavaScript
  - [x] Generate speech with selectable voices
  - [x] Support sample rate selection
  - [x] Provide streaming playback option
  - [x] Add voice cloning flag gating
  - [x] Export to WAV and MP3
  - [x] Loudness normalization pass

- [x] P1 **Speech-to-Text (STT)** ✓ Complete in Python & JavaScript
  - [x] Transcribe with word-level timestamps
  - [x] Add punctuation restoration
  - [x] Enable diarization when supported
  - [x] Export to JSON and SRT
  - [x] Add noise reduction preprocessor

- [x] P1 **Image-to-Text** ✓ Complete in Python & JavaScript
  - [x] Generate image caption
  - [x] Extract object list
  - [x] Provide region descriptions
  - [x] Expose bounding boxes when available
  - [x] Add OCR fallback for text regions

- [x] P1 **Image-to-Image** ✓ Complete in Python & JavaScript
  - [x] Support img2img pipeline
  - [x] Guided generation with text prompt
  - [x] Inpainting with mask input
  - [x] Outpainting with expand canvas
  - [x] Text overlay with styling controls
  - [x] Meme template mode
  - [x] Preserve EXIF unless opted out

- [x] P0 **Safety Filtering** ✓ Complete in Python & JavaScript
  - [x] Implement safe parameter for text-to-text
  - [x] Implement safe parameter for text-to-image
  - [x] Apply safety filters on prompts
  - [x] Report blocked content clearly
  - [x] Enable strict NSFW filtering when requested

- [x] P1 **Reasoning Controls** ✓ Complete in Python & JavaScript
  - [x] Expose reasoning_effort parameter
  - [x] Support reasoning depth presets (minimal, low, medium, high)
  - [x] Pass reasoning controls to API endpoint
  - [x] Document compatible models and usage

- [x] P1 **Seed-Based Generation** ✓ Complete in Python & JavaScript
  - [x] Deterministic generation with fixed seed
  - [x] Document cross-platform seed caveats
  - [x] Provide randomness source selection
  - [x] Compare variance across seeds
  - [x] Log seed values with outputs

- [x] P0 **Function Calling / Tool Use** ✓ Complete in Python & JavaScript
  - [x] Implement function schema validation
  - [x] Add math functions (add, subtract)
  - [x] Add deterministic RNG function
  - [x] Add basic equation evaluator
  - [x] Add web value extractor stub
  - [x] Add normalization utilities
  - [x] Build filesystem/network stubs for CI
  - [x] Provide sandboxed execution layer

- [x] P0 **Streaming Mode (SSE)** ✓ Complete in Python & JavaScript
  - [x] Token streaming for text responses
  - [x] Progress events for image/audio
  - [x] Heartbeat messages during idle
  - [x] Retry guidance in headers
  - [x] Client cancel support

- [x] P0 **Exponential Backoff for Retries** ✓ Complete in Python & JavaScript
  - [x] Add jittered backoff strategy
  - [x] Respect Retry-After headers
  - [x] Configure max attempts
  - [x] Support idempotency keys
  - [x] Tag retried requests in logs

---

## Additional Testing / Features

**Status Summary:**
- ✅ Complete in Both: Binary Data Handling, Sample Corpus, Fuzzing, Chaos Testing, Cold Start Simulation, Memory Validation
- 🔴 Not Implemented: None

- [x] P2 **Separate image data from text caches** ✓ Complete in Python & JavaScript
  - [x] Implemented in `test_utils.py` (Python) and `test-utils.js` (JavaScript)
  - [x] BinaryDataHandler class separates binary data from text
  - [x] Maintains separate binary store with references
  - [x] Supports recursive object traversal

- [x] P2 **Exclude binary blobs from text logs** ✓ Complete in Python & JavaScript
  - [x] Binary data sanitization for logging
  - [x] Replaces binary with metadata and preview
  - [x] Configurable preview length
  - [x] Safe for all logging contexts

- [x] P2 **Replace binaries with references** ✓ Complete in Python & JavaScript
  - [x] SHA-256 based reference generation
  - [x] Unique reference IDs for each binary blob
  - [x] Metadata extraction (size, hash, type)
  - [x] Reference tracking and retrieval

- [x] P2 **Add sample corpus for regression** ✓ Complete in Python & JavaScript
  - [x] SampleCorpus class for managing test data
  - [x] Default sample set included
  - [x] JSON file persistence
  - [x] Sample filtering by type and ID
  - [x] Covers text, image, safety, and edge cases

- [x] P2 **Add fuzzing for prompt parsers** ✓ Complete in Python & JavaScript
  - [x] PromptFuzzer class with multiple strategies
  - [x] Special character fuzzing
  - [x] Unicode and RTL text fuzzing
  - [x] Length variation testing
  - [x] Injection attack simulation (SQL, XSS, etc.)
  - [x] Format string testing

- [x] P2 **Add chaos tests for network timeouts** ✓ Complete in Python & JavaScript
  - [x] ChaosTestRunner class
  - [x] Configurable failure and timeout rates
  - [x] Network delay simulation
  - [x] Intermittent failure injection
  - [x] Test result aggregation and reporting

- [x] P2 **Simulate cold starts in CI** ✓ Complete in Python & JavaScript
  - [x] ColdStartSimulator class
  - [x] Cache clearing utilities
  - [x] Cold vs warm start timing
  - [x] Performance overhead calculation
  - [x] Compatible with CI environments

- [x] P2 **Validate memory footprint at scale** ✓ Complete in Python & JavaScript
  - [x] MemoryProfiler class
  - [x] Snapshot-based memory tracking
  - [x] Memory diff comparison
  - [x] Baseline and limit validation
  - [x] Detailed memory reports
  - [x] Memory leak detection support

---

## Landing Page

**Current Status:** ~90% complete, needs navigation updates and external link cleanup

**Priority Tasks:**
- [ ] P0 **Add navigation links**
  - [ ] Add Demo link to navbar (points to /demo)
  - [ ] Add AI link to navbar (points to /ai)
  - [x] Home link
  - [x] About link
  - [x] Gallery link
  - [x] Services link
  - [x] Contact link
  - [ ] Legal link (low priority)

- [ ] P0 **Clean up external links**
  - [ ] Remove or relocate Unity AI Chat links (https://unity.unityailab.com) - external site not in repo
  - [ ] Remove or relocate CodeWringer links (https://github.com/Unity-Lab-AI/CodeWringer) - external repo
  - [ ] Keep GitHub org link (https://github.com/Unity-Lab-AI) - acceptable external library/service
  - [ ] Keep Discord link (https://discord.gg/unityailab) - acceptable external service
  - [ ] Replace external project links with links to pages in current repo only (/demo, /ai, /about, etc.)
  - [ ] External links allowed ONLY for: libraries, services, and platforms (not other projects)

**Content Sections:**
- [x] Home content (Hero section implemented)
  - [x] Introductions section
  - [x] "What is Unity AI Lab" section
  - [ ] Stats overview with counters
  - [ ] Activity timeline
  - [ ] Deployments showcase

- [ ] Projects page (Gallery section exists but incomplete)
  - [ ] Project cards for in-repo projects only
  - [ ] Back-burner list
  - [ ] Only link to projects whose code exists in this repo

- [x] About page (Features section with "What is UnityAILab?")
  - [x] Who we are
  - [x] What we do
  - [ ] Mission statement (partial)
  - [ ] How we got here
  - [ ] Timeline graphic

- [x] Services page
  - [ ] Prompt engineering
  - [x] Red team services
  - [x] Blue team services
  - [x] Specialized agents (mentioned in AI Integration)
  - [x] AI integration
  - [ ] AI training
  - [ ] Chatbot development

- [x] Contact page
  - [x] Email link (contact form implemented)
  - [x] Discord link (in footer)

- [ ] Legal pages (low priority)
  - [ ] Terms of Service
  - [ ] Privacy Policy
  - [ ] License

- [x] Keyboard accessible navigation (Bootstrap navbar)
- [x] Active link state handling (Bootstrap default states)

---

## /demo Page (Demo AI Chat App)

**Goal:** Showcase 50-75% of Pollinations functionality in a demo environment

**Core Chat Interface:**
- [ ] P0 Text input box
- [ ] Send button
- [ ] Enter submits message
- [ ] Shift+Enter inserts newline
- [ ] User messages on the right
- [ ] AI messages on the left
- [ ] Chat bubble style
- [ ] Markdown rendering
- [ ] Code block highlighting
- [ ] Stop generation button
- [ ] Reset demo button

**Pollinations Feature Showcase (50-75% of full API):**

- [ ] P0 **Text-to-Text Generation**
  - [ ] Single-turn completion
  - [ ] Multi-turn conversation
  - [ ] Model selector drop-down
  - [ ] Temperature control
  - [ ] Safety filter toggle

- [ ] P0 **Text-to-Image Generation**
  - [ ] Generate images from prompts
  - [ ] Separate image panel/display
  - [ ] Model selector for image models
  - [ ] Seed support for determinism
  - [ ] Image size selection
  - [ ] Number of variants selector

- [ ] P1 **Text-to-Speech (TTS)**
  - [ ] Voice selection dropdown
  - [ ] Auto-play toggle
  - [ ] Sample rate selection
  - [ ] Play/pause controls

- [ ] P1 **Speech-to-Text (STT)**
  - [ ] Voice recognition toggle
  - [ ] Microphone input
  - [ ] Voice-to-voice mode toggle
  - [ ] Real-time transcription display

- [ ] P1 **Image-to-Text**
  - [ ] Image upload for captioning
  - [ ] OCR functionality
  - [ ] Region descriptions

- [ ] P2 **Image-to-Image** (optional, lower priority for demo)
  - [ ] Image upload for transformation
  - [ ] Text-guided generation
  - [ ] Style transfer

**Image Actions:**
- [ ] Save image
- [ ] Copy image
- [ ] Re-generate image with new seed
- [ ] Open image in new tab
- [ ] Download image

**Text Actions:**
- [ ] Copy text
- [ ] Edit text inline
- [ ] Regenerate response
- [ ] Copy code blocks

**Demo-Specific Features:**
- [ ] Local chat history save (browser storage)
- [ ] Max history transmitted
- [ ] Automatic context compression
- [ ] Token usage display
- [ ] Latency display
- [ ] Demo limitations notice
- [ ] Link to full /ai app for complete experience

**UI/UX:**
- [ ] Clean, minimal interface
- [ ] Feature toggle panel (show/hide available features)
- [ ] Help tooltips for Pollinations features
- [ ] Example prompts for each feature type
- [ ] Feature status indicators (loading, error, success)

---

## Responsiveness Standard

**Goal:** Establish site-wide standard for seamless use on any device (extra small to extra large screens)

**Core Principles:**
- Seamless experience across all screen sizes
- Resizing components that adapt to viewport
- Hamburger menus when content doesn't fit
- Goes hand-in-hand with cross-browser support

**Screen Size Breakpoints:**
- [ ] P0 Extra small devices (phones, <576px)
  - [ ] Single column layouts
  - [ ] Hamburger menu for navigation
  - [ ] Touch-friendly tap targets (min 44px)
  - [ ] Readable font sizes (min 16px for body)
  - [ ] Full-width buttons and forms

- [ ] P0 Small devices (landscape phones, tablets, 576px-768px)
  - [ ] 1-2 column layouts
  - [ ] Hamburger menu or condensed navigation
  - [ ] Optimized spacing and padding
  - [ ] Responsive images and media

- [ ] P0 Medium devices (tablets, 768px-992px)
  - [ ] 2-3 column layouts
  - [ ] Full navigation or condensed depending on content
  - [ ] Balanced spacing
  - [ ] Grid-based layouts

- [ ] P0 Large devices (desktops, 992px-1200px)
  - [ ] 3-4 column layouts
  - [ ] Full navigation visible
  - [ ] Optimal reading width (max-width containers)
  - [ ] Sidebar layouts where appropriate

- [ ] P0 Extra large devices (large desktops, >1200px)
  - [ ] Full multi-column layouts
  - [ ] Maximum content width with margins
  - [ ] Enhanced features and details
  - [ ] Optimal use of screen real estate

**Component-Level Responsiveness:**
- [ ] P0 Scalable typography
  - [ ] Fluid font sizes using clamp() or media queries
  - [ ] Responsive line heights
  - [ ] Readable text on all screen sizes

- [ ] P0 Scalable buttons and interactive elements
  - [ ] Touch-friendly sizes on mobile
  - [ ] Proper spacing between clickable items
  - [ ] Visible focus states

- [ ] P0 Scalable hero sections and cards
  - [ ] Background images with proper sizing
  - [ ] Flexible card grids
  - [ ] Responsive padding and margins

- [ ] P0 Responsive navigation
  - [ ] Hamburger menu on small screens
  - [ ] Smooth transitions
  - [ ] Accessible keyboard navigation
  - [ ] Active state indicators

- [ ] P0 Responsive forms and inputs
  - [ ] Full-width inputs on mobile
  - [ ] Proper input types for mobile keyboards
  - [ ] Clear labels and validation

- [ ] P0 Responsive images and media
  - [ ] Properly sized images (no overflow)
  - [ ] Art direction with picture element
  - [ ] Lazy loading for performance

**Testing & Validation:**
- [ ] P0 Test on real devices (phone, tablet, laptop, desktop)
- [ ] Test landscape and portrait orientations
- [ ] Lighthouse performance target on mobile (score >90)
- [ ] Lighthouse accessibility target on mobile (score >90)
- [ ] Chrome DevTools device emulation testing
- [ ] Firefox responsive design mode testing

**Performance Considerations:**
- [ ] Minimize layout shifts (CLS)
- [ ] Optimize images for different screen sizes
- [ ] Use responsive loading strategies
- [ ] Minimize JavaScript for mobile devices

---

## Cross-Browser Support

**Goal:** Ensure consistent functionality across all major browsers (works hand-in-hand with responsiveness)

**Browser Targets:**
- [ ] P0 Chrome/Chromium (latest 2 versions)
- [ ] P0 Firefox (latest 2 versions)
- [ ] P0 Safari/WebKit (latest 2 versions)
- [ ] P0 Edge (latest 2 versions)
- [ ] P1 Mobile Safari (iOS)
- [ ] P1 Chrome Mobile (Android)
- [ ] P2 Samsung Internet
- [ ] P2 Opera

**Core Compatibility:**
- [ ] P0 Baseline features work in all target browsers
- [ ] P0 Polyfills for critical missing features
- [ ] P0 Feature detection gates (no UA sniffing)
- [ ] P0 Graceful degradation for unsupported features
- [ ] CSS vendor prefixes where needed
- [ ] Transpiled JavaScript for older engines

**Browser-Specific Features:**
- [ ] P0 Speech recognition: native Web Speech API when present
- [ ] P0 Speech recognition: fallback to Pollinations STT when missing
- [ ] P1 Voice-to-voice without on-device STT when hosted
- [ ] P1 Media handling across browsers
- [ ] P1 WebRTC compatibility for voice features
- [ ] Notification API with fallbacks
- [ ] Local storage with fallbacks

**Testing Strategy:**
- [ ] P0 Test in Chrome, Firefox, Safari, Edge
- [ ] P0 Test on mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Test with BrowserStack or similar service
- [ ] Automated cross-browser testing in CI
- [ ] Manual QA on real devices

**Known Issues & Workarounds:**
- [ ] Document browser-specific limitations
- [ ] Maintain compatibility matrix
- [ ] User-facing browser recommendations
- [ ] Fallback UI for unsupported features

---

## Cross-Platform (Mobile)
- [ ] P1 Device-specific styles where available
- [ ] Generic styles for unknown devices
- [ ] Touch targets at least 44px
- [ ] Visible focus outlines
- [ ] Reduce motion preference respected
- [ ] Battery usage audit on mobile
- [ ] Network usage audit on mobile

---

## /ai Page (Full AI Chat Application)

**Goal:** Create a full-featured AI chat application structured like ChatGPT, Gemini, DeepSeek, etc. with custom features

**Layout Structure (Standard Chat App):**
- [ ] P0 Three-panel layout (desktop)
  - [ ] Left sidebar: Session list and folders
  - [ ] Center panel: Active chat conversation
  - [ ] Right sidebar (collapsible): Settings/tools/info
- [ ] P0 Responsive mobile layout
  - [ ] Collapsible sidebar with hamburger menu
  - [ ] Full-screen chat on mobile
  - [ ] Swipe gestures for sidebar

**Core Chat Features (Parity with Demo + Full Pollinations):**
- [ ] P0 All demo features included
- [ ] P0 All Pollinations API features (100% coverage)
  - [ ] Text-to-Text (all models)
  - [ ] Text-to-Image (all models)
  - [ ] Text-to-Speech (all voices)
  - [ ] Speech-to-Text
  - [ ] Image-to-Text
  - [ ] Image-to-Image
  - [ ] Function calling/tool use
  - [ ] Streaming mode
  - [ ] Reasoning controls
  - [ ] Safety filtering

**Session Management:**
- [ ] P0 Automatic session saving
- [ ] P0 Session loading by ID
- [ ] P0 New chat button (prominent)
- [ ] P0 Session list in left sidebar
- [ ] P0 Session renaming
- [ ] P0 Session deletion with confirmation
- [ ] P0 Session search/filter
- [ ] P1 Session export (JSON, Markdown, PDF)
- [ ] P1 Session import
- [ ] P1 Duplicate session
- [ ] P1 Pin important sessions

**Session Folders & Organization:**
- [ ] P0 Create folders
- [ ] P0 Rename folders
- [ ] P0 Delete folders with confirmation
- [ ] P0 Move chats into folders (drag & drop)
- [ ] P0 Folder color selection
- [ ] P0 Folder emoji/icon selection
- [ ] P0 Icon color matches folder color
- [ ] P0 Preset color swatches
- [ ] P1 Nested folders (subfolders)
- [ ] P1 Folder sorting options

**File Upload & Processing:**
- [ ] P0 File upload button
- [ ] P0 Drag and drop file upload
- [ ] P0 Validate max file size (configurable)
- [ ] P0 Accept common text formats (.txt, .md, .json, .csv)
- [ ] P0 Accept source code files (.py, .js, .html, .css, etc.)
- [ ] P0 Accept images (.jpg, .png, .gif, .webp)
- [ ] P0 Accept PDFs
- [ ] P0 Validate UTF-8 processable
- [ ] P1 Multiple file upload
- [ ] P1 File preview before sending
- [ ] P1 Attached files display in chat

**Custom Agents:**
- [ ] P1 Create new custom agents
- [ ] P1 Agent templates (presets)
- [ ] P1 Custom system prompts per agent
- [ ] P1 Attach custom tooling/functions
- [ ] P1 Agent personality settings
- [ ] P1 Agent memory/knowledge base
- [ ] P1 Share agents (export/import)
- [ ] P2 Agent marketplace/gallery

**Themes:**
- [ ] P0 Dark theme (default)
- [ ] P0 Light theme
- [ ] P1 High contrast theme
- [ ] P1 Custom theme creator
- [ ] P2 Additional preset themes
- [ ] P2 Theme sharing/import

**Settings Modal:**
- [ ] P0 Theme selection
- [ ] P0 Model selector (default model)
- [ ] P0 Voice selection (default voice)
- [ ] P0 Auto playback toggle for TTS
- [ ] P0 Voice volume slider
- [ ] P0 Max history selector (context window)
- [ ] P0 Max memory entries selector
- [ ] P0 Memory enable/disable toggle
- [ ] P0 Delete all chats (with confirmation)
- [ ] P0 Clear cookies option
- [ ] P0 SFW/NSFW mode toggle
- [ ] P1 Export all data
- [ ] P1 Import data
- [ ] P1 Account preferences
- [ ] P1 Keyboard shortcuts reference
- [ ] P2 Advanced API settings

**Memory System:**
- [ ] P1 Save memory entry (manual)
- [ ] P1 Retrieve memory entry
- [ ] P1 Auto-save important info
- [ ] P1 Memory placement rules (context injection)
- [ ] P1 Edit memory entries
- [ ] P1 Delete memory entry
- [ ] P1 Memory search
- [ ] P1 Memory categories/tags
- [ ] P1 Export/import memory
- [ ] P2 Memory analytics/insights

**SFW/NSFW Content Controls:**
- [ ] P0 SFW/NSFW modes with cookies
- [ ] P0 Age gate for NSFW area (18+ verification)
- [ ] P0 Safe mode flag in API requests
- [ ] P0 Not-safe mode flag in API requests
- [ ] P0 Content warning overlays
- [ ] P1 Granular content filters
- [ ] P1 Custom filter levels

**Advanced Features:**
- [ ] P0 Code highlighting for many languages
- [ ] P0 Markdown rendering
- [ ] P0 LaTeX/math rendering
- [ ] P0 Mermaid diagram support
- [ ] P1 Local storage with compact representations
- [ ] P1 Boolean settings as toggles
- [ ] P1 Keyboard shortcuts
- [ ] P1 Context menu (right-click) actions
- [ ] P2 Collaborative sessions (share with others)

**Custom Features (To Be Decided - Future Roadmap):**

- [ ] P1 **Live Voice Chat**
  - [ ] Real-time voice conversation
  - [ ] Voice activity detection
  - [ ] Push-to-talk mode
  - [ ] Continuous conversation mode
  - [ ] Voice interruption handling
  - [ ] WebRTC integration
  - [ ] Low-latency audio streaming

- [ ] P2 **Page Control Features**
  - [ ] Press buttons via AI commands
  - [ ] Change settings via AI commands
  - [ ] Navigate to different sections
  - [ ] Trigger actions (save, export, etc.)
  - [ ] Voice-controlled navigation
  - [ ] Macro recording/playback

- [ ] P2 **Installable System Connector (Desktop App)**
  - [ ] File system access (read/write with permissions)
  - [ ] Local file browser
  - [ ] Code editor integration
  - [ ] System command execution (sandboxed)
  - [ ] Clipboard integration
  - [ ] Screenshot/screen sharing
  - [ ] Native notifications
  - [ ] Auto-update mechanism
  - [ ] Cross-platform (Windows, macOS, Linux)
  - [ ] Electron or Tauri based

- [ ] P2 **Additional Custom Features (TBD)**
  - [ ] Screen reader for accessibility
  - [ ] Multi-language UI
  - [ ] Browser extensions
  - [ ] Mobile apps (iOS/Android)
  - [ ] API key management for advanced users
  - [ ] Usage analytics dashboard
  - [ ] Cost tracking and budgets

---

## API & Infrastructure
- [ ] P0 Rate limiting
  - [ ] Per-IP limits
  - [ ] Per-user key limits
  - [ ] Burst and sustained windows
- [ ] P0 Observability
  - [ ] Structured logging
  - [ ] Metrics for latency and tokens
  - [ ] Error metrics by type
  - [ ] Tracing for pipelines
- [ ] P1 Config management
  - [ ] Environment-based config
  - [ ] Sensible defaults
  - [ ] Config override via env
- [ ] P1 CI/CD
  - [ ] Lint and type-check
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] Smoke tests on deploy
- [ ] P1 Error taxonomy
  - [ ] Clear error codes
  - [ ] Actionable error messages
  - [ ] Client-side mapping table

---

## Documentation
- [ ] P1 Quickstart guide
- [ ] P1 Model capability matrix
- [ ] P1 Safety guide for developers
- [ ] P2 Contributing guide
- [ ] P2 Architecture overview
- [ ] API examples for each feature
- [ ] Code snippets for common tasks
- [ ] Troubleshooting section
- [ ] Versioning notes and changelog

---

## QA Playbooks
- [ ] P1 Prompt packs for regressions
- [ ] P1 Golden test sets per feature
- [ ] P1 Visual diffing for images
- [ ] P2 Audio intelligibility tests
- [ ] P2 Stress tests for concurrency
- [ ] P2 Browser matrix tests
- [ ] P2 Accessibility test checklist

---

## Performance Targets
- [ ] P0 P95 latency budgets
- [ ] P1 Cold start mitigation pool
- [ ] P1 Cache policy by asset type
- [ ] P2 Model selection heuristics
- [ ] P2 Token usage budgets
- [ ] P2 Memory footprint guardrails

---

## Security & Privacy
- [ ] P0 Secrets management
- [ ] P0 No secrets in code or logs
- [ ] P0 Data masking and redaction
- [ ] P0 Data retention policy
- [ ] P1 Content provenance tags
- [ ] P1 Audit trail for admin actions
- [ ] P1 Key rotation process
- [ ] P1 Privacy review checklist
- [ ] P2 Bug bounty scope draft

---

## Accessibility (a11y)
- [ ] P0 Full keyboard navigation
- [ ] P0 Screen-reader labels and roles
- [ ] P1 Color contrast meets WCAG AA
- [ ] P1 Reduced motion option
- [ ] P1 Focus ring always visible
- [ ] P2 High contrast theme
- [ ] P2 Dyslexia-friendly font option

---

## Data & Storage
- [ ] P1 Schema for sessions
- [ ] P1 Schema for memories
- [ ] P1 Schema for assets
- [ ] P1 Backup strategy
- [ ] P1 Restore drills
- [ ] P2 Data export tool
- [ ] P2 Right-to-erasure flow
- [ ] P2 Anonymization utilities

---

## Analytics
- [ ] P1 Event schema for UI actions
- [ ] P1 Dashboard for usage
- [ ] P1 Funnel for onboarding
- [ ] P1 Retention by cohort
- [ ] P2 Cost per token view
- [ ] P2 Error heatmap
- [ ] P2 Model selection impact

---

## DevOps
- [ ] P1 Infrastructure as code templates
- [ ] P1 Staging environment parity
- [ ] P1 Blue-green deployment option
- [ ] P1 Rollback button
- [ ] P2 Canary releases by percentage
- [ ] P2 Multi-region failover
- [ ] P2 Disaster recovery plan

---

## Legal & Compliance
- [ ] P1 Terms review
- [ ] P1 Privacy review
- [ ] P1 Cookies disclosure
- [ ] P2 DPIA template
- [ ] P2 Data processing addendum
- [ ] P2 Third-party model licenses

---

## Edge Cases & Hardening
- [ ] P1 Handle empty prompts gracefully
- [ ] P1 Handle oversized uploads
- [ ] P1 Handle model timeouts
- [ ] P1 Handle partial streaming
- [ ] P1 Handle rate-limit bursts
- [ ] P2 Offline-first read cache
- [ ] P2 Retry with backoff on network errors

---

## Benchmarks
- [ ] P1 Text quality benchmarks
- [ ] P1 Image quality metrics
- [ ] P1 Audio MOS proxy
- [ ] P2 Instruction-following suite
- [ ] P2 Reasoning tasks set
- [ ] P2 Safety false-positive rate tracking

---

## Open Questions
- [ ] Preferred STT fallback provider
- [ ] Strictness of image safety in demo vs app
- [ ] Minimum browser versions supported
- [ ] Long-lived memory store location
- [ ] Policy on user-provided plugins
- [ ] Multi-tenant isolation boundaries
- [ ] Server vs client inference split

---

## Glossary
- **SFW/NSFW**: Safe-for-work / Not-safe-for-work.
- **STT**: Speech-to-text.
- **TTS**: Text-to-speech.
- **SSE**: Server-Sent Events (one-way streaming from server to client).
- **PII**: Personally Identifiable Information.
- **WCAG**: Web Content Accessibility Guidelines.
