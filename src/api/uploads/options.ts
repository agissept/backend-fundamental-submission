import StorageService from '../../services/S3/StorageService'
import UploadsValidator from '../../validator/uploads'

interface Options{
    service: StorageService,
    validator: UploadsValidator
}

export default Options
