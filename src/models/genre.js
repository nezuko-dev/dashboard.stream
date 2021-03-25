const mongoose = require("mongoose");
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  keyword: { type: String, default: null },
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("genre", genreSchema);
