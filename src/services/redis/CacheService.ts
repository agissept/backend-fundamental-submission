import redis from 'redis'

class CacheService {
    private client = redis.createClient({
      host: process.env.REDIS_SERVER
    }).on('error', (error) => console.error(error))

    set (key: string, value: string, expirationInSecond = 3600) {
      return new Promise((resolve, reject) => {
        this.client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
          if (error) {
            return reject(error)
          }
          return resolve(ok)
        })
      })
    }

    get (key: string) {
      return new Promise((resolve, reject) => {
        this.client.get(key, (error, reply) => {
          if (error) {
            return reject(error)
          }
          if (reply === null) {
            return reject(new Error('Cache not found'))
          }

          return resolve(reply.toString())
        })
      })
    }

    delete (key: string) {
      return new Promise((resolve, reject) => {
        this.client.del(key, (error, count) => {
          if (error) {
            return reject(error)
          }
          return resolve(count)
        })
      })
    }
}

export default CacheService
