import { Request } from '@hapi/hapi'
import CollaborationsService from '../../services/postgre/CollaborationsService'
import CollaborationsValidator from '../../validator/collaboration'
import CollaborationPayload from '../../model/collaboration/CollaborationPayload'
import PlaylistsService from '../../services/postgre/PlaylistsService'
import autoBind from 'auto-bind'

class CollaborationsHandler {
    private collaborationService: CollaborationsService
    private playlistService: PlaylistsService
    private validator: CollaborationsValidator

    constructor (
      collaborationService: CollaborationsService,
      playlistService: PlaylistsService,
      validator: CollaborationsValidator) {
      this.collaborationService = collaborationService
      this.playlistService = playlistService
      this.validator = validator

      autoBind(this)
    }

    async postCollaborationHandler ({ payload, auth }: Request) {
      const collaborationPayload = payload as CollaborationPayload
      await this.validator.validateCollaborationPayload(collaborationPayload)

      const { id: owner } = auth.credentials
      const { playlistId } = collaborationPayload

      await this.playlistService.verifyPlaylistOwner(playlistId, owner as string)

      const id = await this.collaborationService.addCollaboration(collaborationPayload)
      return {
        message: 'Success add collaboration',
        data: { collaborationId: id },
        statusCode: 201
      }
    }

    async deleteCollaborationHandler ({ payload, auth }: Request) {
      const collaborationPayload = payload as CollaborationPayload
      await this.validator.validateCollaborationPayload(collaborationPayload)

      const { id: owner } = auth.credentials
      const { playlistId } = collaborationPayload

      await this.playlistService.verifyPlaylistOwner(playlistId, owner as string)

      await this.collaborationService.deleteCollaboration(collaborationPayload)
      return {
        message: 'Success add collaboration'
      }
    }
}

export default CollaborationsHandler
