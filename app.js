const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/dbConnect");
const bcrypt = require("bcrypt");
const User = require("./db/userModel");
const jwt = require("jsonwebtoken");
const auth = require("./auth")

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
})

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hashPass) => {
      const user = new User({
        email: req.body.email,
        password: hashPass,
      });

      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: "User created successfully",
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password not hashed successfully",
        e,
      });
    });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passCheck) => {
          if (!passCheck) {
            return res.status(400).send({
              message: "Password doesn't match",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "24h",
            }
          );

          res.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((e) => {
          res.status(400).send({
            message: "Password doesn't match",
            e,
          });
        });
    })
    .catch((e) => {
      res.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get("/free-endpoint", (req, res) => {
  res.json({ message: "This endpoint is free to access." });
});

app.get("/auth-endpoint", auth, (req, res) => {
  res.json({ message: "You are authorize to access this endpoint." });
});

module.exports = app;
