import 'dotenv/config'
import Hapi, { Request, ResponseToolkit } from '@hapi/hapi'
import songs from './api/songs'
import users from './api/users'
import playlist from './api/playlists'
import collaboration from './api/collabolations'
import authentications from './api/authentications'
import _export from './api/exports'
import SongsService from './services/postgre/SongsService'
import SongsValidator from './validator/songs'
import ClientError from './exception/ClientError'
import ResponseSuccess from './model/ResponseSuccess'
import UsersService from './services/postgre/UsersService'
import UsersValidator from './validator/users'
import TokenManager from './tokenize/TokenManager'
import AuthenticationsValidator from './validator/authentication'
import AuthenticationsService from './services/postgre/AuthenticationsService'
import Jwt from '@hapi/jwt'
import PlaylistsService from './services/postgre/PlaylistsService'
import PlaylistValidator from './validator/playlists'
import CollaborationsService from './services/postgre/CollaborationsService'
import CollaborationsValidator from './validator/collaboration'
import ProducerService from './services/rabbitmq/ProducerService'
import ExportsValidator from './validator/exports'

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  const collaborationService = new CollaborationsService()
  const playlistService = new PlaylistsService(collaborationService)

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

  await server.register([
    {
      plugin: Jwt.plugin
    }
  ])

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts: any) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([{
    plugin: songs,
    options: {
      service: new SongsService(),
      validator: new SongsValidator()
    }
  },
  {
    plugin: users,
    options: {
      service: new UsersService(),
      validator: new UsersValidator()
    }
  },
  {
    plugin: authentications,
    options: {
      authenticationsService: new AuthenticationsService(),
      usersService: new UsersService(),
      tokenManager: new TokenManager(),
      validator: new AuthenticationsValidator()
    }
  },
  {
    plugin: playlist,
    options: {
      service: playlistService,
      validator: new PlaylistValidator()
    }
  },
  {
    plugin: collaboration,
    options: {
      collaborationService: collaborationService,
      playlistService: playlistService,
      validator: new CollaborationsValidator()
    }
  }, {
    plugin: _export,
    options: {
      producerService: new ProducerService(),
      playlistService: playlistService,
      validator: new ExportsValidator()
    }
  }
  ])

  await server.start()
  console.log(`Server running on port ${server.info.uri}`)
}

init()
