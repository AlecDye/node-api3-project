const express = require("express");
const morgan = require("morgan")
const helmet = require("helmet")



const server = express();


// -- Middleware --

server.use(logger)
server.use(helmet())
server.use(morgan("short"))
server.use(express.json())

// -- Custom Middleware Functions --

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} Request to ${req.originalUrl} ${req.get(
      "Origin"
      )}`
      );
      // tells express to cycle out of this function; browser will HANG if not present
      next();
    }
    
    //todo - build out these 3 middleware funcitons
    function validateUserId()
    
    function validateUser()

    function validatePost()
    
    // -- API Endpoints --
    
    server.get("/", (req, res) => {
      res.send(`<h2>Let's write some middleware!</h2>`);
    });
  
    //! This must be last
    server.use(function(req, res) {
      res.status(404).send("404 Error: Oops that page doesn't exist")
    })
    
module.exports = server;
