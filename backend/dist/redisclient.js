"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const redis = require("redis");
const RedisStore = require('./redisstore');
const redis_1 = require("./config/redis");
// We are just getting a reference to the RedisStore class.
// We do not need to pass an oauth server instance.
// const db = dbfunc();
// Override in-memory SessionStore with the RedisStore
const redisClient = redis.createClient(Number(redis_1.default.port), redis_1.default.host, {
    no_ready_check: true,
});
exports.store = new RedisStore({ redis: redisClient });
