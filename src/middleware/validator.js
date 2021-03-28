const { check } = require("express-validator");
exports.email = [
  check("email").isEmail().withMessage("Email хаяг аа зөв оруулна уу!"),
];
