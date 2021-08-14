import PlaylistPayload from '../../model/playlist/PlaylistPayload'
import { PlaylistPayloadSchema, PlaylistSongPayloadSchema } from './schema'
import InvariantError from '../../exception/InvariantError'
import PlaylistSongPayload from '../../model/playlist/PlaylistSongPayload'

class PlaylistValidator {
  public validatePlaylistPayload (payload: PlaylistPayload) {
    const validationResult = PlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }

  public validatePlaylistSongPayload (payload: PlaylistSongPayload) {
    const validationResult = PlaylistSongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default PlaylistValidator
