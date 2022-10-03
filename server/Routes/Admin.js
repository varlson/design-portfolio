const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../Models/User");
const User = mongoose.model("Users");
const controllers = require("../Auth/controllers");
const { renewTokens } = require("../Auth/controllers");
const { tokenGenerator } = require("../src/utility");
/**------------------------------------ PROTECTED ROUTES--------------------------------------------------------**/
/**----------------ROUTERS DASHBOARD--------**/
router.get("/", controllers.isAuthenticated, (req, res) => {
  res.status(200).json({
    message: "Hello world",
    success: true,
  });
});

/**----------------ROUTERS RENEWPASSWORD--------**/
router.post("/renewtoken", renewTokens, (req, res) => {});

/**------------------------------------ REGISTER ROUTERS--------------------------------------------------------**/

router.post("/sign-up", controllers.existingCount, async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  const user = { name, email, password: hashedPass };
  try {
    const newUser = await new User(user).save();
    return res.status(201).json({
      message: "Usuario salvo com sucesso",
      success: true,
      content: newUser,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Houve um erro interno",
      success: false,
      error: error,
    });
  }
});

/**------------------------------------LOGIN ROUTE--------------------------------------------------------**/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({
      message: "Usuario nao existe",
      error: true,
    });
  }

  const authUser = await bcrypt.compare(password, user.password);

  if (authUser) {
    return res.status(202).json({
      content: user,
      tokens: {
        token: await tokenGenerator(user._id),
        refreshToken: await tokenGenerator(user._id, true),
      },
      error: false,
      success: true,
    });
  }

  res.status(401).json({
    message: "Usuario ou senha está incorreta",
    success: false,
    error: true,
  });
});

module.exports = router;
