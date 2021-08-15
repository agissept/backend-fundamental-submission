import routes from './routes'
import { Server } from '@hapi/hapi'
import Options from './options'
import UsersHandler from './handler'

export default {
  name: 'users',
  version: '1.0.0',
  async register (server: Server, { service, validator }: Options) {
    const usersHandler = new UsersHandler(service, validator)
    server.route(routes(usersHandler))
  }
}
