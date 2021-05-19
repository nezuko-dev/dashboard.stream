const Genre = require("../models/genre");
const Admin = require("../models/admin");
const Content = require("../models/content");
const User = require("../models/user");

exports.index = async (req, res) => {
  return res.json({
    status: true,
    genres: await Genre.countDocuments({}),
    admins: await Admin.countDocuments({}),
    contents: await Content.countDocuments({}),
    users: await User.countDocuments({}),
  });
};
