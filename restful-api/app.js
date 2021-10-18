import express from 'express';
import {fileURLToPath} from 'url';
import * as path from 'path';

const app = express();
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Acess-Control-Allow-Origin",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS"){
        res.header("Acess-Control-Allow-Methods","PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
})

app.use((req,res,next)=>{
    return res.status(200).json({
        message:"Test"
    })
})

export default app;