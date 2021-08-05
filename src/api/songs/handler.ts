import {Request, ResponseToolkit} from "@hapi/hapi";
import SongsService from "../../services/SongsService";
import SongRequest from "../../model/request/SongRequest";

class SongsHandler {
    private service
    private validator;

    constructor(service: SongsService, validator: any) {
        this.service = service
        this.validator = validator

        this.addSongHandler = this.addSongHandler.bind(this)
        this.getAllSongsHandler = this.getAllSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    }

    public async addSongHandler(request: Request, h: ResponseToolkit) {
        const {payload} = request

        const songId = this.service.addSong(payload as SongRequest)

        const response = h.response({
            status: 'success',
            message: 'Song berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    public async getAllSongsHandler() {
        const songs = this.service.getAllSongs()
        return {
            'status': 'success',
            data: {
                songs: songs.map(song => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer
                }))
            }
        }
    }

    public async getSongByIdHandler(request: Request) {
        const {id} = request.params
        const song = this.service.getSongById(id)
        return {
            'status': 'success',
            data: {song}
        }
    }
}


export default SongsHandler
