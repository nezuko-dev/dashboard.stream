const Genre = require("../models/genre");
const Admin = require("../models/admin");
const Content = require("../models/content");
const User = require("../models/user");
const Invoice = require("../models/invoice");
const Franchise = require("../models/franchise");
const Title = require("../models/title");
const Rent = require("../models/rent");

exports.index = async (req, res) => {
  return res.json({
    status: true,
    genres: await Genre.countDocuments({}),
    admins: await Admin.countDocuments({}),
    contents: await Content.countDocuments({}),
    users: await User.countDocuments({}),
    invoices: await Invoice.countDocuments({ status: true }),
    franchises: await Franchise.countDocuments({}),
    titles: await Title.countDocuments({}),
    rents: await Rent.countDocuments({ expires: { $gt: Date.now() } }),
  });
};
