import {
  DeleteAuthenticationPayloadSchema,
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema
} from './schema'
import LoginPayload from '../../model/auth/LoginPayload'
import RefreshTokenPayload from '../../model/auth/RefreshTokenPayload'
import InvariantError from '../../exception/InvariantError'

class AuthenticationsValidator {
  validatePostAuthenticationPayload (payload: LoginPayload) {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }

  validatePutAuthenticationPayload (payload: RefreshTokenPayload) {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }

  validateDeleteAuthenticationPayload (payload: RefreshTokenPayload) {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default AuthenticationsValidator
