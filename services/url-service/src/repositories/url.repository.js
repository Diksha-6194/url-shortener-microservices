const Url = require("../models/url.model");

exports.create = async (originalUrl, shortCode) => {
    const url = new Url({
        originalUrl,
        shortCode
    });
    await url.save();
    return url;
};

exports.findByShortCode = async (shortCode) => {
    return Url.findOne({ shortCode });
};