const app = require("./src/app");
const PORT = process.env.PORT || 4000;
const connectMongoDB = require("./src/config/db");
const {connectRedis}= require("./src/config/redis");



(async()=>{
    await connectMongoDB();
    await connectRedis();
    // "0.0.0.0 allows Node to accept connections through the machine network interface"
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`server running on port : ${PORT}`);
    });
})();




