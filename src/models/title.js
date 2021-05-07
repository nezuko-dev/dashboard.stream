const mongoose = require("mongoose");
const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // movie or series
  price: { type: Number, required: true }, // if free == 0
  plot: { type: String, default: null },
  index: { type: Number, required: true },
  franchise: {
    type: mongoose.Schema.ObjectId,
    ref: "franchise",
    default: null,
  },
  images: {
    cover: { type: String, default: null },
    poster: { type: String, default: null },
  },
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("title", titleSchema);
