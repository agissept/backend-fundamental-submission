import {nanoid} from "nanoid";
import SongRequest from "../model/request/SongRequest"
import DetailSong from "../model/DetailSong";

class SongsService {
    private songs: Array<DetailSong> = []

    addSong(payload: SongRequest) {
        const songId = nanoid(16)

        const song: DetailSong = {
            ...payload,
            id: songId,
            insertedAt: new Date().toDateString(),
            updatedAt: new Date().toDateString()
        }

        this.songs.push(song)

        return songId
    }

    getAllSongs() {
        return this.songs
    }

    getSongById(songId: string): DetailSong | undefined {
        return this.songs.find(song => song.id === songId)
    }

    editSong(songId: string, payload: SongRequest) {
        const songIndex = this.songs.findIndex(song => song.id === songId)

        this.songs[songIndex] =  {
            ...this.songs[songIndex],
            ...payload,
            updatedAt: new Date().toISOString()
        }
    }

    deleteSong(songId: string) {
        const songIndex = this.songs.findIndex(song => song.id === songId)
        this.songs.splice(songIndex, 1)
    }
}

export default SongsService
