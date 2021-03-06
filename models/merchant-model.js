const { Model, DataTypes } = require('sequelize');
const db = require('../database');

class MerchantModel extends Model {}

MerchantModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subscriptionKey: {
        type: DataTypes.STRING,
    },
    profileImageUrl: {
        type: DataTypes.STRING,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    timestamps: true,
    sequelize: db,
});

MerchantModel.sync();
module.exports = MerchantModel;