import InvariantError from '../../exception/InvariantError'
import ExportNotesPayloadSchema from './schema'
import ExportPayload from '../../model/export/ExportPayload'

class ExportsValidator {
  public validateExportPlaylistPayload (payload: ExportPayload) {
    const validationResult = ExportNotesPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default ExportsValidator
