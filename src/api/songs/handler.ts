import {Request, ResponseToolkit} from "@hapi/hapi";
import SongsService from "../../services/SongsService";
import SongRequest from "../../model/request/SongRequest";
import SongsValidator from "../../validator/songs";

class SongsHandler {
    private service
    private validator;

    constructor(service: SongsService, validator: SongsValidator) {
        this.service = service
        this.validator = validator

        this.addSongHandler = this.addSongHandler.bind(this)
        this.getAllSongsHandler = this.getAllSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        this.putSongHandler = this.putSongHandler.bind(this)
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }

    public async addSongHandler(request: Request, h: ResponseToolkit) {
        const {payload} = request

        try {
            this.validator.validateNotePayload(payload as SongRequest)

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
        } catch (e) {
           return  h.response({
                'status': 'fail',
                'message': `${e}: ${e.mesage}`
            }).code(400)
        }
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

    public async putSongHandler(request: Request) {
        const {id} = request.params
        this.service.editSong(id, request.payload as SongRequest)
        return {
            'status': 'success',
            'message': 'Song is updated'
        }
    }

    public async deleteSongByIdHandler(request: Request) {
        const {id} = request.params

        this.service.deleteSong(id)
        return {
            'status': 'success',
            'message': 'Song is deleted'
        }
    }
}


export default SongsHandler
