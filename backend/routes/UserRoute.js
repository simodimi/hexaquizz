const express = require("express");
const router = express.Router();
const Usercontroller = require("../controllers/UserController");

//public
router.post("/inscription", Usercontroller.createUser);
router.post("/login", Usercontroller.loginUser);
router.post("/forgotpassword", Usercontroller.forgotPassword);
router.post("/verifycode", Usercontroller.verifyCode);
router.post("/resetpassword", Usercontroller.resetPassword);
// Vérifier token (route dédiée)
router.get(
  "/verify/token",
  Usercontroller.verifyToken,
  Usercontroller.checkTokenValidity
);
//points
router.post("/save", Usercontroller.verifyToken, Usercontroller.saveScore);
router.get(
  "/history",
  Usercontroller.verifyToken,
  Usercontroller.getUserScores
);
router.get("/leaderboard", Usercontroller.getLeaderboard);
module.exports = router;
