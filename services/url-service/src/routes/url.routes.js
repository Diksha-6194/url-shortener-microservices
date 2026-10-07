const express = require("express");
const router = express.Router();
const controller = require("../controller/url.controller");

// Create Short URL
router.post("/api/urls", controller.createShortUrl);

// Health check
router.get("/health", controller.healthCheck);

module.exports = router;