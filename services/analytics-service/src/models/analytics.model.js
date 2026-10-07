const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    shortCode: { type: String, required: true, index: true },
    accessTimestamp: { type: Date, default: Date.now, index: true }
});

// Compound index for efficient querying
analyticsSchema.index({ shortCode: 1, accessTimestamp: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);