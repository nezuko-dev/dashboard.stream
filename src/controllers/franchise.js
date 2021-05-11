const Franchise = require("../models/franchise");
const Title = require("../models/title");
const Genre = require("../models/genre");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;
exports.index = async (req, res) => {
  await Franchise.find()
    .sort({ created: -1 })
    .populate("genre", "name")
    .exec()
    .then((franchises) => {
      return Promise.all(
        franchises.map(async (franchise) => ({
          ...franchise._doc,
          titles: await Title.find({ franchise: franchise._id }),
        }))
      );
    })
    .then((data) => res.json({ status: true, data }))
    .catch((err) => res.json({ status: false }));
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
     delete all title images using fs
     */
    Franchise.deleteOne({ _id: id }, async (err) => {
      await Title.deleteMany({ franchise: id });
      if (err) return res.json({ status: false });
      else {
        return res.json({ status: true });
      }
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
