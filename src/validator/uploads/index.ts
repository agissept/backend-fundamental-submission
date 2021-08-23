import InvariantError from '../../exception/InvariantError'
import ImageHeadersSchema from './schema'

class UploadsValidator {
  public validateImageHeaders (headers: string) {
    const validationResult = ImageHeadersSchema.validate(headers)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default UploadsValidator
