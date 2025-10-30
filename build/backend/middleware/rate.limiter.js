import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "../lib/redis.js";

const rateLimit = new RateLimiterRedis({
  storeClient: redis,
  points: 100,
  duration: 300,
  blockDuration: 300,
  keyPrefix: "rateLimit",
});

const rateLimiter = async (req, res, next) => {
  try {
    await rateLimit.consume(req.ip);
    next();
  } catch (error) {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later" });
  }
};

export default rateLimiter;