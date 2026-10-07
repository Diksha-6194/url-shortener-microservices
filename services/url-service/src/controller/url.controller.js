// Controller for URL service
// Responsibilities:
// 1. Receive HTTP inputs
// 2. Call service
// 3. Return response

const urlService = require("../services/url.service");

exports.createShortUrl = async (req, res, next) => {
    try {
        const { url } = req.body; // Note: changed from originalUrl to url per assignment spec

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const result = await urlService.createShortUrl(url);
        return res.status(201).json(result);
    } catch (err) {
        return next(err);
    }
};

// Health check endpoint
exports.healthCheck = async (req, res) => {
    res.json({
        status: "UP",
        service: "url-service",
        timestamp: new Date().toISOString()
    });
};