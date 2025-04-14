import { S3 } from "aws-sdk";
import path from "path"
import fs from "fs"

const R2_ENDPOINT="https://d742946faacb17bc54e8996509568e49.r2.cloudflarestorage.com"
const R2_ACCESS_KEY_ID="0e608e1af543c2a9167a1a6c18c9d430"
const R2_SECRET_ACCESS_KEY="2e27b678bb3d5de670057efe37e84896d0351f86b7fc11751d4f76582af07d8f"

const s3=new S3({
    accessKeyId:R2_ACCESS_KEY_ID,
    secretAccessKey:R2_SECRET_ACCESS_KEY,
    endpoint:R2_ENDPOINT
})
export async function downloadS3Folder(prefix:string){
    console.log(prefix);
    const allFiles=await s3.listObjectsV2({
        Bucket:"deployr-bucket",
        Prefix:prefix
    }).promise()

    const allPromises=allFiles.Contents?.map(async ({Key})=>{
        return new Promise(async resolve=>{
            if(!Key){
                resolve("")
                return
            }
            const finalOutputPath=path.join(__dirname,Key)
            const outputFile=fs.createWriteStream(finalOutputPath)
            const dirName=path.dirname(finalOutputPath)
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName,{recursive:true})
            }
            s3.getObject({
                Bucket:"deployr-bucket",
                Key
            }).createReadStream().pipe(outputFile)
            .on("finish",()=>{
                resolve("")
            })
        })
    })||[]
    
    console.log("awaiting");
    await Promise.all(allPromises?.filter(x => x !== undefined));      
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

export function getAllFiles(folderPath:string){
    let allPaths:string[]=[];
    
    const allFilesAndFolders=fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath=path.join(folderPath,file)
        if(fs.statSync(fullFilePath).isDirectory()){
            allPaths=allPaths.concat(getAllFiles(fullFilePath))
        }else{
            allPaths.push(fullFilePath)
        }
    })
    return allPaths
}

export async function uploadFile(fileName:string,localFilePath:string){
    const fileContent=fs.readFileSync(localFilePath)
    const response=await s3.upload({
        Body:fileContent,
        Bucket:"deployr-bucket",
        Key:fileName
    }).promise()

    console.log(response)
}