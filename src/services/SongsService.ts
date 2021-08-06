import { nanoid } from 'nanoid'
import SongRequest from '../model/request/SongRequest'
import DetailSong from '../model/DetailSong'
import NotFoundError from '../exception/NotFoundError'
import { Pool, QueryConfig } from 'pg'
import InvariantError from '../exception/InvariantError'
import Song from '../model/Song'
import DetailSongDatabase from '../model/database/DetailSongDatabase'

class SongsService {
    private pool = new Pool()

    async addSong (payload: SongRequest): Promise<string> {
      const songId = `song-${nanoid(16)}`

      const song: DetailSong = {
        id: songId,
        ...payload,
        insertedAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }

      const query: QueryConfig = {
        text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        values: Object.values(song)
      }
      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Song failed to add')
      }

      return result.rows[0].id
    }

    async getAllSongs (): Promise<Array<Song>> {
      const result = await this.pool.query('SELECT id, title, performer FROM songs')
      return result.rows
    }

    async getSongById (songId: string): Promise<DetailSong> {
      const query: QueryConfig = {
        text: 'SELECT * FROM songs WHERE id = ($1)',
        values: [songId]
      }
      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('Song not found')
      }

      const songFrommDB = result.rows[0] as DetailSongDatabase
      return {
        ...songFrommDB,
        insertedAt: songFrommDB.inserted_at,
        updatedAt: songFrommDB.updated_at
      }
    }

    async editSong (songId: string, payload: SongRequest): Promise<string> {
      const query: QueryConfig = {
        text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
        values: [...Object.values(payload), new Date().toISOString(), songId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('Song not updated, id is not found')
      }

      return result.rows[0].id
    }

    async deleteSong (songId: string): Promise<void> {
      const query: QueryConfig = {
        text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
        values: [songId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('Song not updated, id is not found')
      }
    }
}

export default SongsService
