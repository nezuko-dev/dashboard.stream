const User = require("../models/user");
exports.index = async (req, res) => {
  const data = await User.find({});
  return res.json({ status: true, data });
};
