const express = require("express");
const router = express.Router();
const franchise = require("../controllers/franchise");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");

/**
 * /api/franchise:
 */
router.get("/", role("admin"), franchise.index);
router.post("/", role("admin"), validator.franchise, franchise.add);
module.exports = router;
