const Franchise = require("../models/franchise");
const Genre = require("../models/genre");
const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
  return res.json({
    status: true,
    data: await Franchise.find()
      .sort({ created: -1 })
      .populate("genre", "name"),
  });
};
exports.add = (req, res) => {
  const { name, age_rating, type, genre } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Franchise.create({ name, age_rating, type, genre }).then(() =>
      res.json({ status: true })
    );
  }
};
