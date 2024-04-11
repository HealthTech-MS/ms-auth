import Joi from '@hapi/joi'

export const registerSchema = Joi.object({
  firstName: Joi.string().min(3).max(25).required(),
  lastName: Joi.string().min(3).max(25).required(),
  phoneNumber: Joi.string().min(10).max(10).required(),
  password: Joi.string().min(2).required(),
})

export const loginSchema = Joi.object({
  phoneNumber: Joi.string().min(10).max(10).required(),
  password: Joi.string().min(2).required(),
})

