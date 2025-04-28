import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
export const redis = new Redis("rediss://default:AUdRAAIjcDFhM2Y3MmZjZDdlOTY0MWUzYjE3YjFmMTMyOThmMzRhMnAxMA@together-seasnail-18257.upstash.io:6379");
// await redis.set('foo', 'bar');

