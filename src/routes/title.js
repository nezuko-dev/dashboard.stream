const express = require("express");
const router = express.Router();
const title = require("../controllers/title");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");

/**
 * /api/franchise:
 */
router.get("/", role("admin"), title.index);
router.post("/", role("admin"), validator.title, title.add);
module.exports = router;
