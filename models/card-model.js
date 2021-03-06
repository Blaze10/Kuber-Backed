const { DataTypes, Model, STRING, INTEGER } = require('sequelize');
const db = require('../database');

class Cards extends Model {}

Cards.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    cvv: {
      type: STRING,
      allowNull: false,
    },
    cardNo: {
        type: STRING,
        allowNull: false,
    },
    expiryDate: {
      type: STRING,
      allowNull: false,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
    },
    logo: {
      type: STRING,
    },
    cardType: {
      type: STRING,
    },
    brandName: {
      type: STRING,
    },
  },
  { timestamps: true, sequelize: db }
);

Cards.sync();

module.exports = Cards;
