const Invoice = require("../models/invoice");
const User = require("../models/user");
const Title = require("../models/title");
exports.index = async (req, res) => {
  return res.json({
    status: true,
    data: await Invoice.find({})
      .populate("user", "email")
      .populate("title", "name"),
  });
};
