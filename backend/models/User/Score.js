const { DataTypes } = require("sequelize");
const sequelize = require("../../config/bdd");

const Score = sequelize.define("Score", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  percentage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 35,
  },
  dateplayed: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  iduser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Score;
