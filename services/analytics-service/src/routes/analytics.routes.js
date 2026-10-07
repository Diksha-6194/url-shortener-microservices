const express = require("express");
const router = express.Router();
const controller = require("../controller/analytics.controller");

// Analytics endpoints
router.post("/api/analytics/track", controller.trackAccess);
router.get("/api/analytics/:shortCode", controller.getAnalytics);

// Health check
router.get("/health", controller.healthCheck);

module.exports = router;