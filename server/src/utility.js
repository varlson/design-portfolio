const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async (token) => {
    const secret = process.env.TOKEN_SECRET;
    try {
      const res = await jwt.verify(token, secret);
      const dados = { isAuth: true, msg: "success" };
      return dados;
    } catch (error) {
      console.log(`error ${error}`);
      const dados = { isAuth: false, msg: "error" };
      return dados;
    }
  },

  verifyRefreshToken: async (token) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    try {
      const res = await jwt.verify(token, secret);
      const dados = { isAuth: true, payload: res };
      console.log(`from veryfyng ${res}`);
      console.log(res);
      return dados;
    } catch (error) {
      console.log(`error ${error}`);
      const dados = { isAuth: false, msg: "error" };
      return dados;
    }
  },
  tokenGenerator: async (data, isRefresh = false) => {
    const secret = isRefresh
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.TOKEN_SECRET;

    const time = isRefresh ? "2h" : "50s";

    const token = await jwt.sign({ data: data }, secret, { expiresIn: time });

    return token;
  },
};
