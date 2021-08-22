import ExportsHandler from './handler'

const routes = (handler: ExportsHandler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  }
]

export default routes
