import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'
import MetaInterface from '../../model/upload/MetaInterface'

class StorageService {
    private S3 = new AWS.S3()

    writeFile (file: ReadableStream, meta : MetaInterface) {
      const parameter: PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: +new Date() + meta.filename,
        Body: file,
        ContentType: meta.headers['content-type']
      }

      return new Promise((resolve, reject) => {
        this.S3.upload(parameter, (error: Error, data: ManagedUpload.SendData) => {
          if (error) {
            return reject(error)
          }
          return resolve(data.Location)
        })
      })
    }
}

export default StorageService
