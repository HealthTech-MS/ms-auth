import argon2 from "argon2";
import createError from 'http-errors'
import User from '../Models/User.js'
import client from '../Config/Redis.js'
import { registerSchema, loginSchema, changePasswordSchema } from '../helpers/validation_schema.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } from '../helpers/jwt_helper.js'

export const register = async (req, res, next) => {
  try {
    const result = await registerSchema.validateAsync(req.body)
    const doesExist = await User.findOne({
      where:{
        phoneNumber: result.phoneNumber
      }
    })
    
    if(doesExist){
      throw createError.Conflict(`${result.phoneNumber} is already been registered`)
    }
    
    const hashedPassword = await argon2.hash(result.password, {
      memoryCost: 2**16,
      hashLength: 50,
      timeCost: 20,
      parallelism: 3
    })

    const user = await User.create({
      firstName: result.firstName,
      lastName: result.lastName,
      phoneNumber: result.phoneNumber,
      password: hashedPassword,
      role: "User",
    })

    const accessToken = await signAccessToken(user.uuid, {"uuid": user.uuid, "firstName": user.firstName, "phoneNumber": user.phoneNumber})
    const refreshToken = await signRefreshToken(user.uuid, {"uuid": user.uuid, "firstName": user.firstName, "phoneNumber": user.phoneNumber})

    res.send({ "success": true, accessToken, refreshToken })
  } catch (error) {
    if (error.isJoi === true) error.status = 406
    next(error)
  }
}

export const login =  async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body)

    const user = await User.findOne({ 
      where:{
        phoneNumber: result.phoneNumber
      }
    })
    
    if(!user){
      throw createError.NotFound('User not registered')
    }

    const isMatch = await argon2.verify(user.password, result.password);
    if (!isMatch){
      throw createError.Unauthorized('Username/password not valid')
    }

    const accessToken = await signAccessToken(user.uuid, { "uuid": user.uuid })
    const refreshToken = await signRefreshToken(user.uuid, { "uuid": user.uuid })

    res.send({ "success": true, accessToken, refreshToken, uuid: user.uuid })
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest('Invalid Username/Password'))
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken){
      throw createError.BadRequest()
    }

    const userId = await verifyRefreshToken(refreshToken)
    const accessToken = await signAccessToken(userId, { "uuid": userId })
    res.send({ success: "true", accessToken: accessToken })
  } catch (error) {
    next(error)
  }
}

export const verifyToken = async (req, res, next) => {
  try {
    var status = {success: false}
    await verifyAccessToken(req, res, next, status)
    if(status.success){
      res.send(status)
    }
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if(!refreshToken){
      throw createError.BadRequest()
    }

    const userId = await verifyRefreshToken(refreshToken)
    client.DEL(userId, (err, val) => {
      if (err) {
        console.log(err.message)
        throw createError.InternalServerError()
      }
      res.send({"success": true})
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const result = await changePasswordSchema.validateAsync(req.body)
    const user = await User.findOne({ 
      where:{
        uuid: result.uuid
      }
    })
    
    if(!user){
      throw createError.NotFound('User not registered')
    }
    
    const hashedPassword = await argon2.hash(result.newPassword, {
      memoryCost: 2**16,
      hashLength: 50,
      timeCost: 20,
      parallelism: 3
    })

    user.password = hashedPassword

    user.save()

    res.send({ "success": true })
  } catch (error) {
    if (error.isJoi === true) error.status = 406
    next(error)
  }
}
