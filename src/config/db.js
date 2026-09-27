const mongoose = require("mongoose");

const mongoUri = process.env.mongo_uri || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urlshortner";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("mongo db connected successfully");
    } catch (err) {
        console.error(`not able to connect ${err}`);
        process.exit(1);
    }
};

module.exports = connectMongoDB;