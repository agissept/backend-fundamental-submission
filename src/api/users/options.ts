import UsersService from '../../services/UsersService'
import UsersValidator from '../../validator/users'

interface Options{
    service: UsersService,
    validator: UsersValidator
}

export default Options
