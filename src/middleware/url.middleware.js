
module.exports = (err, req, res, next) => {
    console.error(err);

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON body. Please send valid JSON.",
            details: err.message
        });
    }

    return res.status(500).json({ message: err.message || "Internal Server Error" });
};