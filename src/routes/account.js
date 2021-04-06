const express = require("express");
const router = express.Router();
const account = require("../controllers/account");
// middleware
const token = require("../middleware/token");
const validator = require("../middleware/validator");
/**
 * /api/account:
 */
router.get("/", token, account.index);
router.get("/logout", token, account.logout);
router.post("/auth", account.auth);
router.post("/forgot", validator.email, account.forgot);
router.post("/reset", validator.password, account.reset);
// settings
router.post("/email", token, validator.update_email, account.email);
router.post("/email/save", token, validator.pin, account.pin);
module.exports = router;
