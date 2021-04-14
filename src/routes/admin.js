const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
// middleware
const token = require("../middleware/token");
const validator = require("../middleware/validator");

/**
 * /api/admin:
 */
router.get("/", token, admin.index);
router.post("/", token, validator.admin, admin.add);
router.delete("/:id", token, admin.delete);
module.exports = router;
