const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    value: { type: String, required: true, unique: true },
    pin: { type: String, default: null },
    update: { type: String, default: null },
  },
  role: { type: String, default: "editor" }, // editor or admin
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  reset_password_token: { type: String, default: null },
  reset_password_expires: { type: Date, default: null },
});
adminSchema.pre("save", function (next) {
  const admin = this;
  if (!admin.isModified("password")) return next();
  this.email.value = this.email.value.toLowerCase();
  if (admin.email.update) this.email.update = this.email.update.toLowerCase();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
module.exports = mongoose.model("admin", adminSchema);
