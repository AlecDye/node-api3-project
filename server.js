const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const userRouter = require("./users/userRouter");

const server = express();

// -- Middleware --

server.use(logger);
server.use(helmet());
server.use(morgan("short"));
server.use(express.json());

// -- Custom Middleware Functions --

server.use("/api/users", userRouter);

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} Request to ${
      req.originalUrl
    } ${req.get("Origin")}`
  );
  // tells express to cycle out of this function; browser will HANG if not present
  next();
}

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//! This must be last
// server.use(function (req, res) {
//   res.status(404).send("404 Error: Oops that page doesn't exist");
// });

module.exports = server;
