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

## Examples (Python)
- [ ] P1 **Model Retrieval**
  - [ ] List text models
    - [ ] Return normalized model schema
    - [ ] Include name and description
    - [ ] Include max input tokens
    - [ ] Include reasoning capability flag
    - [ ] Include tier
    - [ ] Include community supported flag
    - [ ] Include input types array
    - [ ] Include output types array
    - [ ] Include tool use / function calling flag
    - [ ] Include aliases array
    - [ ] Include vision flag
    - [ ] Include audio flag
    - [ ] Include voices array
    - [ ] Include system messages supported flag
    - [ ] Include uncensored flag
  - [ ] List image models
    - [ ] Include style tags
    - [ ] Include input/output limits
    - [ ] Include supported formats

- [ ] P1 **Text-to-Image Generation**
  - [ ] Generate images across all supported models
  - [ ] Provide N variants with same prompt
  - [ ] Add seed support for determinism
  - [ ] Apply safety filters on prompts
  - [ ] Report blocked content clearly
  - [ ] Support image size selection
  - [ ] Support PNG and JPEG export
  - [ ] Expose inference time in logs

- [ ] P1 **Text-to-Text Generation**
  - [ ] Single-turn completion with temperature control
  - [ ] Multi-turn conversation with stored state
  - [ ] Thread retrieval by conversation ID
  - [ ] Apply input and output safety checks
  - [ ] Redact sensitive strings in logs
  - [ ] Add stop sequence configuration
  - [ ] Add system prompt support where allowed
  - [ ] Add top-k and top-p controls

- [ ] P1 **Text-to-Speech (TTS)**
  - [ ] Generate speech with selectable voices
  - [ ] Support sample rate selection
  - [ ] Provide streaming playback option
  - [ ] Add voice cloning flag gating
  - [ ] Export to WAV and MP3
  - [ ] Loudness normalization pass

- [ ] P1 **Speech-to-Text (STT)**
  - [ ] Transcribe with word-level timestamps
  - [ ] Add punctuation restoration
  - [ ] Enable diarization when supported
  - [ ] Export to JSON and SRT
  - [ ] Add noise reduction preprocessor

- [ ] P1 **Image-to-Text**
  - [ ] Generate image caption
  - [ ] Extract object list
  - [ ] Provide region descriptions
  - [ ] Expose bounding boxes when available
  - [ ] Add OCR fallback for text regions

- [ ] P1 **Image-to-Image**
  - [ ] Support img2img pipeline
  - [ ] Guided generation with text prompt
  - [ ] Inpainting with mask input
  - [ ] Outpainting with expand canvas
  - [ ] Text overlay with styling controls
  - [ ] Meme template mode
  - [ ] Preserve EXIF unless opted out

- [ ] P0 **Safety Filtering**
  - [ ] Implement policy rules engine
  - [ ] Add granular categories and severities
  - [ ] Build structured violation payload
  - [ ] Provide user-visible explanations
  - [ ] Add developer override flag with audit

- [ ] P1 **Reasoning Controls**
  - [ ] Expose reasoning depth presets
  - [ ] Enforce token ceilings by tier
  - [ ] Emit reasoning usage metrics
  - [ ] Add guard for runaway reasoning loops

- [ ] P1 **Seed-Based Generation**
  - [ ] Deterministic generation with fixed seed
  - [ ] Document cross-platform seed caveats
  - [ ] Provide randomness source selection
  - [ ] Compare variance across seeds
  - [ ] Log seed values with outputs

- [ ] P0 **Function Calling / Tool Use**
  - [ ] Implement function schema validation
  - [ ] Add math functions (add, subtract)
  - [ ] Add deterministic RNG function
  - [ ] Add basic equation evaluator
  - [ ] Add web value extractor stub
  - [ ] Add normalization utilities
  - [ ] Build filesystem/network stubs for CI
  - [ ] Provide sandboxed execution layer

- [ ] P0 **Streaming Mode (SSE)**
  - [ ] Token streaming for text responses
  - [ ] Progress events for image/audio
  - [ ] Heartbeat messages during idle
  - [ ] Retry guidance in headers
  - [ ] Client cancel support

- [ ] P0 **Exponential Backoff for Retries**
  - [ ] Add jittered backoff strategy
  - [ ] Respect Retry-After headers
  - [ ] Configure max attempts
  - [ ] Support idempotency keys
  - [ ] Tag retried requests in logs

---

## Additional Testing / Features
- [ ] P2 Separate image data from text caches
- [ ] Exclude binary blobs from text logs
- [ ] Replace binaries with references
- [ ] Add sample corpus for regression
- [ ] Add fuzzing for prompt parsers
- [ ] Add chaos tests for network timeouts
- [ ] Simulate cold starts in CI
- [ ] Validate memory footprint at scale

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
