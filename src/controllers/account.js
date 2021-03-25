const Admin = require("../models/admin");
const passport = require("passport");

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
