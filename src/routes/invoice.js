const express = require("express");
const router = express.Router();
const invoice = require("../controllers/invoice");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");
/**
 * /api/invoice:
 */
router.get("/", role("admin"), invoice.index);
module.exports = router;
