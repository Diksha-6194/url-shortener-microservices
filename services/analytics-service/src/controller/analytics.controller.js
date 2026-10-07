// Controller for Analytics service
// Responsibilities:
// 1. Receive HTTP inputs
// 2. Call service
// 3. Return response

const analyticsService = require("../services/analytics.service");

exports.trackAccess = async (req, res, next) => {
    try {
        const { shortCode } = req.body;

        if (!shortCode) {
            return res.status(400).json({ error: "Short code is required" });
        }

        await analyticsService.trackAccess(shortCode);
        return res.status(200).json({ message: "Access tracked successfully" });
    } catch (err) {
        return next(err);
    }
};

exports.getAnalytics = async (req, res, next) => {
    try {
        const { shortCode } = req.params;

        if (!shortCode) {
            return res.status(400).json({ error: "Short code is required" });
        }

        const analyticsData = await analyticsService.getAnalytics(shortCode);
        return res.status(200).json(analyticsData);
    } catch (err) {
        if (err.message === "Analytics data not found") {
            return res.status(404).json({ error: "Analytics data not found" });
        }
        return next(err);
    }
};

// Health check endpoint
exports.healthCheck = async (req, res) => {
    res.json({
        status: "UP",
        service: "analytics-service",
        timestamp: new Date().toISOString()
    });
};