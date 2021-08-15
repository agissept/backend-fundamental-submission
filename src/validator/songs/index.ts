import SongPayloadSchema from './schema'
import InvariantError from '../../exception/InvariantError'
import SongPayload from '../../model/song/SongPayload'

class SongsValidator {
  public validateNotePayload (payload: SongPayload) {
    const validationResult = SongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default SongsValidator
