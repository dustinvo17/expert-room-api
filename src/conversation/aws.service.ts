import * as AWS from 'aws-sdk';
import {Injectable,  InternalServerErrorException} from '@nestjs/common'
const AWS_S3_BUCKET_NAME = 'chatapp';
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY ,
  });

@Injectable()
export class UploadFileService { 
    async uploadFile(file:any,userId:string): Promise<string> {
        console.log('call')
        const urlKey = `${file.originalname}${userId}`
        const params = {
            Body:file.buffer,
            Bucket:AWS_S3_BUCKET_NAME,
            Key:urlKey,
            ACL:'public-read'
        }
        const data = s3.putObject(params).promise().then(data =>{
            console.log(data)
            console.log('call data')
            return urlKey
        },err =>{
            console.log('call err')
            console.log(err)
            return err
        })
        return data
    }
    async deleteFile(key: string){
        const data = s3.deleteObject({
            Bucket:AWS_S3_BUCKET_NAME,
            Key: key
          }).promise().then(data => {
            return data
          },err =>{
              console.log(err)
              return err
          })
          return data
    }
}