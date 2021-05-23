const mongoose = require("mongoose");
const rentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
  title: { type: mongoose.Schema.ObjectId, ref: "title", required: true },
  expires: { type: Date, required: true },
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("rent", rentSchema);
