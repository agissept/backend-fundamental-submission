import MetaInterface from './MetaInterface'

interface UploadPayload extends ReadableStream{
    data: UploadPayload,
    hapi: MetaInterface
}

export default UploadPayload
