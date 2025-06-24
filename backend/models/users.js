const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  gender: String,
  password: String,
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("users", UsersSchema);
