const express = require('express');
const zod = require("zod");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require('mongoose');
const jwtPssword = "secretKeydummy"

const app = express();

app.use(express.json());
app.use(cors());


//connect to mongodb
mongoose.connect("mongodb+srv://akshayybhat6:RUW4RrnzQYZon8HC@cluster0.rghajgw.mongodb.net/Authentication");

//define schema
const User = mongoose.model("User", { username: String, password: String })



//create Account route
app.post("/welcome", async (req, res, next) => {
  try {
    console.log(req.body);
    //zod check
    const usernameSchema = zod.string().email();
    const passwordSchema = zod.string().min(6);

    console.log(req.body);
    console.log(usernameSchema.safeParse(req.body.username));

    if (!(usernameSchema.safeParse(req.body.username).success) || !(passwordSchema.safeParse(req.body.password).success)) {
      res.status(400).json({
        msg: "Bad Input"
      })
    } else if (await User.findOne({ username: req.body.username })) {
      res.status(400).json({
        msg: "User already exist"
      })
    } else {
      const newUser = await new User({ username: req.body.username, password: req.body.password }) //create a new user and save to db
      await newUser.save();
      console.log("new user created");

      //create a jwt and send back
      const jwtToken = jwt.sign({
        username: req.body.username
      }, jwtPssword);

      res.status(201).json({
        msg: "User created",
        token: jwtToken
      })
    }
  } catch (error) {
    next(error);
  }
})


//Login route

app.post("/login", async (req, res, next) => {
  try {
    //zod check
    const usernameSchema = zod.string().email();
    const passwordSchema = zod.string().min(6);

    if (!(usernameSchema.safeParse(req.body.username).success) || !(passwordSchema.safeParse(req.body.password).success)) {
      res.status(400).json({
        msg: "Bad Input"
      })
      return;
    }
    const user = await User.findOne({ username: req.body.username });

    if (!user) {

      res.status(400).json({
        msg: "User doesn't exist"
      })
    } else if (user.password != req.body.password) {
      res.status(403).json({
        msg: "auth failed"
      })
    } else {
      //create jwt token and sendback

      const jwtToken = jwt.sign({
        username: req.body.username
      }, jwtPssword);

      res.status(200).json({
        msg: "logged in",
        token: jwtToken
      })
    }
  } catch (error) {
    next(error);
  }

})


// feed route

app.get("/feed", async (req, res, next) => {
  const jwtToken = req.headers.authorization;
  try {
    const isTokenVerified = jwt.verify(jwtToken, jwtPssword);
    if (isTokenVerified) {
      const allUsers = await User.find();
      res.status(200).json({
        msg: "logged in",
        users: allUsers
      })
    }

  } catch (error) {
    next(error);
  }
})

//global error catch
app.use((err, req, res, next) => {
  if (err.name == "JsonWebTokenError") {
    res.status(403).json({
      msg: "Auth Failed"
    })
  }
  res.status(500).json({
    msg: "Something's up with the server, probably gone mad or something"
  })
})

app.listen(3000, () => {
  console.log("App is listening to", 3000);
})