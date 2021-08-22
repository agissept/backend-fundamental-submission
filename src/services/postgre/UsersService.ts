import { nanoid } from 'nanoid'
import NotFoundError from '../../exception/NotFoundError'
import { Pool } from 'pg'
import InvariantError from '../../exception/InvariantError'
import UserPayload from '../../model/user/UserPayload'
import * as bcrypt from 'bcrypt'
import AuthenticationError from '../../exception/AuthenticationError'
import LoginPayload from '../../model/auth/LoginPayload'

class UsersService {
    private pool = new Pool()

    async addUser ({ username, password, fullname }: UserPayload) {
      await this.verifyNewUsername(username)
      const id = `user-${nanoid(16)}`
      const hashedPassword = await bcrypt.hash(password, 10)
      const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, username, hashedPassword, fullname]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new InvariantError('Fail to add user')
      }
      return result.rows[0].id
    }

    async verifyNewUsername (username: string) {
      const query = {
        text: 'SELECT username FROM users WHERE username = $1',
        values: [username]
      }

      const result = await this.pool.query(query)

      if (result.rowCount > 0) {
        throw new InvariantError('Fail to add user. Username is used by someone.')
      }
    }

    async getUserById (userId: string) {
      const query = {
        text: 'SELECT id, username, fullname FROM users WHERE id = $1',
        values: [userId]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new NotFoundError('User not found')
      }

      return result.rows[0]
    }

    async verifyUserCredential ({ username, password }: LoginPayload) {
      const query = {
        text: 'SELECT id, password FROM users WHERE username = $1',
        values: [username]
      }

      const result = await this.pool.query(query)

      if (!result.rowCount) {
        throw new AuthenticationError('Credential is not valid')
      }

      const { id, password: hashedPassword } = result.rows[0]

      const match = await bcrypt.compare(password, hashedPassword)

      if (!match) {
        throw new AuthenticationError('Credential is not valid')
      }

      return id
    }

    async getUsersByUsername (username: string) {
      const query = {
        text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
        values: [`%${username}%`]
      }
      const result = await this.pool.query(query)
      return result.rows
    }
}

export default UsersService
