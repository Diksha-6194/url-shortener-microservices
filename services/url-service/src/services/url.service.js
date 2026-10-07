// Business Logic Layer for URL shortening
const urlRepository = require("../repositories/url.repository");
const { generateUniqueShortCode } = require("../utils/shortcode-generator");

exports.createShortUrl = async (originalUrl) => {
    // Validate URL input
    if (!originalUrl || typeof originalUrl !== 'string') {
        throw new Error("Original URL is required and must be a string");
    }

    // Basic URL validation
    try {
        new URL(originalUrl);
    } catch (err) {
        throw new Error("Invalid URL format");
    }

    // Generate unique short code with collision handling
    const shortCode = await generateUniqueShortCode(urlRepository);

    // Store the URL mapping
    const url = await urlRepository.create(originalUrl, shortCode);

    return {
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/${url.shortCode}`,
        url: url.originalUrl
    };
};