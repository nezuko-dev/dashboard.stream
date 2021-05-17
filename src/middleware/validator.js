const { check } = require("express-validator");
const Genre = require("../models/genre");

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
exports.franchise = [
  check("name")
    .isLength({ min: 2, max: 64 })
    .withMessage("2 - 64 тэмдэгтийн хооронд оруулна уу."),
  check("age_rating")
    .isFloat({ min: 0, max: 180 })
    .withMessage("Алдаатай утга"),
  check("genre"),
  check("type").isIn(["movie", "series"]).withMessage("Алдаатай утга"),
];
exports.title = [
  check("name")
    .isLength({ min: 2, max: 64 })
    .withMessage("2 - 64 тэмдэгтийн хооронд оруулна уу."),
  check("label")
    .isLength({ min: 2, max: 64 })
    .withMessage("2 - 64 тэмдэгтийн хооронд оруулна уу."),
  check("status").isIn(["ongoing", "finished"]).withMessage("Алдаатай утга"),
  check("total_episode")
    .isFloat({ min: 1 })
    .withMessage("Доод тал нь 1 ангитай байна."),
  check("plot").isLength({ min: 2 }).withMessage("Өрнөл оруулна уу."),
  check("cover"),
  check("poster"),
  check("amount")
    .optional({ nullable: true })
    .isFloat({ min: 1 })
    .withMessage("Алдаатай үнийн дүн"),
  check("duration")
    .optional({ nullable: true })
    .isFloat({ min: 12 })
    .withMessage("Алдаатай хугацаа"),
  check("episodes").isArray().withMessage("Доод тал нь 1 анги оруулна уу."),
];
