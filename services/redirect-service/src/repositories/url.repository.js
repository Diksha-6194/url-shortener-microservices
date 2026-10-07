const Url = require("../models/url.model");

exports.findByShortCode = async (shortCode) => {
    return Url.findOne({ shortCode });
};