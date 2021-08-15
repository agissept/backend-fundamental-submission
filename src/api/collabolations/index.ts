import routes from './routes'
import { Server } from '@hapi/hapi'
import Options from './options'
import CollaborationsHandler from './handler'

export default {
  name: 'collaborations',
  version: '1.0.0',
  async register (server: Server, { collaborationService, playlistService, validator }: Options) {
    const collaborationsHandler = new CollaborationsHandler(collaborationService, playlistService, validator)
    server.route(routes(collaborationsHandler))
  }
}
