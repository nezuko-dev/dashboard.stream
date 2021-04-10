const Genre = require("../models/genre");
const { validationResult } = require("express-validator");

exports.index = async (req, res) => {
  return res.json({ status: true, data: await Genre.find() });
};
exports.add = (req, res) => {
  const { name, keyword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Genre.create({ name, keyword }).then(() => res.json({ status: true }));
  }
};
