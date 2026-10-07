const app = require("./src/server");
const PORT = process.env.PORT || 3003;
const connectDB = require("./src/config/db");

const startServer = async () => {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Analytics Service running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // For testing