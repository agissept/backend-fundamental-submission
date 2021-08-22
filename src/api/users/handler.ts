import UsersService from '../../services/postgre/UsersService'
import { Request } from '@hapi/hapi'
import UserPayload from '../../model/user/UserPayload'
import UsersValidator from '../../validator/users'
import autoBind from 'auto-bind'

class UsersHandler {
  private service: UsersService
  private validator: UsersValidator

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

  async getUserByIdHandler ({ params }: Request) {
    const user = await this.service.getUserById(params.id)
    return {
      data: {
        user
      }
    }
  }

  async getUsersByUsernameHandler ({ query }: Request) {
    const { username = '' } = query
    const users = await this.service.getUsersByUsername(username)
    return {
      data: {
        users
      }
    }
  }
}

export default UsersHandler
