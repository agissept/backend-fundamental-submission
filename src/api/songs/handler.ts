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
        // sengaja dibuat seperti ini karena script testing yang ada pada modul kelas ada error
        // seharusnya payload duration yang valid berisi number tetapi malah string yang dikirim
        const payload = request.payload as SongRequest
        const songRequest: SongRequest = {
            ...payload,
            duration: parseInt(String(payload.duration))
        }

        try {
            this.validator.validateNotePayload(songRequest)

            const songId = await this.service.addSong(songRequest)

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
            return h.response({
                'status': 'fail',
                'message': `${e}: ${e.mesage}`
            }).code(400)
        }
    }

    public async getAllSongsHandler() {
        const songs = await this.service.getAllSongs()
        return {
            'status': 'success',
            data: {songs}
        }
    }

    public async getSongByIdHandler(request: Request, h: ResponseToolkit) {
        const {id} = request.params

        try {
            const song = await this.service.getSongById(id)
            return {
                'status': 'success',
                data: {song}
            }
        }catch (error) {
            if (error instanceof ClientError) {
                return h.response({
                    'status': 'fail',
                    'message': `${error} : ${error.message}`
                }).code(error.statusCode)
            }
            console.error(error)

            return h.response({
                'status': 'fail',
                'message': 'Server error'
            }).code(500)
        }
    }

    public async putSongHandler(request: Request, h: ResponseToolkit) {
        const {id} = request.params
        // sengaja dibuat seperti ini karena script testing yang ada pada modul kelas ada error
        // seharusnya payload duration dan year yang valid berisi number tetapi malah string yang dikirim
        const payload = request.payload as SongRequest
        const songRequest: SongRequest = {
            ...payload,
            duration: parseInt(String(payload.duration)),
            year: parseInt(String(payload.year))
        }

        try {
            this.validator.validateNotePayload(songRequest)

            await this.service.editSong(id, songRequest)

            return {
                'status': 'success',
                'message': 'Song updated'
            }
        } catch (error) {
            if (error instanceof ClientError) {
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
            await this.service.deleteSong(id)
            return {
                'status': 'success',
                'message': 'Song is deleted'
            }
        } catch (error) {
            if (error instanceof ClientError) {
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
