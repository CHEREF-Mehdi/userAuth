const redis = require("redis");

const redisClient = redis.createClient({
  port: 6379,
  host: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Client connected to redis...");
});

redisClient.on("ready", () => {
  console.log("Redis client ready to use...");
});

const prefixREF = "REF_";
const prefixACC = "ACC_";

module.exports = { redisClient, prefixREF, prefixACC };
