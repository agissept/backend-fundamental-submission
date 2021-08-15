import { Pool } from 'pg'
import InvariantError from '../exception/InvariantError'

class AuthenticationsService {
    private pool = new Pool()

    async addRefreshToken (token: string) {
      const query = {
        text: 'INSERT INTO authentications VALUES($1)',
        values: [token]
      }

      await this.pool.query(query)
    }

    async verifyRefreshToken (token: string) {
      const query = {
        text: 'SELECT token FROM authentications WHERE token = $1',
        values: [token]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Refresh token is not valid')
      }
    }

    async deleteRefreshToken (token: string) {
      await this.verifyRefreshToken(token)

      const query = {
        text: 'DELETE FROM authentications WHERE token = $1',
        values: [token]
      }

      await this.pool.query(query)
    }
}

export default AuthenticationsService
