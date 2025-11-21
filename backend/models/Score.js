const { DataTypes } = require("sequelize");
const sequelize = require("../config/bdd");
const User = require("../models/User");

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
  dateplayed: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
});
//definir la relation entre User et Score
User.hasMany(Score, { foreignKey: "iduser", onDelete: "CASCADE" });
Score.belongsTo(User, { foreignKey: "iduser" });

module.exports = Score;
