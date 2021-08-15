import Joi from 'joi'

const UserPayloadSchema = Joi.object({
  username: Joi.string().required().strict(true),
  password: Joi.string().required().strict(true),
  fullname: Joi.string().required().strict(true)
})

export default UserPayloadSchema
