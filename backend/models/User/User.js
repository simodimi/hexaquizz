const sequelize = require("../../config/bdd");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  iduser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nameuser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mailuser: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  passworduser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inscriptiondate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  bestScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
module.exports = User;
