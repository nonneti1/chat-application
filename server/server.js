import express from "express";
import { fileURLToPath } from "url";
import * as url from "url";
import http from "http";
import * as path from "path";
import { Server } from "socket.io";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import axios from "axios";
import {
  homepage,
  register,
  register_failed,
  register_success,
  signup,
} from "./routes/users.js";
import { formatMessage } from "./utils/message.js";
import { getCurrentUser, getRoomUsers, userJoin, userLeave } from "./utils/users.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const sessionMiddleware = session({
  secret: "chatio",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60000 * 60, // 1 Hours session
  },
});
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

let DUMMY_USER;

passport.use(
  new LocalStrategy((username, password, done) => {
    const data = {
      username: username,
      password: password,
    };
    axios
      .post(restURL + "user/login", data)
      .then((result) => {
        console.log("Authentication OK");
        DUMMY_USER = result.data.data;
        return done(null, result.data.data);
      })
      .catch((err) => {
        console.log(`Wrong credentials`);
        return done(null, false);
      });
  })
);
app.get("/", homepage);

app.post("/chat", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: `/?user=${req.body.username}&room=${req.body.room}`,
    failureRedirect: "/",
  })(req,res,next);
});

app.get("/signup", signup);

app.post("/register", register);

app.get("/success", register_success);
app.get("/failed", register_failed);

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
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    console.log(
      `Log socket request user ${JSON.stringify(socket.request.user)}`
    );
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

const botName = "ChatIO"

io.on("connect", (socket) => {
  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();

  socket.on("joinRoom",({username,room}) => {
    let user = userJoin(socket.id,username,room);
    socket.join(room);

    // Welcome current user
    socket.emit("message",formatMessage(botName," Welcome to ChatIO!"));

    // Boardcast when a user connects
    socket.broadcast
      .to(room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );

   // Send room details and users
   io.to(room).emit('roomUsers', {
    room: room,
    users: getRoomUsers(room)
  });   

  })

  // Runs on message event
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });


});

server.listen(port, () => {
  console.log(`application is running at: http://localhost:${port}`);
});
