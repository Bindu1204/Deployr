import express from "express"
import { S3 } from "aws-sdk";
const app=express()

const R2_ENDPOINT="https://d742946faacb17bc54e8996509568e49.r2.cloudflarestorage.com"
const R2_ACCESS_KEY_ID="0e608e1af543c2a9167a1a6c18c9d430"
const R2_SECRET_ACCESS_KEY="2e27b678bb3d5de670057efe37e84896d0351f86b7fc11751d4f76582af07d8f"

const s3=new S3({
    accessKeyId:R2_ACCESS_KEY_ID,
    secretAccessKey:R2_SECRET_ACCESS_KEY,
    endpoint:R2_ENDPOINT
})

app.get(/.*/, async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    console.log(host,id,filePath)
    console.log(`dist/${id}${filePath}`)

    const contents = await s3.getObject({
        Bucket: "deployr-bucket",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);