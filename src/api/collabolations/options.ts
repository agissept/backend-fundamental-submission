import CollaborationsService from '../../services/postgre/CollaborationsService'
import CollaborationsValidator from '../../validator/collaboration'
import PlaylistsService from '../../services/postgre/PlaylistsService'

interface Options{
    collaborationService: CollaborationsService,
    playlistService: PlaylistsService,
    validator: CollaborationsValidator,
}

export default Options
