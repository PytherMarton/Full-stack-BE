const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const session = { session: false };

//======================= / ============================

const profile = (req, res, next) => {
  res.status(200).json({message: "profile", user: req.user, token: req.query.secret_token});
};

router.get("/", passport.authenticate("jwt", session), profile);

//======================= register user =======================

// takes the authenticate req and returns a response
const register = async (req, res, next) => {
  try {
    req.user.name
      ? res.status(201).json({ msg: "User registered", user: req.user })
      : res.status(401).json({ msg: "User already exists" });
  } catch (error) {
    next(error);
  }
};

// register router - authenticate using registerStrategy( names 'register') and passes on the register function defined above.
router.post(
  "/registeruser",
  passport.authenticate("register", session),
  register
);

//======================== login =========================

const login = async (req, res, next) => {
  passport.authenticate("login", (error, user) => {
      try {
          if (error) {
              console.log(error);
              res.status(500).json({message: "Internal Server Error"});
          } else if (!user) {
              res.status(401).json({msg: "401 not found."});
          } else {
              const loginFn = (error) => {
                  if(error) {
                      return next(error);
                  } else {
                      const userData = {id: user.id, name: user.name};
                      const data = {user, token: jwt.sign({user: userData}, process.env.SECRET_KEY)};
                      res.status(200).json(data);
                  }
              };

              req.login(user, session, loginFn);
          }
      } catch (error) {
          return next(error);
      }
  })(req, res, next); //IFFY - Immediately Invoked Function Expression
};

router.post("/login", login);

// get all users
router.get("/getallusers", async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ["id", "name", "createdAt", "updatedAt"],
  });
  res.status(200).json({ msg: "worked", data: allUsers });
});

// delete all users
router.delete("/", async (req, res) => {
  const deleteAll = await User.destroy({
    where: {},
    truncate: true,
  });
  res.status(201).json({ msg: "Deleted all." });
});

// get a single user
router.get("/:id", async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ["id", "name", "createdAt", "updatedAt"],
  });
  if (req.params.id - 1 < 0 || req.params.id > allUsers.length) {
    res.status(404).json({ msg: `${req.params.id - 1} not found.` });
  } else {
    res.status(200).json(allUsers[req.params.id - 1]);
  }
});

// update a single user
router.put("/:id", async (req, res) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const password = await bcrypt.hash(req.body.password, salt);
  const user = await User.update(
    { name: req.body.name, password: password },
    {
      where: {
        id: `${req.params.id}`,
      },
    }
  );
  res.status(200).json({ msg: `Updated ${req.params.id}`, data: req.body });
});

// delete a single user
router.delete("/:id", async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ["id", "name", "createdAt", "updatedAt"],
  });
  const removed = allUsers.splice(req.params.id - 1, 1);
  const deleteAll = await User.destroy({
    where: { id: `${req.params.id}` },
  });
  res.status(200).json({ msg: `Deleted ${req.params.id}`, data: removed });
});

module.exports = router;
