import UsersService from '../../services/UsersService'
import { Request } from '@hapi/hapi'
import UserPayload from '../../model/user/UserPayload'
import UsersValidator from '../../validator/users'
import autoBind from 'auto-bind'

class UsersHandler {
  private service: any;
  private validator: any;

  constructor (service: UsersService, validator: UsersValidator) {
    this.service = service
    this.validator = validator

    autoBind(this)
  }

  async postUserHandler ({ payload }: Request) {
    const userPayload = payload as UserPayload
    this.validator.validateUserPayload(userPayload)

    const userId = await this.service.addUser(userPayload)

    return {
      message: 'User successfully added',
      data: {
        userId
      },
      statusCode: 201
    }
  }

  async getUserByIdHandler (request: Request) {
    const { id } = request.params
    const user = await this.service.getUserById(id)
    return {
      data: {
        user
      }
    }
  }

  async getUsersByUsernameHandler (request: Request) {
    const { username = '' } = request.query
    const users = await this.service.getUsersByUsername(username)
    return {
      data: {
        users
      }
    }
  }
}

export default UsersHandler
