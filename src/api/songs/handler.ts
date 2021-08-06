import { Request } from '@hapi/hapi'
import SongsService from '../../services/SongsService'
import SongRequest from '../../model/request/SongRequest'
import SongsValidator from '../../validator/songs'
import ResponseSuccess from '../../model/ResponseSuccess'

class SongsHandler {
    private service
    private validator;

    constructor (service: SongsService, validator: SongsValidator) {
      this.service = service
      this.validator = validator

      this.addSongHandler = this.addSongHandler.bind(this)
      this.getAllSongsHandler = this.getAllSongsHandler.bind(this)
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
      this.putSongHandler = this.putSongHandler.bind(this)
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }

    public async addSongHandler (request: Request): Promise<ResponseSuccess> {
      // sengaja dibuat seperti ini karena script testing yang ada pada modul kelas ada error
      // seharusnya payload duration yang valid berisi number tetapi malah string yang dikirim
      const payload = request.payload as SongRequest
      const songRequest: SongRequest = {
        ...payload,
        duration: parseInt(String(payload.duration))
      }

      this.validator.validateNotePayload(songRequest)

      const songId = await this.service.addSong(songRequest)

      return {
        data: {
          songId: songId
        },
        message: 'Song successfully added',
        statusCode: 201
      }
    }

    public async getAllSongsHandler () {
      const songs = await this.service.getAllSongs()
      return {
        data: { songs }
      }
    }

    public async getSongByIdHandler (request: Request): Promise<ResponseSuccess> {
      const { id } = request.params
      const song = await this.service.getSongById(id)
      return {
        data: { song }
      }
    }

    public async putSongHandler (request: Request): Promise<ResponseSuccess> {
      const { id } = request.params
      // sengaja dibuat seperti ini karena script testing yang ada pada modul kelas ada error
      // seharusnya payload duration dan year yang valid berisi number tetapi malah string yang dikirim
      const payload = request.payload as SongRequest
      const songRequest: SongRequest = {
        ...payload,
        duration: parseInt(String(payload.duration)),
        year: parseInt(String(payload.year))
      }

      this.validator.validateNotePayload(songRequest)

      await this.service.editSong(id, songRequest)

      return {
        message: 'Song updated'
      }
    }

    public async deleteSongByIdHandler (request: Request): Promise<ResponseSuccess> {
      const { id } = request.params

      await this.service.deleteSong(id)
      return {
        message: 'Song is deleted'
      }
    }
}

export default SongsHandler
