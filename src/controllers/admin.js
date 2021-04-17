const Admin = require("../models/admin");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const ObjectId = require("mongoose").Types.ObjectId;
// custom mailer
const mailer = require("../lib/mailer");
exports.index = async (req, res) => {
  var admins = await Admin.find({ _id: { $ne: req.user.id } })
    .select(
      "-password -email.pin -email.update -reset_password_token -reset_password_expires"
    )
    .sort({ created: -1 });
  var data = admins.map((admin) => ({
    _id: admin._id,
    name: admin.name,
    email: admin.email.value,
    created: admin.created,
    expires: admin.invite.expires || false,
    active: admin.invite.token === null ? true : false,
  }));
  return res.json({ status: true, data });
};
exports.add = async (req, res) => {
  const { name, email, expires } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    found = await Admin.findOne({ "email.value": email.toLowerCase() });
    if (found)
      return res.status(400).json({
        status: false,
        errors: [{ msg: "Бүртгэлтэй email хаяг байна.", param: "email" }],
      });
    else {
      var token = crypto.randomBytes(18).toString("hex");
      Admin.create({
        name,
        "email.value": email,
        "invite.token": token,
        "invite.expires": expires,
        password: crypto.randomBytes(10).toString("hex"),
      }).then((doc) => {
        mailer.send({
          to: doc.email.value,
          subject: "Урилга",
          text: `Сайн байна уу! ${doc.name}<br> Танд энэ өдрийн мэндийг хүргэе.
            Доорх товч дээр дарж бүртгэлээ баталгаажуулна уу. <br> <a href="${
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/auth/active/" + token
                : process.env.URL + "/auth/active/" + token
            }">Баталгаажуулах</a><br>`,
        });
        return res.json({ status: true });
      });
    }
  }
};
exports.delete = (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    Admin.deleteOne({ _id: id }, (err) => {
      if (err) return res.json({ status: false });
      else return res.json({ status: true });
    });
  } else return res.status(400).json({ status: false });
};
exports.update = (req, res) => {
  const { id } = req.params;
  const { name, expires } = req.body;
  if (ObjectId.isValid(id)) {
    Admin.findByIdAndUpdate(
      { _id: id },
      { name, "invite.expires": expires || null }
    ).then(() => res.json({ status: true }));
  } else return res.status(400).json({ status: false });
};
