import { Server } from '@hapi/hapi'
import ExportsHandler from './handler'
import Options from './options'
import routes from './routes'

export default {
  name: 'exports',
  version: '1.0.0',
  register: async (server: Server, { producerService, playlistService, validator }: Options) => {
    const exportsHandler = new ExportsHandler(producerService, playlistService, validator)
    server.route(routes(exportsHandler))
  }
}
