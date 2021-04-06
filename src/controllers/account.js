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
exports.reset = (req, res) => {
  const errors = validationResult(req);
  const { password, token } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Admin.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() },
    }).then((doc) => {
      if (doc) {
        if (bcrypt.compareSync(password, doc.password)) {
          return res.status(400).json({
            errors: [
              {
                param: "password",
                msg: "Tа өмнө нь ашиглаж байгаагүй нууц үг оруулна уу.",
              },
            ],
          });
        } else {
          doc.password = password;
          doc.reset_password_token = null;
          doc.reset_password_expires = null;
          doc.save(() => {
            req.logIn(doc, (err) => {
              if (err)
                return res.json({
                  status: false,
                  message: "Failed to login",
                });
              return res.json({ status: true });
            });
          });
        }
      } else
        return res.status(400).json({
          errors: [
            {
              param: "token",
              msg: "Нууц үг солих холбоос хүчингүй байна.",
            },
          ],
        });
    });
  }
};
exports.email = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Admin.findById(req.user.id).then(async (doc) => {
      if (!bcrypt.compareSync(password, doc.password)) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              msg: "Нууц үг тохирсонгүй",
              param: "check_password",
            },
          ],
        });
      } else if (doc.email.value === email.toLowerCase()) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              msg: "Tа өөр email хаяг оруулна уу.",
              param: "new_email",
            },
          ],
        });
      } else {
        let found = await Admin.findOne({
          "email.value": email.toLowerCase(),
          _id: { $ne: req.user.id },
        });
        if (found)
          return res.status(400).json({
            status: false,
            errors: [
              {
                msg: "Энэ email хаягийг ашиглах боломжгүй байна.",
                param: "new_email",
              },
            ],
          });
        else {
          var code = Math.floor(100000 + Math.random() * 900000);
          mailer.send({
            to: email,
            subject: "Email хаягаа баталгаажуулна уу.",
            text: `Сайн байна уу., <b>${doc.name}</b> <br> 
            Tа <b> ${String(
              code
            )}</b> энэ кодыг оруулж шинэ email хаягаа баталгаажуулна уу.`,
          });
          doc.email.pin = bcrypt.hashSync(code.toString(), 10);
          doc.email.update = email;
          doc.save(() => res.json({ status: true }));
        }
      }
    });
  }
};
exports.pin = (req, res) => {
  const { pin } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    Admin.findById(req.user.id)
      .then(async (doc) => {
        if (!doc.email.pin) {
          return res.status(400).json({
            status: false,
            errors: [
              {
                msg: "Баталгаажуулах код хүчингүй байна.",
                param: "pin",
              },
            ],
          });
        }
        if (!bcrypt.compareSync(pin, doc.email.pin)) {
          return res.status(400).json({
            status: false,
            errors: [
              {
                msg: "Баталгаажуулах код буруу байна.",
                param: "pin",
              },
            ],
          });
        } else {
          var email = doc.email.update;
          doc.email.pin = null;
          doc.email.update = null;
          doc.email.value = email;
          doc.save(() => res.json({ status: true, updated: email }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
