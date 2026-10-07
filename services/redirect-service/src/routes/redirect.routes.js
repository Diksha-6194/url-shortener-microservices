const express = require("express");
const router = express.Router();
const controller = require("../controller/redirect.controller");

// Health check
router.get("/health", controller.healthCheck);

// Redirect endpoint
router.get("/:shortCode", controller.redirectUrl);

module.exports = router;