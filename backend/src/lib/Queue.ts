import Queue from 'bull'
import redisConfig from '../config/redis'
import * as jobs from '../jobs'

const queues = Object.values(jobs).map((job: any) => ({
  bull: new Queue(job.key, {
    redis: redisConfig,
  }),
  name: job.key,
  handle: job.handle,
  options: job.options,
}))

export default {
  queues,
  add(name: any, data: any) {
    const queue = this.queues.find((queue) => queue.name === name)
    return queue?.bull.add(data, queue.options)
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle)
      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data)
        console.log(err)
      })
    })
  },
}
