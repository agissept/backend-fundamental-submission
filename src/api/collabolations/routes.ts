import { ServerRoute } from '@hapi/hapi'
import CollaborationsHandler from './handler'

const routes = (handler: CollaborationsHandler): Array<ServerRoute> => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  }
]

export default routes
