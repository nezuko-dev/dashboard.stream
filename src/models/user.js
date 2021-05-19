const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  session: { type: String, default: null, select: false },
  reset_password_token: { type: String, default: null, select: false },
  reset_password_expires: { type: Date, default: null, select: false },
});
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  this.email = this.email.toLowerCase();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
module.exports = mongoose.model("user", userSchema);
