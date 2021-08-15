import Joi from 'joi'

export const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required().strict(true),
  password: Joi.string().required().strict(true)
})

export const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().strict(true)
})

export const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().strict(true)
})
