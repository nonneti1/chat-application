import express from "express";
import { fileURLToPath } from "url";
import http from "http";
import * as path from "path";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const socket = new Server(server);

app.use(express.static(path.join(__dirname, "public")));
app.post("/chat",(req,res,next)=>{
   res.redirect('/chat.html')
})

socket.on("connection",(socket)=>{
    console.log('Client has connected');
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Listen to port ${PORT}...`));