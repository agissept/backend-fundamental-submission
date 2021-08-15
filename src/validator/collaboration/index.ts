import CollaborationPayloadSchema from './schema'
import InvariantError from '../../exception/InvariantError'
import CollaborationPayload from '../../model/collaboration/CollaborationPayload'

class CollaborationsValidator {
  public validateCollaborationPayload (payload: CollaborationPayload) {
    const validationResult = CollaborationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default CollaborationsValidator
