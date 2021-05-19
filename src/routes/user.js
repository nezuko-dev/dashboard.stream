const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");
/**
 * /api/users:
 */
router.get("/", role("admin"), user.index);
module.exports = router;
