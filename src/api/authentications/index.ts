import routes from './routes'
import { Server } from '@hapi/hapi'
import Options from './options'
import AuthenticationsHandler from './handler'

export default {
  name: 'authentications',
  version: '1.0.0',
  async register (server: Server, {
    authenticationsService,
    usersService,
    tokenManager,
    validator
  }: Options) {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    )
    server.route(routes(authenticationsHandler))
  }
}
