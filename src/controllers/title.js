const Title = require("../models/title");
exports.index = async (req, res) => {
  return res.json({ status: true, data: await Title.find({}) });
};
exports.add = (req, res) => res.json({ status: true });
