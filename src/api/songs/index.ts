import SongsHandler from './handler'
import routes from './routes'
import { Server } from '@hapi/hapi'

export default {
  name: 'songs',
  version: '1.0.0',
  register: async (server: Server, { service, validator } : any) => {
    const songsHandler = new SongsHandler(service, validator)
    server.route(routes(songsHandler))
  }
}
