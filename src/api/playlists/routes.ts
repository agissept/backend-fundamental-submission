import { ServerRoute } from '@hapi/hapi'
import PlaylistsHandler from './handler'

const routes = (handler: PlaylistsHandler): Array<ServerRoute> => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.addPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.addSongToPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongsFromPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  }
]

export default routes
