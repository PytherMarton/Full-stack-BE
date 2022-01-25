const router = require("express").Router();
const bcrypt = require("bcrypt");
const Cards = require("../models/cards");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const session = { session: false };

router.get("/allcards", async (req, res) => {
  const allCards = await Cards.findAll({
  });
  res.status(200).json({msg: "worked", data: allCards });
});

router.get("/:id", async (req, res) => {
  const allCards = await Cards.findAll({
  });
  if (req.params.id - 1 < 0 || req.params.id > allCards.length) {
    res.status(404).json({ msg: `${req.params.id - 1} not found.` });
  } else {
    res.status(200).json(allCards[req.params.id - 1]);
  }
});

module.exports = router;
