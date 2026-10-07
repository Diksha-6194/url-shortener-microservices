const app = require("./src/server");
const PORT = process.env.PORT || 3001;
const connectDB = require("./src/config/db");

const startServer = async () => {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`URL Service running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // For testing