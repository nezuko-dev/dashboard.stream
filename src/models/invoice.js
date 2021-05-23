const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "user", required: true },
  title: { type: mongoose.Schema.ObjectId, ref: "title", required: true },
  amount: { type: Number, required: true },
  status: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  uuid: { type: String, required: true },
  paid: { type: Date, default: null },
});
module.exports = mongoose.model("invoice", invoiceSchema);
