// Simple short code generator with collision detection
// In a production system, you might use a dedicated ID service or database sequence
const { encode } = require("../utils");

exports.generateUniqueShortCode = async (urlRepository) => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        // Generate a pseudo-random ID based on timestamp and random value
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const id = timestamp + random;

        const shortCode = encode(id);

        // Check if this short code already exists
        const existing = await urlRepository.findByShortCode(shortCode);
        if (!existing) {
            return shortCode;
        }

        attempts++;
        // If collision, wait a bit and try again (in real system, might use exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    throw new Error("Unable to generate unique short code after multiple attempts");
};