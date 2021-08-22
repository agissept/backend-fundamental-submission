import SongsService from '../../services/postgre/SongsService'
import SongsValidator from '../../validator/songs'

interface Options{
    service: SongsService,
    validator: SongsValidator
}

export default Options
