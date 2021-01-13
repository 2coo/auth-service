"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue = require("bull");
const redis_1 = require("../config/redis");
const jobs = require("../jobs");
const queues = Object.values(jobs).map((job) => ({
    bull: new Queue(job.key, {
        redis: redis_1.default,
    }),
    name: job.key,
    handle: job.handle,
    options: job.options,
}));
exports.default = {
    queues,
    add(name, data) {
        const queue = this.queues.find((queue) => queue.name === name);
        return queue === null || queue === void 0 ? void 0 : queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach((queue) => {
            queue.bull.process(queue.handle);
            queue.bull.on('failed', (job, err) => {
                console.log('Job failed', queue.name, job.data);
                console.log(err);
            });
        });
    },
};
