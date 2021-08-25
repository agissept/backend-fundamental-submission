import { nanoid } from 'nanoid'
import { Pool, QueryConfig } from 'pg'
import InvariantError from '../../exception/InvariantError'
import NotFoundError from '../../exception/NotFoundError'
import AuthorizationError from '../../exception/AuthorizationError'
import ClientError from '../../exception/ClientError'
import CollaborationsService from './CollaborationsService'
import CacheService from '../redis/CacheService'

class PlaylistsService {
    private pool = new Pool()
    private collaborationService
    private cacheService: CacheService;

    constructor (collaborationService: CollaborationsService, cacheService: CacheService) {
      this.cacheService = cacheService
      this.collaborationService = collaborationService
    }

    async addPlaylist (name: string, owner: string) {
      const id = `playlist-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Fail to add playlist')
      }

      await this.cacheService.delete(`playlists:${owner}`)

      return result.rows[0].id
    }

    async getPlaylists (owner: string) {
      try {
        const result = await this.cacheService.get(`playlists:${owner}`)
        return JSON.parse(result)
      } catch (e) {
        const query: QueryConfig = {
          text: `SELECT p.id, p.name, u.username
               FROM playlists as p
               LEFT JOIN collaborations AS c ON c.playlist_id = p.id
               JOIN users AS u ON u.id = p.owner
               WHERE p.owner = $1 OR c.user_id = $1
               GROUP BY p.id, u.username
             `,
          values: [owner]
        }
        const { rows } = await this.pool.query(query)
        await this.cacheService.set('playlists', JSON.stringify(rows))

        return rows
      }
    }

    async deletePlaylist (playlistId: string, owner: string) {
      const query: QueryConfig = {
        text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
        values: [playlistId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('Playlist is not found, make sure the songId is available in playlists')
      }

      await this.cacheService.delete(`playlistsongs:${playlistId}`)
      await this.cacheService.delete(`playlists:${owner}`)
    }

    async addSongToPlaylist (songId: string, playlistId: string) {
      const id = `playlistsongs-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
        values: [id, playlistId, songId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Fail to added song into playlist')
      }

      await this.cacheService.delete(`playlistsongs:${playlistId}`)
    }

    async getSongsFromPlaylist (playlistId: string) {
      try {
        const result = await this.cacheService.get(`playlistsongs:${playlistId}`)
        return JSON.parse(result)
      } catch (e) {
        const query: QueryConfig = {
          text: `SELECT s.id, s.title, s.performer 
               FROM songs as s
               LEFT JOIN playlistsongs as p ON p.song_id = s.id
               WHERE p.playlist_id = $1`,
          values: [playlistId]
        }

        const { rows } = await this.pool.query(query)
        await this.cacheService.set(`playlistsongs:${playlistId}`, JSON.stringify(rows))
        return rows
      }
    }

    async deleteSongFromPlaylist (songId: string, playlistId: string) {
      const query: QueryConfig = {
        text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
        values: [songId, playlistId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new ClientError('Song not found')
      }

      await this.cacheService.delete(`playlistsongs:${playlistId}`)
    }

    async verifyPlaylistOwner (playlistId: string, userId: string) {
      const query = {
        text: 'SELECT owner FROM playlists WHERE id = $1',
        values: [playlistId]
      }
      const result = await this.pool.query(query)
      if (!result.rowCount) {
        throw new NotFoundError('Playlist not found')
      }
      const playlist = result.rows[0]
      if (playlist.owner !== userId) {
        throw new AuthorizationError('You not have permission to access this resource')
      }
    }

    async verifyPlaylistAccess (playlistId: string, userId: string) {
      try {
        await this.verifyPlaylistOwner(playlistId, userId)
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error
        }
        try {
          await this.collaborationService.verifyCollaborator(playlistId, userId)
        } catch (er) {
          throw error
        }
      }
    }
}

export default PlaylistsService
