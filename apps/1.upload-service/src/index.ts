import express from "express"
import cors from "cors"
import simpleGit from "simple-git"
import { generate } from "./utils"
import path from "path"
import { getAllFiles } from "./file"
import { uploadFile } from "./aws"
import { createClient } from "redis"
import { deleteAllFiles } from "./delete"

const subscriber=createClient()
subscriber.connect()
const publisher=createClient()
publisher.connect()

const app=express()
app.use(cors())
app.use(express.json())

app.post("/deploy",async (req,res)=>{
    const repoURL=req.body.repoURL
    const id=generate()
    //clone data from url and get all file paths and omit all folder names
    await simpleGit().clone(repoURL,path.join(__dirname,`output/${id}`))
    const files=getAllFiles(path.join(__dirname,`output/${id}`))
    
    //put this in s3
    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length+1),file)
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))

    //push to redis queue
    publisher.lPush("build-queue",id)
    //insert status in hashset of redis
    publisher.hSet("status",id,"uploaded")
    //delete content of dist/output folder
    deleteAllFiles(path.join(__dirname,"output",id))

    res.json({
        id
    })
})

app.get("/status",async (req,res)=>{
    const id=req.query.id
    const response=await subscriber.hGet("status",id as string)
    res.json({
        status:response
    })
})

app.listen(3000)