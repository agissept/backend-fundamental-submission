import { Pool } from 'pg'
import { nanoid } from 'nanoid'
import CollaborationPayload from '../model/collaboration/CollaborationPayload'
import InvariantError from '../exception/InvariantError'

class CollaborationsService {
    private pool = new Pool()

    async addCollaboration (payload: CollaborationPayload) {
      const id = `collaboration-${nanoid(16)}`
      const query = {
        text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
        values: [id, ...Object.values(payload)]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Collaboration failed to add')
      }

      return result.rows[0].id
    }

    async deleteCollaboration (payload: CollaborationPayload) {
      const query = {
        text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
        values: [...Object.values(payload)]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Collaboration failed to add')
      }
    }

    async verifyCollaborator (playlistId: string, userId: string) {
      const query = {
        text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
        values: [playlistId, userId]
      }
      const result = await this.pool.query(query)

      if (!result.rows.length) {
        throw new InvariantError('Fail verify collaboration')
      }
    }
}

export default CollaborationsService
