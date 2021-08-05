import SongPayloadSchema from './schema'
import InvariantError from "../../exception/InvariantError";
import SongRequest from "../../model/request/SongRequest";

class SongsValidator {
    public validateNotePayload(payload: SongRequest) {
        const validationResult = SongPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

export default SongsValidator
