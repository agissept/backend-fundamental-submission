import AuthenticationsService from '../../services/postgre/AuthenticationsService'
import AuthenticationsValidator from '../../validator/authentication'
import UsersService from '../../services/postgre/UsersService'
import TokenManager from '../../tokenize/TokenManager'

interface Options{
    authenticationsService: AuthenticationsService,
    usersService: UsersService,
    tokenManager: TokenManager
    validator: AuthenticationsValidator,
}

export default Options
