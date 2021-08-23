import { ServerRoute } from '@hapi/hapi'
import { resolve } from 'path'
import UploadsHandler from './handler'

const routes = (handler: UploadsHandler): Array<ServerRoute> => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 500000
      }
    }
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: resolve(__dirname, 'file')
      }
    }
  }
]

export default routes
