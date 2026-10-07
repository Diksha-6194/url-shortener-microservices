const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/urlshortner";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
};

module.exports = connectDB;