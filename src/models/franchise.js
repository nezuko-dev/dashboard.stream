const mongoose = require("mongoose");
const franchiseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // series, movie or whatever
  genres: [{ type: mongoose.Schema.ObjectId, ref: "genres" }],
  titles: [{ type: mongoose.Schema.ObjectId, ref: "title" }],
  age_rating: { type: Number, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("franchise", franchiseSchema);
