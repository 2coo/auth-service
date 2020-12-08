import redis from 'redis'
const RedisStore = require('./redisstore')

// We are just getting a reference to the RedisStore class.
// We do not need to pass an oauth server instance.
// const db = dbfunc();

// Override in-memory SessionStore with the RedisStore
const redisClient = redis.createClient(
  Number(process.env.REDIS_PORT),
  process.env.REDIS_HOST,
  {
    no_ready_check: true,
  },
)
export const store = new RedisStore({ redis: redisClient })
