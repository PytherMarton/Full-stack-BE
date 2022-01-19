const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// get all users
router.get("/", async (req, res) => {
  const allUsers = await User.findAll({
    attributes: ["id", "name", "createdAt", "updatedAt"],
  });
  res.status(200).json({ msg: "worked", data: allUsers });
});

// create a user
router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const password = await bcrypt.hash(req.body.password, salt);
  await User.create({ name: req.body.name, password });
  res.status(201).json({ msg: "worked" });
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
