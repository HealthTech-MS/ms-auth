import redis from 'redis'
import dontenv from 'dotenv'

dontenv.config()

const client = redis.createClient({
  url: `${process.env.REDIS_DOMAIN}:process.env.REDIS_PORT`,
})

client.on('connect', () => {
  console.log('Client connected to redis...')
})

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...')
})

client.on('error', (err) => {
  console.log(err.message)
})

client.on('end', () => {
  console.log('Client disconnected from redis')
})

process.on('SIGINT', () => {
  client.quit()
})

export default client
