import express from 'express';
import {fileURLToPath} from 'url';
import * as path from 'path';
import { UserController } from './api/controller/users.js';
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
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

app.post('/user/register',UserController.users_sign_up);

export default app;