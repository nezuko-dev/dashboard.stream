const Rent = require("../models/rent");
const User = require("../models/user");
const Title = require("../models/title");
exports.index = async (req, res) => {
  return res.json({
    status: true,
    data: await Rent.find({})
      .populate("user", "email")
      .populate("title", "name price"),
  });
};
