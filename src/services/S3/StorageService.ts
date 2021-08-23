const AWS = require('aws-sdk')

class StorageService {
    private S3 = new AWS.S3()

    writeFile (file: any, meta : any) {
      const parameter = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: +new Date() + meta.filename,
        Body: file._data,
        ContentType: meta.headers['content-type']
      }

      return new Promise((resolve, reject) => {
        this.S3.upload(parameter, (error: Error, data: any) => {
          if (error) {
            return reject(error)
          }
          return resolve(data.Location)
        })
      })
    }
}

export default StorageService
