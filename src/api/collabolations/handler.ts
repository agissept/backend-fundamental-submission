import { Request } from '@hapi/hapi'
import CollaborationsService from '../../services/CollaborationsService'
import CollaborationsValidator from '../../validator/collaboration'
import CollaborationPayload from '../../model/collaboration/CollaborationPayload'
import PlaylistsService from '../../services/PlaylistsService'

class CollaborationsHandler {
    private collaborationService;
    private playlistService;
    private validator;

    constructor (
      collaborationService: CollaborationsService,
      playlistService: PlaylistsService,
      validator: CollaborationsValidator) {
      this.collaborationService = collaborationService
      this.playlistService = playlistService
      this.validator = validator

      this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
      this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
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
