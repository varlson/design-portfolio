const mongoose = require("mongoose");

const Schemma = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", Schemma);
