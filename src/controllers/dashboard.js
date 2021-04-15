const Genre = require("../models/genre");
const Admin = require("../models/admin");

exports.index = async (req, res) => {
  return res.json({
    status: true,
    genres: await Genre.countDocuments({}),
    admins: await Admin.countDocuments({}),
  });
};
