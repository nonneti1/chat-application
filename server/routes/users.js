import { fileURLToPath } from "url";
import * as path from "path";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const restURL = "http://localhost:3000/";

export function homepage(req, res) {
  const isAuthenticated = !!req.user;
  if (isAuthenticated) {
    console.log(`user is authenticated, session is ${req.session.id}`);
  } else {
    console.log("unknown user");
  }
  res.sendFile(isAuthenticated ? "landing.html" : "index.html", {
    root: path.join(path.resolve(), "public"),
  });
  // isAuthenticated
  //   ? res.redirect(`/?user=${req.user.username}`)
  //   : res.sendFile("index.html", {
  //       root: path.join(path.resolve(), "public"),
  //     });
}

export function landingPage(req, res) {
  const isAuthenticated = !!req.user;
  res.sendFile(isAuthenticated ? "chat.html" : "index.html", {
    root: path.join(path.resolve(), "public"),
  });
}

export function chatPage(req, res) {
  const isAuthenticated = !!req.user;
  res.sendFile(isAuthenticated ? "chat.html" : "index.html", {
    root: path.join(path.resolve(), "public"),
  });
}

export function signup(req, res, next) {
  res.sendFile(path.join(path.resolve(), "public/register.html"));
}

export function register(req, res, next) {
  const data = {
    username: req.body.username,
    password: req.body.password,
  };
  axios
    .post(restURL + "user/register", data)
    .then((result) => {
      if (result.status === 200) {
        res.redirect("/success");
      }
    })
    .catch((err) => {
      res.redirect("/failed");
    });
}

export function register_success(req, res, next) {
  res.sendFile(path.join(path.resolve(), "public/register_success.html"));
}

export function register_failed(req, res, next) {
  res.sendFile(path.join(path.resolve(), "public/register_failed.html"));
}
