require("dotenv").config();

const express = require("express");
const passport = require("passport");
const cors = require("cors");


const connection = require("./connection");
const User = require("./models/user");
const Cards = require("./models/cards");
const userRouter = require("./routes/user");
const cardsRouter = require("./routes/cards");
const { registerStrategy, loginStrategy, verifyStrategy } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cors());
// app.use(passport.initialize());
app.use("/user", userRouter);
app.use("/cards", cardsRouter);

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);


app.listen(process.env.PORT, () => {
  connection.authenticate();
  User.sync({ alter: true });
  Cards.sync({ alter: true });
  console.log("App is online");
});
