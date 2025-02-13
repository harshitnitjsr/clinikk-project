const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
