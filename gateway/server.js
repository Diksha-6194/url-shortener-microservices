const app = require("./src/server");
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`API Gateway running on port ${PORT}`);
    });
};

startServer();

module.exports = app; // For testing