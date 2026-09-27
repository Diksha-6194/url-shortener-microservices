const redis =require("redis")

const client = redis.createClient({
    host:"localhost",
    port:6379
});

client.on('error',(err)=>{
    console.error("redis failed due to",err);
})

const connectRedis= async()=>{

    await client.connect();
    console.log("redis connected successfully")
};

module.exports= { client , connectRedis };