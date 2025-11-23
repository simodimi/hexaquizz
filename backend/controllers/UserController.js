const User = require("../models/User/User");
const Score = require("../models/User/Score");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Mailjet = require("node-mailjet");

const sequelize = require("../config/bdd");

//génération d'un token jwt
const generateToken = (user) => {
  return jwt.sign(
    {
      iduser: user.iduser,
      nameuser: user.nameuser,
      mailuser: user.mailuser,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5h" }
  );
};
//utilitaire envoie des mails
const mailjet = new Mailjet({
  apiKey: process.env.EMAIL_USER,
  apiSecret: process.env.EMAIL_PASSWORD,
});

//créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { nameuser, mailuser, passworduser } = req.body;
    if (!nameuser || !mailuser || !passworduser) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }
    //vérification si l'utilisateur existe
    const user = await User.findOne({ where: { mailuser } });
    if (user) {
      return res.status(400).json({ message: "utilisateur deja existant" });
    }
    //hasher le mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(passworduser, salt);
    //créer l'utilisateur
    const newUser = await User.create({
      nameuser,
      mailuser,
      passworduser: hashedPassword,
    });
    //envoyer un mail de confirmation
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "simodimitri08@gmail.com",
            Name: "SIMO DIMITRI",
          },
          To: [
            {
              Email: newUser.mailuser,
              Name: newUser.nameuser,
            },
          ],
          Subject: "compte crée avec success",
          HTMLPart: `
           <div style="text-align: center;">
              <h1 style="margin-bottom: 10px;">Sim'Quizz</h1>
              </div>
              
          <p>Bonjour ${newUser.nameuser}, votre compte a été crée avec succès.</p>
           <p>Allez y tester vos connaissances en culture générale!</p>
          `,
        },
      ],
    });
    //renvoyer les données de l'utilisateur
    return res.status(201).json({
      iduser: newUser.iduser,
      nameuser: newUser.nameuser,
      mailuser: newUser.mailuser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};
//loginUser
const loginUser = async (req, res) => {
  try {
    const { mailuser, passworduser } = req.body;
    if (!mailuser || !passworduser) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }
    //vérification si l'utilisateur existe
    const user = await User.findOne({ where: { mailuser } });
    if (!user) {
      return res.status(400).json({ message: "utilisateur introuvable" });
    }
    //vérification du mot de passe
    const passwordmatch = await bcrypt.compare(passworduser, user.passworduser);
    if (!passwordmatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    const token = generateToken(user);

    // Cookie options : secure en production, httpOnly, sameSite Strict
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 5 * 60 * 60 * 1000, // 5h
    };
    res.cookie("token", token, cookieOptions);
    //
    return res.status(200).json({
      iduser: user.iduser,
      nameuser: user.nameuser,
      mailuser: user.mailuser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};
//deleteUser
const deleteUser = async (req, res) => {
  try {
    const deleteuser = await User.destroy({
      where: { iduser: req.params.iduser },
    });
    if (deleteuser) {
      return res.status(200).json({ message: "utilisateur supprimé" });
    } else {
      return res.status(400).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};
//recuperer un user
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.iduser, {
      attributes: { exclude: ["passworduser"] },
    });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};
//updateUser
const updateUser = async (req, res) => {
  try {
    const { nameuser, mailuser, passworduser } = req.body;
    const updateData = { nameuser, mailuser };
    //si le mot de passe est modifié, il faut le hacher
    if (passworduser) {
      const hashedpassword = await bcrypt.hash(passworduser, 12);
      updateData.passworduser = hashedpassword;
    }
    const [updateCount] = await User.update(updateData, {
      where: { iduser: req.params.iduser },
    });
    if (updateCount > 0) {
      return res.status(200).json({ message: "utilisateur mis à jour" });
    } else {
      return res.status(400).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { mailuser } = req.body;
    if (!mailuser) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir le champ email" });
    }
    const user = await User.findOne({ where: { mailuser } });
    if (!user) {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
    //return res.status(200).json();
    const code = generateVerificationCode();
    //stockage du code temporairement
    verificationCodes.set(mailuser, { code, timestamp: Date.now() });
    //nettoyer les codes temporairements expirés
    cleanExpiredCodes();
    // Envoyer l’email
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: "simodimitri08@gmail.com", Name: "Simo Dimitri" },
          To: [{ Email: user.mailuser, Name: user.nameuser }],
          Subject: "Code de vérification - Réinitialisation de mot de passe",
          HTMLPart: `
            <div style="text-align: center;">
              <h1>Sim'sQuiz</h1>
              <p>Bonjour ${user.nameuser},</p>
              <p>Voici votre code de vérification :</p>
              <h2>${code}</h2>
              <p>Ce code expirera dans 5 minutes.</p>
              <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
            </div>
          `,
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "Code de vérification envoyé par email" });
  } catch (error) {
    return res.status(500).json({ message: "une erreur est survenue" });
  }
};
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString().padStart(6, "0");
};
//stockage temporaire du code
const verificationCodes = new Map();
// Fonction pour nettoyer les codes expirés
const cleanExpiredCodes = () => {
  const now = Date.now();
  for (const [mailuser, data] of verificationCodes.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      // 5 minutes
      verificationCodes.delete(mailuser);
    }
  }
};
const verifyCode = async (req, res) => {
  try {
    const { mailuser, code } = req.body;
    const entry = verificationCodes.get(mailuser);

    if (!entry) {
      return res
        .status(400)
        .json({ message: "Aucun code trouvé pour cet email ou expiré" });
    }

    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      verificationCodes.delete(mailuser);
      return res.status(400).json({ message: "Code expiré" });
    }

    if (entry.code !== code) {
      return res.status(400).json({ message: "Code invalide" });
    }

    // on le supprime pour éviter la réutilisation
    verificationCodes.delete(mailuser);

    return res.status(200).json({ message: "Code vérifié avec succès" });
  } catch (error) {
    console.error("Erreur verifyCode:", error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { mailuser, passworduser } = req.body;

    // Vérifier les champs
    if (!mailuser || !passworduser) {
      return res
        .status(400)
        .json({ message: "Veuillez remplir tous les champs" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { mailuser } });
    if (!user) {
      return res.status(404).json();
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(passworduser, 10);

    // Mettre à jour le mot de passe
    user.passworduser = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la mise à jour" });
  }
};
const checkTokenValidity = async (req, res) => {
  try {
    // Ici verifyToken a déjà été exécuté (middleware), et req.admin est present
    const user = await User.findByPk(req.user.iduser, {
      attributes: ["iduser", "nameuser", "mailuser"],
    });
    if (!user) {
      return res
        .status(401)
        .json({ valid: false, message: "Utilisateur introuvable" });
    }
    // Token valide
    return res.status(200).json({
      valid: true,
      user: {
        iduser: user.iduser,
        nameuser: user.nameuser,
        mailuser: user.mailuser,
      },
    });
  } catch (error) {
    console.error("checkTokenValidity error:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Erreur de vérification" });
  }
};
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.iduser);
    if (!user) {
      return res.status(401).json({ message: "user non valide" });
    }

    // Attacher les infos utiles à req
    req.user = {
      iduser: user.iduser,
      nameuser: user.nameuser,
      mailuser: user.mailuser,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    console.error("verifyToken error:", error);
    return res.status(401).json({ message: "Token invalide" });
  }
};
//gestion des points et score
const saveScore = async (req, res) => {
  try {
    const { score, totalQuestions, percentage, topic } = req.body;

    const newScore = await Score.create({
      score,
      totalQuestions,
      percentage,
      iduser: req.user.iduser, // Récupéré du middleware d'authentification
    });

    // Mettre à jour le meilleur score de l'utilisateur
    const user = await User.findByPk(req.user.iduser);
    if (score > user.bestScore) {
      user.bestScore = score;
      await user.save();
    }

    return res.status(201).json({
      message: "Score sauvegardé avec succès",
      score: newScore,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getUserScores = async (req, res) => {
  try {
    const scores = await Score.findAll({
      where: { iduser: req.user.iduser },
      order: [["dateplayed", "DESC"]],
      limit: 10, // 10 dernières parties
    });

    return res.status(200).json(scores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/*const getLeaderboard = async (req, res) => {
  try {
    const { User, Score } = require("../models/unit").models;
    const leaderboard = await User.findAll({
      attributes: [
        "iduser",
        "nameuser",
        "bestScore",
        [sequelize.fn("COUNT", sequelize.col("scores.id")), "gamesPlayed"],
      ],
      include: [
        {
          model: Score,
          as: "scores",
          attributes: [], // On ne veut pas les données des scores, juste compter
          required: false,
        },
      ],
      group: ["User.iduser"],
      order: [["bestScore", "DESC"]],
      limit: 10,
      subQuery: false,
    });

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};*/
const getLeaderboard = async (req, res) => {
  try {
    const { User, Score } = require("../models/unit").models;

    const leaderboard = await Score.findAll({
      attributes: [
        "iduser",
        "score",
        "percentage",
        "totalQuestions",
        "dateplayed",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["iduser", "nameuser"],
          required: true,
        },
      ],
      order: [
        ["score", "DESC"],
        ["dateplayed", "DESC"],
      ],
      limit: 10,
    });

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  getUser,
  updateUser,
  forgotPassword,
  verifyCode,
  resetPassword,
  checkTokenValidity,
  verifyToken,
  saveScore,
  getUserScores,
  getLeaderboard,
};
