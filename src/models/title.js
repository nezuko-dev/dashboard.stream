const mongoose = require("mongoose");
const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
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
    banner: { type: String, default: null },
  },
  episodes: [
    {
      name: { type: String, required: true },
      content: { type: mongoose.Schema.ObjectId, ref: "content" },
    },
  ],

  total_episode: { type: Number, default: null },
  created: { type: Date, default: Date.now },
  status: { type: String, required: true },
});
module.exports = mongoose.model("title", titleSchema);
