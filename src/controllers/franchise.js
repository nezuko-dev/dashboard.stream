const Franchise = require("../models/franchise");
const Genre = require("../models/genre");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
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
exports.delete = (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    /* 
     todo :
     delete all titles
     Title.deleteMany({franchise:id});
     */
    Franchise.deleteOne({ _id: id }, (err) => {
      if (err) return res.json({ status: false });
      else return res.json({ status: true });
    });
  } else return res.status(400).json({ status: false });
};
exports.update = (req, res) => {
  const { id: _id } = req.params;
  const { name, age_rating, type, genre } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Franchise.findByIdAndUpdate(
      { _id },
      { name, age_rating, type, genre }
    ).then(() => res.json({ status: true }));
  }
};
