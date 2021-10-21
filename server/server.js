import express from "express";
import { fileURLToPath } from "url";
import * as url from "url";
import http from "http";
import * as path from "path";
import { Server } from "socket.io";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy} from 'passport-local'
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const sessionMiddleware = session({secret:"chatio",resave:false,saveUninitialized:false});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public/asset")));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
const restURL = "http://localhost:3000/";

const DUMMY_USER = {
    id:1,
    username: "john",
 }

 passport.use(
     new LocalStrategy((username,password,done)=>{
         if (username === "john" && password === "doe"){
             console.log("authentication OK");
             return done(null, DUMMY_USER);
         }else{
             console.log('Wrong credentials');
             return done(null, false);
         }
     })
 )

// app.get("/",(req,res,next)=>{
//     const isAuthenticated = !!req.body.username;
//     if(isAuthenticated){
//         console.log(`User is authenticated, session is ${req.session.id}`);
//     }else{
//         console.log("Unknow user");
//     }
//     console.log(req.body);
//     res.sendFile(isAuthenticated ? path.join(__dirname,"public/chat.html") : path.join(__dirname,"public/index.html"));
// })

// app.get("/signup",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"public/register.html"));
// })

// app.post("/register",(req,res,next)=>{
//     return res.status(200).json({
//         message:'Registered'
//     })
// })

// app.post("/chat", (req, res, next) => {
//   console.log(req.body.username);
//   if(req.body.username){
//     res.redirect(
//         url.format({
//           pathname: "/chat.html",
//           query: {
//             username: req.body.username,
//             room: req.body.room,
//           },
//         })
//       );
//   }else{
//       next(new Error("Unauthorized"));
//   }
// });

// app.post("/chat",passport.authenticate("local",{
//     successRedirect:"/",
//     failureRedirect:"/"
// }))
// app.post("/logout",(req,res)=>{
//     console.log(`Logout ${req.session.id}`);
//     const socketId = req.session.socketId;
//     if(socketId && socket.of("/").sockets.get(socketId)){
//         console.log(`Forcefully closing socket ${socketId}`);
//         socket.of("/").sockets.get(socketId).disconnect(true);
//     }
//     req.logout();
//     res.cookies("connect.sid","",{ expires: new Date() });
//     res.redirect("/");
// })
// passport.serializeUser((user,cb)=>{
//     console.log(`SerializeUser ${user.id}`);
//     cb(null, user.id);
// })

// passport.deserializeUser((id,cb)=>{
//     console.log(`DeserializeUser ${id}`);
//     cb(null, DUMMY_USER);
// })
// const wrap = (session) => (socket, next) => session(socket.request, {}, next);
// socket.use(wrap(sessionMiddleware));
// socket.use(wrap(passport.initialize()));
// socket.use(wrap(passport.session()));

// socket.use((socket,next)=>{
//     if (socket.request.username){
//         next();
//     }else{
//         next(new Error('Unauthorized'));
//     }
// })

// socket.on("connection", (socket) => {
//     console.log(`New connection ${socket.id}`);

//     const session = socket.request.session;
//     console.log(`Saving sid ${socket.id} in session ${session.id}`);
//     session.socketId = socket.id;
//     session.save();
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => console.log(`Listen to port ${PORT}...`));
app.get("/", (req, res) => {
    const isAuthenticated = !!req.user;
    if (isAuthenticated) {
      console.log(`user is authenticated, session is ${req.session.id}`);
    } else {
      console.log("unknown user");
    }
    res.sendFile(isAuthenticated ? "chat.html" : "index.html", { root: path.join(__dirname,"public") });
  });
  
  app.post(
    "/chat",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    })
  );

app.get("/signup",(req,res,next)=>{
    res.sendFile(path.join(__dirname,"public/register.html"));
})

app.post("/register",(req,res,next)=>{
    const data = {
        username:req.body.username,
        password:req.body.password
    }
    axios.post(restURL+'user/register',data)
    .then(result=>{
        if(result.status === 200){
          res.redirect("/success");
        }
    })
    .catch((err) => {
      res.redirect("/failed");
    });
})

app.get("/success",(req,res,next)=>{
  res.sendFile(path.join(__dirname,"public/register_success.html"));
})
app.get("/failed",(req,res,next)=>{
  res.sendFile(path.join(__dirname,"public/register_failed.html"));
})
  
  app.post("/logout", (req, res) => {
    console.log(`logout ${req.session.id}`);
    const socketId = req.session.socketId;
    if (socketId && io.of("/").sockets.get(socketId)) {
      console.log(`forcefully closing socket ${socketId}`);
      io.of("/").sockets.get(socketId).disconnect(true);
    }
    req.logout();
    res.cookie("connect.sid", "", { expires: new Date() });
    res.redirect("/");
  });
  
  passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.id}`);
    cb(null, user.id);
  });
  
  passport.deserializeUser((id, cb) => {
    console.log(`deserializeUser ${id}`);
    cb(null, DUMMY_USER);
  });
  
  const io = new Server(server);
  
  // convert a connect middleware to a Socket.IO middleware
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
  
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  
  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error('unauthorized'))
    }
  });
  
  io.on('connect', (socket) => {
    console.log(`new connection ${socket.id}`);
    socket.on('whoami', (cb) => {
      cb(socket.request.user ? socket.request.user.username : '');
    });
  
    const session = socket.request.session;
    console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();
  });
  
  server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
  });