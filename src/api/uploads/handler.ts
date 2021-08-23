import { Request } from '@hapi/hapi'
import autoBind from 'auto-bind'
import StorageService from '../../services/S3/StorageService'
import UploadsValidator from '../../validator/uploads'

class UploadsHandler {
    private service: StorageService
    private validator: UploadsValidator

    constructor (service: StorageService, validator: UploadsValidator) {
      this.service = service
      this.validator = validator

      autoBind(this)
    }

    async postUploadImageHandler (request: Request) {
      const { data } = request.payload as any
      this.validator.validateImageHeaders(data.hapi.headers)

      const pictureUrl = await this.service.writeFile(data, data.hapi)

      return {
        status: 'success',
        data: {
          pictureUrl
        },
        statusCode: 201
      }
    }
}

export default UploadsHandler
