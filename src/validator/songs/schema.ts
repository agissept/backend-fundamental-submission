import Joi from 'joi'

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1900).max(2021).required().strict(true),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number().strict(true)
})

export default SongPayloadSchema
