const { DataTypes, Model, STRING, INTEGER } = require('sequelize');
const db = require('../database');

class Cards extends Model {}

Cards.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
    },
    cardType: {
      type: DataTypes.STRING,
    },
    brandName: {
      type: DataTypes.STRING,
    },
    cardLimit: {
      type: DataTypes.DOUBLE,
    },
  },
  { timestamps: true, sequelize: db }
);

Cards.sync();

module.exports = Cards;
