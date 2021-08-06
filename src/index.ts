import Hapi, { Request, ResponseToolkit } from '@hapi/hapi'
import songs from './api/songs'
import SongsService from './services/SongsService'
import SongsValidator from './validator/songs'
import dotenv from 'dotenv'
import ClientError from './exception/ClientError'
import ResponseSuccess from './model/ResponseSuccess'

const init = async () => {
  dotenv.config()

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
    const { response } = request

    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message
      }).code(response.statusCode)
    }

    if (response instanceof Error) {
      console.error(`Server Error: ${response.message}`)
      return h.continue
    }

    const data = response.source as ResponseSuccess
    let statusCode: number = 200
    if (data.statusCode) {
      statusCode = data.statusCode
    }
    return h.response({
      status: 'success',
      message: data.message,
      data: data.data
    }).code(statusCode)
  })

  await server.register({
    plugin: songs,
    options: {
      service: new SongsService(),
      validator: new SongsValidator()
    }
  })

  await server.start()
  console.log(`Server running on port ${server.info.uri}`)
}

init()
