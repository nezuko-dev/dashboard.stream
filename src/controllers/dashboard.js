const Genre = require("../models/genre");
const Admin = require("../models/admin");
const Content = require("../models/content");
const User = require("../models/user");
const Invoice = require("../models/invoice");
const Franchise = require("../models/franchise");
const Title = require("../models/title");
const Rent = require("../models/rent");

const { validationResult } = require("express-validator");

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
exports.income = async (req, res) => {
  var data = await Rent.find({
    created: {
      $gte: new Date(new Date().valueOf() - 30 * 1000 * 60 * 60 * 24), // 1 сар
    },
  })
    .select("created")
    .populate("title", "price.amount");
  return res.json({ status: true, data });
};
exports.report = async (req, res) => {
  const { type } = req.params;
  const { range } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    switch (type) {
      case "invoice":
        return res.json({
          status: true,
          data: await Invoice.find({
            created: { $gte: new Date(range[0]), $lt: new Date(range[1]) },
          })
            .populate("user", "email")
            .populate("title", "name"),
        });
      case "user":
        return res.json({
          status: true,
          data: await User.find({
            created: { $gte: new Date(range[0]), $lt: new Date(range[1]) },
          }).select("-password +ip"),
        });
      case "title":
        return res.json({
          status: true,
          data: await Title.find({
            created: { $gte: new Date(range[0]), $lt: new Date(range[1]) },
          })
            .populate("franchise", "name")
            .select("-episodes -plot -label -images"),
        });
      default:
        return res.json({ status: false });
    }
  }
};
