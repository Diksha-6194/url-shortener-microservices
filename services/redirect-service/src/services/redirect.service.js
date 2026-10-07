// Business Logic Layer for URL redirection
const urlRepository = require("../repositories/url.repository");
const axios = require("axios");

exports.getOriginalUrl = async (shortCode) => {
    // Look up the original URL in the database
    const url = await urlRepository.findByShortCode(shortCode);

    if (!url) {
        throw new Error("URL not found");
    }

    // Notify analytics service asynchronously (fire-and-forget)
    // This should not break or slow the redirect if it fails
    try {
        const analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3003';
        await axios.post(`${analyticsServiceUrl}/api/analytics/track`,
            { shortCode },
            { timeout: 1000 } // 1 second timeout
        ).catch(() => {
            // Silently ignore analytics failures as per requirements
            // Don't break or slow the redirect
        });
    } catch (err) {
        // Silently ignore analytics failures
    }

    return url.originalUrl;
};