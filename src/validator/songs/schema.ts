import Joi from 'joi'

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required().strict(true),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number().strict(true)
})

export default SongPayloadSchema
