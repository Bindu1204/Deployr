import {S3} from "aws-sdk"
import fs from "fs"

const R2_ENDPOINT="https://d742946faacb17bc54e8996509568e49.r2.cloudflarestorage.com"
const R2_ACCESS_KEY_ID="0e608e1af543c2a9167a1a6c18c9d430"
const R2_SECRET_ACCESS_KEY="2e27b678bb3d5de670057efe37e84896d0351f86b7fc11751d4f76582af07d8f"

const s3=new S3({
    accessKeyId:R2_ACCESS_KEY_ID,
    secretAccessKey:R2_SECRET_ACCESS_KEY,
    endpoint:R2_ENDPOINT
})

export async function uploadFile(fileName:string,localFilePath:string){
    const fileContent=fs.readFileSync(localFilePath)
    const response=await s3.upload({
        Body:fileContent,
        Bucket:"deployr-bucket",
        Key:fileName
    }).promise()

    console.log(response)
}