# TODO List

> Single source of truth for near-term work. Keep items atomic, prefer verbs, and track owners/dates when known.

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
- [ ] P1 Header navigation
  - [ ] Home link
  - [ ] AI page link
  - [ ] Projects page link
  - [ ] About page link
  - [ ] Services page link
  - [ ] Contact link
  - [ ] Legal link
- [ ] Home content
  - [ ] Introductions section
  - [ ] “What is Unity AI Lab” section
  - [ ] Stats overview with counters
  - [ ] Activity timeline
  - [ ] Deployments showcase
- [ ] AI page
  - [ ] Demo link
  - [ ] Capabilities grid
  - [ ] Model badges
- [ ] Projects page
  - [ ] Project cards with tags
  - [ ] Back-burner list
  - [ ] GitHub linkouts
- [ ] About page
  - [ ] Who we are
  - [ ] What we do
  - [ ] Mission statement
  - [ ] How we got here
  - [ ] Timeline graphic
- [ ] Services page
  - [ ] Prompt engineering
  - [ ] Red team services
  - [ ] Blue team services
  - [ ] Specialized agents
  - [ ] AI integration
  - [ ] AI training
  - [ ] Chatbot development
- [ ] Contact page
  - [ ] Email link
  - [ ] Discord link
- [ ] Legal pages
  - [ ] Terms of Service
  - [ ] Privacy Policy
  - [ ] License
- [ ] Keyboard accessible navigation
- [ ] Active link state handling

---

## /demo Page (Demo AI Chat App)
- [ ] P1 Text input box
- [ ] Send button
- [ ] Enter submits message
- [ ] Shift+Enter inserts newline
- [ ] User messages on the right
- [ ] AI messages on the left
- [ ] Chat bubble style
- [ ] Voice recognition toggle
- [ ] Voice-to-voice toggle
- [ ] Separate image panel
- [ ] Local chat history save
- [ ] Max history transmitted
- [ ] Automatic context compression
- [ ] Image actions
  - [ ] Save image
  - [ ] Copy image
  - [ ] Re-generate image with new seed
  - [ ] Open image in new tab
- [ ] Text actions
  - [ ] Copy text
  - [ ] Edit text inline
  - [ ] Regenerate response
- [ ] Stop generation button
- [ ] Reset demo button
- [ ] Markdown rendering
- [ ] Code block highlighting
- [ ] Token usage display
- [ ] Latency display
- [ ] Model selector drop-down

---

## Establish Responsiveness
- [ ] P0 Responsive layout for phone
- [ ] Responsive layout for tablet
- [ ] Responsive layout for laptop
- [ ] Responsive layout for desktop
- [ ] Hamburger menu on small screens
- [ ] Scalable typography
- [ ] Scalable buttons
- [ ] Scalable hero and cards
- [ ] Lighthouse performance target on mobile
- [ ] Lighthouse accessibility target on mobile

---

## Cross-Browser Support
- [ ] P0 Baseline features in Chromium
- [ ] Baseline features in WebKit
- [ ] Speech recognition: native API when present
- [ ] Speech recognition: fallback when missing
- [ ] Voice-to-voice without on-device STT when hosted
- [ ] Graceful fallback for nonstandard elements
- [ ] Feature detection gates enabled
- [ ] Avoid UA sniffing in code

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

## Main AI Chat App
- [ ] P0 Parity with demo features
- [ ] Automatic session saving
- [ ] Session loading by ID
- [ ] Left panel for sessions
- [ ] SFW/NSFW modes with cookies
- [ ] Age gate for NSFW area
- [ ] Safe mode flag in request
- [ ] Not-safe mode flag in request
- [ ] New chat button
- [ ] Agents
  - [ ] Create new custom agents
  - [ ] Attach custom tooling
- [ ] Search across sessions
- [ ] File upload
  - [ ] Validate max file size
  - [ ] Validate UTF-8 processable
  - [ ] Accept common text and source files
- [ ] Session folders
  - [ ] Move chats into folders
  - [ ] Rename folders
  - [ ] Create folders
  - [ ] Color selection for folder
  - [ ] Emoji selection for folder
  - [ ] Icon color matches text
  - [ ] Preset color swatches
- [ ] Themes
  - [ ] Dark theme
  - [ ] Light theme
  - [ ] Additional themes
- [ ] Settings modal
  - [ ] Theme selection
  - [ ] Delete all chats
  - [ ] Confirm destructive actions
  - [ ] Clear cookies option
  - [ ] Model selector
  - [ ] Voice selection
  - [ ] Auto playback toggle
  - [ ] Voice volume slider
  - [ ] Max history selector
  - [ ] Max memory entries selector
  - [ ] Memory enable/disable toggle
  - [ ] Delete memories action
- [ ] Local storage compact representations
- [ ] Boolean settings as toggles
- [ ] Code highlighting for many languages
- [ ] Memory functionality
  - [ ] Save memory entry
  - [ ] Retrieve memory entry
  - [ ] Memory placement rules
  - [ ] Delete memory entry
  - [ ] Export/import tools

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
