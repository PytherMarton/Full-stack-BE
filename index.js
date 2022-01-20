require("dotenv").config();

const express = require("express");
const passport = require("passport");


const connection = require("./connection");
const User = require("./models/user");
const userRouter = require("./routes/user");
const { registerStrategy } = require("./middleware/auth");

const app = express();

app.use(express.json());
// app.use(passport.initialize());
app.use("/user", userRouter);

passport.use("register", registerStrategy);

app.listen(process.env.PORT, () => {
  connection.authenticate();
  User.sync({ alter: true });
  console.log("App is online");
});
