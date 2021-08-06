import SongsService from '../../services/SongsService'
import SongsValidator from '../../validator/songs'

interface Options{
    service: SongsService,
    validator: SongsValidator
}

export default Options
