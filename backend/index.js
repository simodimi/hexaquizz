require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const UserRoute = require("./routes/UserRoute");
const db = require("./config/bdd");

const app = express();
const server = http.createServer(app);

// Sécurité: headers HTTP sûrs
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS (important: withCredentials côté frontend)
const CLIENT_ORIGIN = "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

// Routes
app.use("/user", UserRoute);

// Synchronisation des modèles
db.sync() // surtout PAS alter:true
  .then(() => {
    const PORT = process.env.SERVER_PORT || 5000;
    server.listen(PORT, () => console.log(`Serveur lancé sur ${PORT}`));
  })
  .catch((error) => {
    console.error("Erreur de synchronisation :", error);
    process.exit(1);
  });
