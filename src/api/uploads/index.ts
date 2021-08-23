import UploadHandler from './handler'
import routes from './routes'
import { Server } from '@hapi/hapi'
import Options from './options'

export default {
  name: 'uploads',
  version: '1.0.0',
  async register (server: Server, { service, validator }: Options) {
    const uploadsHandler = new UploadHandler(service, validator)
    server.route(routes(uploadsHandler))
  }
}
