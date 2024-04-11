import redis from 'redis'
import dontenv from 'dotenv'

dontenv.config()

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_DOMAIN,
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
