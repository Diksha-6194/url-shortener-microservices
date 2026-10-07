// Responsibilities:
// 1. Receive HTTP inputs
// 2. Call service
// 3. Return response

const urlService = require("../services/url.service");

exports.shortenUrl = async (req, res, next) => {
    try {
        const { originalUrl } = req.body; //deconstruct

        if (!originalUrl) {
            return res.status(400).json({ message: "Original URL is required..." });
        }

        const result = await urlService.createShortUrl(originalUrl);
        return res.status(201).json(result);
    } catch (err) {
        return next(err);
    }
};

exports.redirectUrl = async (req, res, next) => {
    try {
        const original = await urlService.getOriginalUrl(req.params.code);
         res.redirect( original);
    } catch (err) {
         next(err);
    }
};