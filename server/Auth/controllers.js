const mongoose = require("mongoose");
require("../Models/User");
const User = mongoose.model("Users");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyRefreshToken,
  tokenGenerator,
} = require("../src/utility");

const controllers = {
  existingCount: async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    console.log(`user ${user}`);

    if (user) {
      return res.status(401).json({
        message: "Usuario ja existe",
        error: true,
      });
    }

    next();
  },

  isAuthenticated: async (req, res, next) => {
    const token =
      (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
      null;

    if (!token) {
      return res.status(401).json({
        message: "Acesso nao autorizado, forneça token",
        error: true,
        success: false,
      });
    }

    var { isAuth, msg } = await verifyToken(token);
    console.log(`isauth : ${isAuth}}`);
    console.log(`msg : ${msg}}`);
    if (isAuth) {
      return next();
    }
    return res.status(401).json({
      message: "Autentique-se novamente",
      error: true,
      success: false,
    });
  },

  renewTokens: async (req, res, next) => {
    const token =
      (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
      null;

    const { id } = req.body;

    if (!token) {
      return res.status(401).json({
        message: "Acesso nao autorizado, forneça token",
        error: true,
        success: false,
      });
    }

    const { isAuth, payload } = await verifyRefreshToken(token);
    console.log(`os dados do renew ${isAuth} e ${payload}`);
    if (isAuth) {
      // const newToken = "6338affaa67e59a07dde065e";
      const newToken = await tokenGenerator(id);
      return res.status(200).json({
        newToken: newToken,
        error: false,
        success: true,
      });
    }

    return res.status(402).json({
      message: "Acesso nao autorizado",
      error: true,
      success: false,
    });
  },
};

module.exports = controllers;
