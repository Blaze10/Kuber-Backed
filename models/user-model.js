const { DataTypes, Model } = require('sequelize');
const db = require('../database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    profileImageUrl: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: db,
  }
);

User.sync();

module.exports = User;
