const mongoose = require("mongoose");
const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  plot: { type: String, default: null },
  index: { type: Number, required: true },
  franchise: {
    type: mongoose.Schema.ObjectId,
    ref: "franchise",
    default: null,
  },
  images: {
    cover: { type: String, default: null }, // original 1920 × 1080 , md 712 × 400 , sm 341 × 192 > tabled and pc
    poster: { type: String, default: null }, // original 960 × 1440 , md 480 × 720 , sm 160 × 240 display > on mobile
    banner: { type: String, default: null }, // 1920 × 720 > on home screen
  },
  created: { type: Date, default: Date.now },
  status: { type: String, required: true },
});
module.exports = mongoose.model("title", titleSchema);
