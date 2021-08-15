import CollaborationsService from '../../services/CollaborationsService'
import CollaborationsValidator from '../../validator/collaboration'
import PlaylistsService from '../../services/PlaylistsService'

interface Options{
    collaborationService: CollaborationsService,
    playlistService: PlaylistsService,
    validator: CollaborationsValidator,
}

export default Options
