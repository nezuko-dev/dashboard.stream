const mongoose = require("mongoose");
const contentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: {
    thumbnail: [
      { original: { type: String, default: null } },
      { sm: { type: String, default: null } },
    ],
  },
  status: { type: String, default: "processing" },
  editor: { type: mongoose.Schema.ObjectId, ref: "admin", required: true },
  size: { type: String, default: null },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("content", contentSchema);
