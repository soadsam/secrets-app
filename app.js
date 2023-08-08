//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const md5 = require("md5");

const accountSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", accountSchema);

async function main() {
  await mongoose.connect("mongodb+srv://slaterade:" + process.env.MONGOAPI + "@cluster0.6ren0ed.mongodb.net/?retryWrites=true&w=majority", { dbName: "userDB" });
  console.log("connected to MongoDB.");
}

main();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/submit", function (req, res) {
  res.render("submit");
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  await User.findOne({ email: newUser.email }).then(function (result) {
    if (!result) {
      newUser
        .save()
        .then(function (result) {
          console.log("User successfully saved");
          res.render("secrets");
        })
        .catch(function (err) {
          res.send(err);
        });
    } else {
      res.send("Sorry, user already exists");
    }
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  await User.findOne({ email: username }).then(function (result) {
    if (result) {
      //   console.log("check 1");
      if (result.password === password) {
        // console.log("check 2");
        res.render("secrets");
      } else {
        res.send("INVALID LOGIN");
      }
    } else {
      res.send("INVALID LOGIN");
    }
  });
});

app.listen(3000, function () {
  console.log("Now listening on port 3000");
});
