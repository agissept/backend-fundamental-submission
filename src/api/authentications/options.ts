import AuthenticationsService from '../../services/AuthenticationsService'
import AuthenticationsValidator from '../../validator/authentication'
import UsersService from '../../services/UsersService'
import TokenManager from '../../tokenize/TokenManager'

interface Options{
    authenticationsService: AuthenticationsService,
    usersService: UsersService,
    tokenManager: TokenManager
    validator: AuthenticationsValidator,
}

export default Options
