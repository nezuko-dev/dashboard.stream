const mongoose = require("mongoose");
const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: {
    amount: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  label: { type: String, required: true },
  plot: { type: String, default: null },
  franchise: {
    type: mongoose.Schema.ObjectId,
    ref: "franchise",
    default: null,
  },
  images: {
    cover: {
      md: { type: String, required: true },
      sm: { type: String, required: true },
      original: { type: String, required: true },
    },
    poster: {
      md: { type: String, required: true },
      sm: { type: String, required: true },
      original: { type: String, required: true },
    },
  },
  episodes: [
    {
      name: { type: String, required: true },
      plot: { type: String, default: null },
      content: { type: mongoose.Schema.ObjectId, ref: "content" },
    },
  ],
  total_episode: { type: Number, default: null },
  created: { type: Date, default: Date.now },
  status: { type: String, required: true },
});
module.exports = mongoose.model("title", titleSchema);
