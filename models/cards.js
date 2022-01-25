const { Sequelize, DataTypes } = require("sequelize");
const connection = require("../connection");
const bcrypt = require("bcrypt");
const hash = require("../hash");

const Card = connection.define(
    "Card",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      types: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
      manaCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  
      rarity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      indexed: [{ unique: true, fields: ["name"] }],
    }
  );

module.exports = Card;
