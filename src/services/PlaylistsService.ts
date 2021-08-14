import PlaylistPayload from '../model/playlist/PlaylistPayload'
import { nanoid } from 'nanoid'
import { Pool, QueryConfig } from 'pg'
import InvariantError from '../exception/InvariantError'
import NotFoundError from '../exception/NotFoundError'
import AuthorizationError from '../exception/AuthorizationError'
import ClientError from '../exception/ClientError'

class PlaylistsService {
    private pool = new Pool()

    async addPlaylist ({ name }: PlaylistPayload, owner: string) {
      const id = `playlist-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Playlist gagal ditambahkan')
      }

      return result.rows[0].id
    }

    async getPlaylists (owner: string) {
      const query: QueryConfig = {
        text: `SELECT p.id, p.name, u.username 
               FROM playlists as p
               JOIN users as u ON u.id = p.owner
               WHERE p.owner = $1`,
        values: [owner]
      }
      const result = await this.pool.query(query)
      return result.rows
    }

    async deletePlaylist (playlistId: string) {
      const query: QueryConfig = {
        text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
        values: [playlistId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('Playlist tidak ditemukan, make sure the songId is available in playlists')
      }
    }

    async addSongToPlaylist (songId: string, playlistId: string) {
      const id = `playlistsongs-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
        values: [id, playlistId, songId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Song gagal ditambahkan ke dalam playlist')
      }
    }

    async getSongsFromPlaylist (playlistId: string) {
      const query: QueryConfig = {
        text: `SELECT s.id, s.title, s.performer 
               FROM songs as s
               LEFT JOIN playlistsongs as p ON p.song_id = s.id
               WHERE p.playlist_id = $1`,
        values: [playlistId]
      }

      const result = await this.pool.query(query)
      return result.rows
    }

    async deleteSongFromPlaylist (songId: string, playlistId: string) {
      const query: QueryConfig = {
        text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
        values: [songId, playlistId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new ClientError('Song tidak ditemukan')
      }
    }

    async verifyPlaylistOwner (playlistId: string, userId: string) {
      const query = {
        text: 'SELECT owner FROM playlists WHERE id = $1',
        values: [playlistId]
      }
      const result = await this.pool.query(query)
      if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan')
      }
      const playlist = result.rows[0]
      if (playlist.owner !== userId) {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
      }
    }
}

export default PlaylistsService
