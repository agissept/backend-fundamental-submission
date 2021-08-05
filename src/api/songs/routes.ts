import {ServerRoute} from "@hapi/hapi";
import SongsHandler from "./handler";

const routes = (handler: SongsHandler): Array<ServerRoute> => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.addSongHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getAllSongsHandler,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongByIdHandler,
    },
    // {
    //     method: 'PUT',
    //     path: '/songs/{id}',
    //     handler: handler.putNoteByIdHandler,
    // },
    // {
    //     method: 'DELETE',
    //     path: '/songs/{id}',
    //     handler: handler.deleteNoteByIdHandler,
    // },
]

export default routes
