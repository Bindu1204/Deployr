import express from "express"
const app=express()

app.get("/",(req,res)=>{
    res.json({
        msg:"Hey this is working"
    })
})

app.listen(3000)