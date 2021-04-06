const { check } = require("express-validator");
exports.email = [
  check("email").isEmail().withMessage("Email хаяг аа зөв оруулна уу!"),
];
exports.password = [
  check("password")
    .isLength({ min: 6, max: 64 })
    .withMessage("Нууц үг доод тал нь 6 оронтой байна."),
  check("token")
    .isLength({ min: 36 })
    .withMessage("Алдаатай token илгээсэн байна."),
];
exports.update_email = [
  check("email").isEmail(),
  check("password").isLength({ min: 5, max: 64 }),
];
exports.pin = [
  check("pin")
    .isNumeric()
    .isLength({ min: 5, max: 6 })
    .withMessage("Баталгаажуулах код 6 оронтой тооноос бүрдэнэ."),
];
