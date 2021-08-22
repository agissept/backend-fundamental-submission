import { Request } from '@hapi/hapi'
import PlaylistPayload from '../../model/playlist/PlaylistPayload'
import PlaylistsService from '../../services/PlaylistsService'
import PlaylistValidator from '../../validator/playlists'
import PlaylistSongPayload from '../../model/playlist/PlaylistSongPayload'
import autoBind from 'auto-bind'

class PlaylistsHandler {
    private service: PlaylistsService
    private validator: PlaylistValidator

    constructor (service: PlaylistsService, validator: PlaylistValidator) {
      this.service = service
      this.validator = validator

      autoBind(this)
    }

    async addPlaylistHandler ({ payload, auth }: Request) {
      const playlistPayload = payload as PlaylistPayload
      this.validator.validatePlaylistPayload(playlistPayload)

      const { id: owner } = auth.credentials

      const songId = await this.service.addPlaylist(playlistPayload, owner as string)

      return {
        data: {
          playlistId: songId
        },
        message: 'playlist successfully added',
        statusCode: 201
      }
    }

    async getAllPlaylistHandler ({ auth }: Request) {
      const { id: owner } = auth.credentials

      const playlists = await this.service.getPlaylists(owner as string)
      return {
        data: { playlists }
      }
    }

    async deletePlaylistHandler ({ params, auth }: Request) {
      const { id } = params
      const { id: owner } = auth.credentials

      await this.service.verifyPlaylistOwner(id, owner as string)

      await this.service.deletePlaylist(id)
      return {
        message: 'Playlist is deleted'
      }
    }

    async addSongToPlaylistHandler ({ payload, params, auth }: Request) {
      const { id: playlistId } = params
      const { id: owner } = auth.credentials

      await this.service.verifyPlaylistAccess(playlistId, owner as string)

      const { songId } = payload as PlaylistSongPayload

      await this.service.addSongToPlaylist(songId, playlistId)

      return {
        message: 'Song added to playlist',
        statusCode: 201
      }
    }

    async getSongsFromPlaylistHandler ({ params, auth }: Request) {
      const { id: playlistId } = params
      const { id: owner } = auth.credentials

      await this.service.verifyPlaylistAccess(playlistId, owner as string)

      const songs = await this.service.getSongsFromPlaylist(playlistId)

      return {
        data: { songs }
      }
    }

    async deleteSongsFromPlaylistHandler ({ payload, params, auth }: Request) {
      const playlistSongPayload = payload as PlaylistSongPayload
      await this.validator.validatePlaylistSongPayload(playlistSongPayload)

      const { songId } = playlistSongPayload
      const { id: playlistId } = params
      const { id: owner } = auth.credentials

      await this.service.verifyPlaylistAccess(playlistId, owner as string)
      await this.service.deleteSongFromPlaylist(songId, playlistId)
      return {
        message: 'Song is deleted from playlist'
      }
    }
}

export default PlaylistsHandler
