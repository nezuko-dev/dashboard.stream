const Genre = require("../models/genre");

exports.index = async (req, res) => {
  return res.json({
    status: true,
    genres: await Genre.countDocuments({}),
  });
};
