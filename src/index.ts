import Hapi from '@hapi/hapi'
import songs from './api/songs'
import SongsService from './services/SongsService'

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register({
        plugin: songs,
        options: {
            service: new SongsService(),
            validator: {}
        }
    })

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
