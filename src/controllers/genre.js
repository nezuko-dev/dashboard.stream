const Genre = require("../models/genre");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
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
exports.edit = (req, res) => {
  const { id: _id } = req.params;
  const { keyword, name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Genre.findByIdAndUpdate({ _id }, { name, keyword }).then(() =>
      res.json({ status: true })
    );
  }
};
exports.delete = (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    Genre.deleteOne({ _id: id }, (err) => {
      if (err) return res.json({ status: false });
      else return res.json({ status: true });
    });
  } else return res.status(400).json({ status: false });
};
