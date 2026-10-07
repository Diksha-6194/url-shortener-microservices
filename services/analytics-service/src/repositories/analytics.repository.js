const Analytics = require("../models/analytics.model");

exports.trackAccess = async (shortCode) => {
    const analytics = new Analytics({
        shortCode
    });
    await analytics.save();
    return analytics;
};

exports.getAnalytics = async (shortCode) => {
    // Get all access records for a short code, sorted by timestamp descending
    const accesses = await Analytics.find({ shortCode })
        .sort({ accessTimestamp: -1 })
        .exec();

    if (!accesses || accesses.length === 0) {
        return null;
    }

    // Calculate statistics
    const requestCount = accesses.length;
    const lastAccessed = accesses[0].accessTimestamp;
    const accessLog = accesses.map(access => access.accessTimestamp);

    return {
        shortCode,
        requestCount,
        lastAccessed,
        accessLog
    };
};