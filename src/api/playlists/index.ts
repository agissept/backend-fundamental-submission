import routes from './routes'
import { Server } from '@hapi/hapi'
import Options from './options'
import PlaylistsHandler from './handler'

export default {
  name: 'playlists',
  version: '1.0.0',
  async register (server: Server, { service, validator }: Options) {
    const playlistsHandler = new PlaylistsHandler(service, validator)
    server.route(routes(playlistsHandler))
  }
}
