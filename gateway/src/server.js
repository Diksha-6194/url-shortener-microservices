const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

// Service URLs from environment variables
const URL_SERVICE_URL = process.env.URL_SERVICE_URL || 'http://localhost:3001';
const REDIRECT_SERVICE_URL = process.env.REDIRECT_SERVICE_URL || 'http://localhost:3002';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3003';

// Health check endpoint for the gateway itself
app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        service: "api-gateway",
        timestamp: new Date().toISOString()
    });
});

// Proxy middleware for URL service (POST /api/urls)
app.use(
    "/api/urls",
    createProxyMiddleware({
        target: URL_SERVICE_URL,
        changeOrigin: true
    })
);

// Proxy middleware for Analytics service (GET /api/analytics/:shortCode)
app.use(
    "/api/analytics",
    createProxyMiddleware({
        target: ANALYTICS_SERVICE_URL,
        changeOrigin: true
    })
);

// Proxy middleware for Redirect service (GET /:shortCode - catch-all for short codes)
// This should be last to avoid interfering with other routes
app.use(
    "/",
    createProxyMiddleware({
        target: REDIRECT_SERVICE_URL,
        changeOrigin: true
        // No path rewriting needed - we want to pass the full path including the short code
    })
);

// Error handling for proxy errors
app.use((err, req, res, next) => {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error" });
});

module.exports = app;