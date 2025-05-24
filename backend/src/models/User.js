const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [Object],
  ratings: {
    type: Map,
    of: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
    