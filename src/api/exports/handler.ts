import ProducerService from '../../services/rabbitmq/ProducerService'
import ExportsValidator from '../../validator/exports'
import { Request } from '@hapi/hapi'
import autoBind from 'auto-bind'
import ExportPayload from '../../model/export/ExportPayload'
import PlaylistsService from '../../services/postgre/PlaylistsService'

class ExportsHandler {
    private producerService: ProducerService
    private playlistService: PlaylistsService
    private validator: ExportsValidator

    constructor (producerService: ProducerService, playlistService: PlaylistsService, validator: ExportsValidator) {
      this.playlistService = playlistService
      this.producerService = producerService
      this.validator = validator

      autoBind(this)
    }

    async postExportPlaylistHandler ({ payload, auth, params }: Request) {
      const exportPayload = payload as ExportPayload
      this.validator.validateExportPlaylistPayload(exportPayload)
      const { playlistId } = params
      const userId = auth.credentials.id as string

      await this.playlistService.verifyPlaylistAccess(playlistId, userId)

      const message = {
        userId,
        targetEmail: exportPayload.targetEmail
      }

      await this.producerService.sendMessage('export:playlist', JSON.stringify(message))

      return {
        message: 'Permintaan Anda dalam antrean',
        statusCode: 201
      }
    }
}

export default ExportsHandler
