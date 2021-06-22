const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://ihabbbb:Ihab1990@cluster0-shard-00-00.lmggz.mongodb.net:27017,cluster0-shard-00-01.lmggz.mongodb.net:27017,cluster0-shard-00-02.lmggz.mongodb.net:27017/test?replicaSet=atlas-14d6y3-shard-0&ssl=true&authSource=admin",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("we are connected to DB");
});
const Knesetschema = new mongoose.Schema({
  title: String,
  text: String,
});
const Users = mongoose.model("UserDB", { name: String, password: String }); //schema
const app = express();
app.use(express.static("public"));
app.use(express.json());
// MiddleWare
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var config = require("dotenv").config();
// get a list of students from the database
app.use('/login',async (req, res) => {
  console.log("started.xz....");
  console.log(req.body.username);
  console.log(req.body.password);
  //console.log(req.password);
  try {
    const email = req.body.username; 
    const password = req.body.password;
    console.log(email, password);
    const user = await Users.findOne({ name:email });
    console.log("current user:", user);
    if (user === null) {
      res.send({
        login: false,
        message: "couldnt find such a user or user is not approved yet ",
      });
    } else {
        // user exist 
        bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
        data = hash;
        console.log(data); // Here data equals to your hash
        bcrypt.compare(password, data, function(err, result) {
        if (result == true) 
        {
          var token = jwt.sign(
            {
              email: user.name,
              password: user.password
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          res.status(200).send({ auth: true, token: token });  
        } else {
          res.send({ login: false, message: "Password is incorrect" });
        }
      });
    });
});
    }
  } catch (e) {
    console.log("login fun bug");
    console.log(e);
    res.send({ login: false, messege: "cannot login" });
  }
})
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`\x1b[36m Server running on port ${port}  🔥`);
});
