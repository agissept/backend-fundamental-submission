import { Request } from '@hapi/hapi'
import TokenManager from '../../../src/tokenize/TokenManager'
import AuthenticationsService from '../../services/AuthenticationsService'
import UsersService from '../../services/UsersService'
import LoginPayload from '../../model/auth/LoginPayload'
import RefreshTokenPayload from '../../model/auth/RefreshTokenPayload'
import AuthenticationsValidator from '../../validator/authentication'

class AuthenticationsHandler {
    private authenticationsService
    private usersService
    private tokenManager
    private validator

    constructor (
      authenticationsService: AuthenticationsService,
      usersService: UsersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator) {
      this.authenticationsService = authenticationsService
      this.usersService = usersService
      this.tokenManager = tokenManager
      this.validator = validator

      this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
      this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
      this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
    }

    async postAuthenticationHandler ({ payload }: Request) {
      const loginPayload = payload as LoginPayload
      this.validator.validatePostAuthenticationPayload(loginPayload)

      const id = await this.usersService.verifyUserCredential(loginPayload)

      const accessToken = this.tokenManager.generateAccessToken({ id })
      const refreshToken = this.tokenManager.generateRefreshToken({ id })

      await this.authenticationsService.addRefreshToken(refreshToken)

      return {
        message: 'Authentication success fully added',
        data: {
          accessToken,
          refreshToken
        },
        statusCode: 201
      }
    }

    async putAuthenticationHandler ({ payload }: Request) {
      const refreshTokenPayload = payload as RefreshTokenPayload

      this.validator.validatePutAuthenticationPayload(refreshTokenPayload)

      const { refreshToken } = refreshTokenPayload
      await this.authenticationsService.verifyRefreshToken(refreshToken)

      const { id } = this.tokenManager.verifyRefreshToken(refreshToken)

      const accessToken = this.tokenManager.generateAccessToken({ id })
      return {
        message: 'Access Token successfully renewed',
        data: {
          accessToken
        }
      }
    }

    async deleteAuthenticationHandler ({ payload }: Request) {
      const refreshTokenPayload = payload as RefreshTokenPayload

      this.validator.validateDeleteAuthenticationPayload(refreshTokenPayload)

      const { refreshToken } = refreshTokenPayload
      await this.authenticationsService.verifyRefreshToken(refreshToken)
      await this.authenticationsService.deleteRefreshToken(refreshToken)

      return {
        message: 'Refresh token is deleted'
      }
    }
}

export default AuthenticationsHandler
