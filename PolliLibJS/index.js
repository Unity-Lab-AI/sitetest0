/**
 * PolliLibJS - JavaScript Library for Pollinations.AI
 * ==============================================
 *
 * A comprehensive JavaScript library for interacting with the Pollinations.AI API.
 *
 * Basic Usage:
 *     const { TextToText } = require('pollilibjs');
 *
 *     const generator = new TextToText();
 *     const result = await generator.generateText({
 *         prompt: "Hello, AI!"
 *     });
 *     console.log(result.response);
 *
 * Modules:
 *     - pollylib: Base library with common utilities
 *     - text-to-image: Generate images from text
 *     - text-to-text: Generate text and chat
 */

const { PollinationsAPI, testConnection } = require('./pollylib');
const { TextToText } = require('./text-to-text');
const { TextToImage } = require('./text-to-image');

module.exports = {
    PollinationsAPI,
    TextToText,
    TextToImage,
    testConnection
};
