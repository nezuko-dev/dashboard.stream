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
exports.name = [
  check("name")
    .isLength({ min: 5, max: 22 })
    .withMessage("5 - 22 тэмдэгтийн хооронд оруулна уу."),
];
exports.passwords = [
  check("current_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("new_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("confirm_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
];
exports.genre = [
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("2 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("keyword")
    .isLength({ max: 32 })
    .withMessage("Дээд тал нь 32 тэмдэгт байна."),
];
exports.admin = [
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("2 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("email").isEmail(),
];
exports.active = [
  check("email").isEmail(),
  check("password")
    .isLength({ min: 6, max: 64 })
    .withMessage("Нууц үг доод тал нь 6 оронтой байна."),
  check("token")
    .isLength({ min: 36 })
    .withMessage("Алдаатай token илгээсэн байна."),
];
exports.admin_update = [
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("2 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("expires")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Алдаатай хүсэлт"),
];
exports.content = [
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("2 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("filename")
    .isLength({ min: 24 })
    .withMessage("Алдаатай файлын зам илгээсэн байна."),
];
exports.content_update = [
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("2 - 32 тэмдэгтийн хооронд оруулна уу."),
];
