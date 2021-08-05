import {HandlerDecorations, Lifecycle, Request, ResponseToolkit} from "@hapi/hapi";
import SongsService from "../../services/SongsService";
import Method = Lifecycle.Method;
import SongRequest from "../../model/request/SongRequest";

class SongsHandler {
    private service
    private validator;
    static addSongHandler: Method | HandlerDecorations | undefined;

    constructor(service: SongsService, validator: any) {
        this.service = service
        this.validator = validator

        this.addSongHandler = this.addSongHandler.bind(this)
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

}

export default SongsHandler
