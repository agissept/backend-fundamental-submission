import PlaylistsService from '../../services/PlaylistsService'
import PlaylistValidator from '../../validator/playlists'

interface Options{
    service: PlaylistsService,
    validator: PlaylistValidator
}

export default Options
