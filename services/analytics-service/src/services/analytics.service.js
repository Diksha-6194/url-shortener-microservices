// Business Logic Layer for Analytics
const analyticsRepository = require("../repositories/analytics.repository");

exports.trackAccess = async (shortCode) => {
    if (!shortCode) {
        throw new Error("Short code is required");
    }

    return await analyticsRepository.trackAccess(shortCode);
};

exports.getAnalytics = async (shortCode) => {
    if (!shortCode) {
        throw new Error("Short code is required");
    }

    const analyticsData = await analyticsRepository.getAnalytics(shortCode);

    if (!analyticsData) {
        throw new Error("Analytics data not found");
    }

    return analyticsData;
};