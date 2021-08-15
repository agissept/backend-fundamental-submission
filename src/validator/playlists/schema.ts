import Joi from 'joi'

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required().strict(true)
})

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required().strict(true)
})

export { PlaylistPayloadSchema, PlaylistSongPayloadSchema }
