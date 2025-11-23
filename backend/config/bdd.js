const { Sequelize } = require("sequelize");
require("dotenv").config();

//variables d'environnement
const DB_Name = process.env.NAME;
const DB_User = process.env.USER;
const DB_Password = process.env.PASSWORD;
const DB_Host = process.env.HOST;
const DB_Port = process.env.PORT;

//créons une instance de sequelize
const sequelize = new Sequelize(DB_Name, DB_User, DB_Password, {
  host: DB_Host,
  port: DB_Port,
  dialect: "mysql",
  logging: false,
});
//test de connexion
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données MySQL reussie");
  })
  .catch(() => {
    console.log("Connexion à la base de données MySQL echouée");
  });

module.exports = sequelize;
