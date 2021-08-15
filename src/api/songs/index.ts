import SongsHandler from './handler'
import routes from './routes'
import { Server } from '@hapi/hapi'
import Options from './options'

export default {
  name: 'songs',
  version: '1.0.0',
  async register (server: Server, { service, validator }: Options) {
    const songsHandler = new SongsHandler(service, validator)
    server.route(routes(songsHandler))
  }
}
