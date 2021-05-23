const express = require("express");
const router = express.Router();
const rent = require("../controllers/rent");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");
/**
 * /api/rent:
 */
router.get("/", role("admin"), rent.index);
module.exports = router;
