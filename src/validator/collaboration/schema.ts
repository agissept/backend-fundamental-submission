import Joi from 'joi'

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required().strict(true),
  userId: Joi.string().required().strict(true)
})

export default CollaborationPayloadSchema
