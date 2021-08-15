import Joi from 'joi'

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().strict(true),
  year: Joi.number().min(1900).max(2021).required().strict(true),
  performer: Joi.string().required().strict(true),
  genre: Joi.string().strict(true),
  duration: Joi.number().strict(true)
})

export default SongPayloadSchema
