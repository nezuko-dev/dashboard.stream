const mongoose = require("mongoose");
const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // movie or series
  policy: { type: String, required: true }, // free or paid
  price: { type: Number, required: true }, // if free == 0
  plot: { type: String, default: null },
  editors: [{ type: mongoose.Schema.ObjectId, ref: "editors" }],
  genres: [{ type: mongoose.Schema.ObjectId, ref: "genres" }],
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("title", titleSchema);
