const express = require("express");
const router = express.Router();
const account = require("../controllers/account");
// middleware
const token = require("../middleware/token");
/**
 * /api/account:
 */
router.get("/", token, account.index);
router.post("/auth", account.auth);

module.exports = router;
