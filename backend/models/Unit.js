const User = require("./User/User");
const Score = require("./User/Score");
const sequelize = require("../config/bdd");
//definir la relation entre User et Score
User.hasMany(Score, {
  foreignKey: "iduser",
  as: "scores",
  onDelete: "CASCADE",
});
Score.belongsTo(User, { foreignKey: "iduser", as: "user" });

const models = { User, Score };
module.exports = { sequelize, models };
