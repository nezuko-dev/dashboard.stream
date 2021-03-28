const Admin = require("../models/admin");
const passport = require("passport");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
// custom mailer
const mailer = require("../lib/mailer");
exports.index = (req, res) => res.json({ user: req.user });
exports.auth = (req, res, next) => {
  passport.authenticate("local", (err, admin, message) => {
    if (!admin || err) {
      return res.json({
        status: false,
        message: message ? message.message : "Failed to login",
      });
    }
    req.logIn(admin, (err) => {
      if (err) return res.json({ status: false, message: "Failed to login" });
      return res.json({ status: true });
    });
  })(req, res, next);
};
exports.logout = (req, res) => {
  req.logout();
  return res.json({ status: true });
};
exports.forgot = (req, res) => {
  const errors = validationResult(req);
  const { email } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Admin.findOne({ "email.value": email.toLowerCase() })
      .then((doc) => {
        if (doc) {
          Admin.findById(doc._id).then(async (user) => {
            var token = crypto.randomBytes(18).toString("hex");
            // Email хаяг руу илгээх мэдээлэл
            mailer.send({
              to: doc.email.value,
              subject: "Нууц үг сэргээх",
              text: `Сайн байна уу! ${doc.name}<br> 
                Доорх товч дээр дарж нууц үгээ сэргээнэ үү.<br><a href="${
                  process.env.NODE_ENV === "development"
                    ? "http://localhost:3000/auth/reset/" + token
                    : process.env.URL + "/auth/reset/" + token
                }">Нууц үг сэргээх</a><br>
                <span>Хүсэлт гаргасан IP хаяг: ${
                  req.headers["x-forwarded-for"] || req.connection.remoteAddress
                }</span>`,
            });
            user.reset_password_token = token;
            user.reset_password_expires = Date.now() + 86400000;
            let result = await user.save();
            console.log(
              `User : ${
                result._id
              } is requested password reset token at ${Date.now()}`
            );
          });
        }
      })
      .catch((err) => res.json({ status: false }));
    return res.json({ status: true });
  }
};
