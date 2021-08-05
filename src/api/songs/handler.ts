import {Request, ResponseToolkit} from "@hapi/hapi";
import SongsService from "../../services/SongsService";
import SongRequest from "../../model/request/SongRequest";
import SongsValidator from "../../validator/songs";
import ClientError from "../../exception/ClientError";

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

    public async getSongByIdHandler(request: Request, h: ResponseToolkit) {
        const {id} = request.params
        const song = this.service.getSongById(id)
        if(song === undefined){
            return h.response({
                'status': 'fail',
                'message': 'Song not found'
            }).code(404)
        }
        return {
            'status': 'success',
            data: {song}
        }
    }

    public async putSongHandler(request: Request, h: ResponseToolkit) {
        const {id} = request.params

        try {
            this.validator.validateNotePayload(request.payload as SongRequest)

            this.service.editSong(id, request.payload as SongRequest)

            return {
                'status': 'success',
                'message': 'Song updated'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                console.log(error)

                return h.response({
                    'status': 'fail',
                    'message': `${error} : ${error.message}`
                }).code(error.statusCode)
            }

            return h.response({
                'status': 'fail',
                'message': 'Server Error'
            }).code(500)
        }
    }

    public async deleteSongByIdHandler(request: Request, h: ResponseToolkit) {
        const {id} = request.params

        try {
            this.service.deleteSong(id)
            return {
                'status': 'success',
                'message': 'Song is deleted'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                console.log(error)

                return h.response({
                    'status': 'fail',
                    'message': `${error} : ${error.message}`
                }).code(error.statusCode)
            }

            return h.response({
                'status': 'fail',
                'message': 'Server Error'
            }).code(500)
        }
    }
}


export default SongsHandler
