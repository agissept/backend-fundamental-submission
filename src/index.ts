import Hapi, { Request, ResponseToolkit } from '@hapi/hapi'
import songs from './api/songs'
import users from './api/users'
import playlist from './api/playlists'
import authentications from './api/authentications'
import SongsService from './services/SongsService'
import SongsValidator from './validator/songs'
import dotenv from 'dotenv'
import ClientError from './exception/ClientError'
import ResponseSuccess from './model/ResponseSuccess'
import UsersService from './services/UsersService'
import UsersValidator from './validator/users'
import TokenManager from './tokenize/TokenManager'
import AuthenticationsValidator from './validator/authentication'
import AuthenticationsService from './services/AuthenticationsService'
import Jwt from '@hapi/jwt'
import PlaylistsService from './services/PlaylistsService'
import PlaylistValidator from './validator/playlists'

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

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt.plugin
    }
  ])

  // mendefinisikan strategy autentikasi jwt
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
      service: new PlaylistsService(),
      validator: new PlaylistValidator()
    }
  }])

  await server.start()
  console.log(`Server running on port ${server.info.uri}`)
}

init()
