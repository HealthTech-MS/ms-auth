import JWT from 'jsonwebtoken'
import client from '../Config/Redis.js'
import createError from 'http-errors'

export const signAccessToken = (userId, payload) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.ACCESS_TOKEN_SECRET
    const options = { expiresIn: '1h', issuer: 'rkservices.dev', audience: userId }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message)
        reject(createError.InternalServerError())
        return
      }
      resolve(token)
    })
  })
}

export const verifyAccessToken = (req, res, next, status) => {
  const bearerToken = req.body.accessToken
  
  if(!req.body.accessToken){
    return next(createError.Unauthorized())
  }

  JWT.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(createError.Unauthorized(message))
    }
    status.success = true
  })
}

export const signRefreshToken = (userId, payload) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_TOKEN_SECRET
    const options = { expiresIn: '1y', issuer: 'rkservices.dev', audience: userId }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message)
        reject(createError.InternalServerError())
      }

      client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  })
}

export const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if(err){
        return reject(createError.Unauthorized())
      } 
      
      const userId = payload.aud
      client.GET(userId, (err, result) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        if (refreshToken === result) return resolve(userId)
        reject(createError.Unauthorized())
      })
    })
  })
}
