import UserPayloadSchema from './schema'
import InvariantError from '../../exception/InvariantError'
import UserPayload from '../../model/user/UserPayload'

class UsersValidator {
  public validateUserPayload (payload: UserPayload) {
    const validationResult = UserPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default UsersValidator
