const express = require("express");
const redirectRoutes = require("./routes/redirect.routes");
require("dotenv").config();

const app = express();

// Parse JSON request bodies (needed for analytics tracking)
app.use(express.json());

// Register Routes
app.use("/", redirectRoutes);

// Error Handler
const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: err.message || "Internal Server Error" });
};

app.use(errorHandler);

module.exports = app;