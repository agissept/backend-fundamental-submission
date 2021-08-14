import { ServerRoute } from '@hapi/hapi'
import UsersHandler from './handler'

const routes = (handler: UsersHandler): Array<ServerRoute> => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler
  }
]

export default routes
