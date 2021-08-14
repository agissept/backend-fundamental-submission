import UsersService from '../../services/UsersService'
import { Request } from '@hapi/hapi'
import UserPayload from '../../model/user/UserPayload'
import UsersValidator from '../../validator/users'

class UsersHandler {
  private service: any;
  private validator: any;

  constructor (service: UsersService, validator: UsersValidator) {
    this.service = service
    this.validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this)
  }

  async postUserHandler ({ payload }: Request) {
    const userPayload = payload as UserPayload
    this.validator.validateUserPayload(userPayload)

    const userId = await this.service.addUser(userPayload)

    return {
      status: 'success',
      message: 'User berhasil ditambahkan',
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
      status: 'success',
      data: {
        user
      }
    }
  }

  async getUsersByUsernameHandler (request: Request) {
    const { username = '' } = request.query
    const users = await this.service.getUsersByUsername(username)
    return {
      status: 'success',
      data: {
        users
      }
    }
  }
}

export default UsersHandler