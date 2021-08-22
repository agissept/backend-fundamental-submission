import ProducerService from '../../services/rabbitmq/ProducerService'
import ExportsValidator from '../../validator/exports'
import PlaylistsService from '../../services/postgre/PlaylistsService'

interface Options{
    producerService: ProducerService,
    playlistService: PlaylistsService,
    validator: ExportsValidator
}

export default Options
