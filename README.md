# Unity AI Lab - Test Site

**Test site for the latest version of the main Unity AI Lab website**

This repository contains the development and testing environment for the Unity AI Lab website, along with complete implementations of Pollinations.AI client libraries in both JavaScript and Python.

## Overview

Unity AI Lab explores the cutting edge of AI technology, providing tools and libraries for interacting with various AI models through the Pollinations.AI platform. This test site serves as a sandbox for developing and validating new features before deployment to the main Unity AI Lab website.

### Website

**UnityAILab - The Dark Side of AI**

The website features:
- Gothic-themed dark UI design
- Interactive AI demonstrations
- Real-time AI-powered chat and image generation
- Showcase of PolliLibJS and PolliLibPy capabilities
- Comprehensive documentation and examples

**Live Site Structure:**
- `index.html` - Main landing page
- `about/` - About page with project information
- `header.html` / `footer.html` - Reusable page templates
- `styles.css` - Custom styling with dark gothic theme
- `script.js` - Interactive functionality and AI integrations

## Repository Components

### 📚 [Docs](./Docs/README.md)

Complete API documentation for Pollinations.AI:
- API endpoint specifications
- Authentication methods (referrer-based and bearer token)
- Rate limits and access tiers
- Request/response formats
- Available models and capabilities

### 🟨 [PolliLibJS](./PolliLibJS/README.md)

JavaScript/Node.js library for Pollinations.AI:
- Text-to-Image generation
- Text-to-Text (chat, content generation)
- Text-to-Speech (TTS)
- Speech-to-Text (STT)
- Image-to-Text (vision/analysis)
- Image-to-Image transformations
- Function calling capabilities
- Streaming mode for real-time responses
- Exponential backoff retry logic

### 🐍 [PolliLibPy](./PolliLibPy/README.md)

Python library for Pollinations.AI (mirrors PolliLibJS functionality):
- All features from PolliLibJS
- Python-idiomatic API design
- Class-based architecture
- Dictionary-based configuration
- Compatible with Python 3.7+

## Quick Start

### Clone the Repository

```bash
git clone https://github.com/Unity-Lab-AI/sitetest0.git
cd sitetest0
```

### Using the JavaScript Library

```bash
cd PolliLibJS
npm install
node pollylib.js  # Test connection
```

See [PolliLibJS/README.md](./PolliLibJS/README.md) for detailed usage.

### Using the Python Library

```bash
cd PolliLibPy
pip install requests
python pollylib.py  # Test connection
```

See [PolliLibPy/README.md](./PolliLibPy/README.md) for detailed usage.

### Running the Website Locally

```bash
# Serve the website using any static file server
python -m http.server 8000
# or
npx serve .

# Then open http://localhost:8000 in your browser
```

## Project Structure

```
sitetest0/
├── Docs/                           # API documentation
│   ├── README.md
│   └── Pollinations_API_Documentation.md
├── PolliLibJS/                     # JavaScript library
│   ├── README.md
│   ├── pollylib.js                 # Core library
│   ├── text-to-image.js
│   ├── text-to-text.js
│   └── ... (other modules)
├── PolliLibPy/                     # Python library
│   ├── README.md
│   ├── pollylib.py                 # Core library
│   ├── text_to_image.py
│   ├── text_to_text.py
│   └── ... (other modules)
├── about/                          # About page
│   └── index.html
├── index.html                      # Main landing page
├── header.html                     # Reusable header template
├── footer.html                     # Reusable footer template
├── styles.css                      # Site styling
├── script.js                       # Site functionality
├── template-loader.js              # Template loading utility
├── Docs/                           # Documentation and project tracking
│   ├── TODO/                       # TODO files and roadmaps
│   │   └── TODO.md                 # Main project roadmap
│   ├── API_COVERAGE.md             # API implementation status
│   └── ... (other documentation)
└── README.md                       # This file
```

## Features

### Libraries (PolliLibJS & PolliLibPy)

Both libraries are feature-complete and provide:

✅ Model retrieval and querying
✅ Text-to-Image generation with multiple models
✅ Text-to-Text chat and generation
✅ Text-to-Speech synthesis
✅ Speech-to-Text transcription
✅ Image-to-Text (vision) analysis
✅ Image-to-Image transformations
✅ Function calling / tool use
✅ Streaming mode for real-time responses
✅ Seed-based deterministic generation
✅ Exponential backoff retry logic
✅ Safety filtering controls
✅ Reasoning mode controls

### Website Features

- **Interactive Demos**: Live demonstrations of AI capabilities
- **Dark Gothic UI**: Immersive dark-themed interface
- **Responsive Design**: Works on desktop and mobile devices
- **Template System**: Modular header/footer templates
- **Cache Busting**: Automated version control for assets

## Authentication

Both libraries use **referrer-based authentication** with the default referrer `s-test-sk37AGI` (Seed tier - free).

Access tiers:
- **Anonymous**: 1 request / 15s (no signup)
- **Seed**: 1 request / 5s (free registration) - **Default**
- **Flower**: 1 request / 3s (paid)
- **Nectar**: No limits (enterprise)

## Development

This is a test site for validating:
- New Pollinations.AI features
- Library implementations across languages
- UI/UX improvements
- Documentation updates
- Performance optimizations

Changes tested here are promoted to the main Unity AI Lab website after validation.

## Documentation

- **API Documentation**: [Docs/Pollinations_API_Documentation.md](./Docs/Pollinations_API_Documentation.md)
- **JavaScript Library**: [PolliLibJS/README.md](./PolliLibJS/README.md)
- **Python Library**: [PolliLibPy/README.md](./PolliLibPy/README.md)
- **Project Roadmap**: [Docs/TODO/TODO.md](./Docs/TODO/TODO.md)
- **API Coverage**: [Docs/API_COVERAGE.md](./Docs/API_COVERAGE.md)
- **Test Guide**: [Docs/TEST_GUIDE.md](./Docs/TEST_GUIDE.md)
- **Performance Audit**: [Docs/PERFORMANCE_AUDIT.md](./Docs/PERFORMANCE_AUDIT.md)
- **SEO Implementation**: [Docs/SEO_IMPLEMENTATION.md](./Docs/SEO_IMPLEMENTATION.md)

## External Resources

- [Pollinations.AI Official Documentation](https://github.com/pollinations/pollinations)
- [Pollinations.AI Authentication Portal](https://auth.pollinations.ai)
- [Unity AI Lab Main Website](https://unity-lab-ai.github.io/)

## Contributing

This is a test environment for the Unity AI Lab project. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (this is a test site!)
5. Submit a pull request

## License

This project follows the licensing of the parent Unity AI Lab organization.

## Notes

- **Test Environment**: This site is for development and testing purposes
- **Stability**: Features may be experimental or incomplete
- **Rate Limits**: Default Seed tier rate limits apply (1 req/5s)
- **Watermarks**: Free tier images may have watermarks (starting March 31, 2025)

---

**Made with ❤️ for Unity AI Lab using Pollinations.AI**

*Exploring the dark side of AI. Pushing boundaries, breaking limitations.*
