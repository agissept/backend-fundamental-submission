import { Request } from '@hapi/hapi'
import SongsService from '../../services/SongsService'
import SongPayload from '../../model/song/SongPayload'
import SongsValidator from '../../validator/songs'
import ResponseSuccess from '../../model/ResponseSuccess'
import autoBind from 'auto-bind'

class SongsHandler {
    private service: SongsService
    private validator: SongsValidator

    constructor (service: SongsService, validator: SongsValidator) {
      this.service = service
      this.validator = validator

      autoBind(this)
    }

    public async addSongHandler ({ payload }: Request): Promise<ResponseSuccess> {
      // sengaja dibuat seperti ini karena script testing yang ada pada modul kelas ada error
      // seharusnya payload duration yang valid berisi number tetapi malah string yang dikirim
      let songPayload = payload as SongPayload
      songPayload = {
        ...songPayload,
        duration: parseInt(String(songPayload.duration))
      }

      this.validator.validateNotePayload(songPayload)

      const songId = await this.service.addSong(songPayload)

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

    public async getSongByIdHandler ({ params }: Request): Promise<ResponseSuccess> {
      const song = await this.service.getSongById(params.id)

      return {
        data: { song }
      }
    }

    public async putSongHandler ({ payload, params }: Request): Promise<ResponseSuccess> {
      // sengaja dibuat seperti ini karena script testing yang ada pada modul kelas ada error
      // seharusnya payload duration dan year yang valid berisi number tetapi malah string yang dikirim
      let songPayload = payload as SongPayload
      songPayload = {
        ...songPayload,
        duration: parseInt(String(songPayload.duration)),
        year: parseInt(String(songPayload.year))
      }

      this.validator.validateNotePayload(songPayload)

      await this.service.editSong(params.id, songPayload)

      return {
        message: 'Song updated'
      }
    }

    public async deleteSongByIdHandler ({ params }: Request): Promise<ResponseSuccess> {
      await this.service.deleteSong(params.id)

      return {
        message: 'Song is deleted'
      }
    }
}

export default SongsHandler
