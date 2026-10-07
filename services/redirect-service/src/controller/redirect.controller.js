// Controller for Redirect service
// Responsibilities:
// 1. Receive HTTP inputs
// 2. Call service
// 3. Return response (redirect)

const redirectService = require("../services/redirect.service");

exports.redirectUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;

        if (!shortCode) {
            return res.status(400).json({ error: "Short code is required" });
        }

        const originalUrl = await redirectService.getOriginalUrl(shortCode);

        // Perform HTTP redirect
        res.redirect(originalUrl);
    } catch (err) {
        if (err.message === "URL not found") {
            return res.status(404).json({ error: "URL not found" });
        }
        return next(err);
    }
};

// Health check endpoint
exports.healthCheck = async (req, res) => {
    res.json({
        status: "UP",
        service: "redirect-service",
        timestamp: new Date().toISOString()
    });
};