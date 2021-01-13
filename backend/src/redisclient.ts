import * as redis from 'redis'
const RedisStore = require('./redisstore')
import redisConfig from './config/redis'

// We are just getting a reference to the RedisStore class.
// We do not need to pass an oauth server instance.
// const db = dbfunc();

// Override in-memory SessionStore with the RedisStore
const redisClient = redis.createClient(
  Number(redisConfig.port),
  redisConfig.host,
  {
    no_ready_check: true,
  },
)
export const store = new RedisStore({ redis: redisClient })
