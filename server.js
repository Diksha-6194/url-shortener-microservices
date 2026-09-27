const app = require("./src/app");
const PORT = process.env.PORT || 4000;
const connectMongoDB = require("./src/config/db");
const {connectRedis}= require("./src/config/redis");



(async()=>{
    await connectMongoDB();
    await connectRedis();
    app.listen(PORT, () => {
        console.log(`server running on port : ${PORT}`);
    });
})();




