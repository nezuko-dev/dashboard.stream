const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");

/**
 * /api/admin:
 */
router.get("/", role("admin"), admin.index);
router.post("/", role("admin"), validator.admin, admin.add);
router.post("/:id", role("admin"), validator.admin_update, admin.update);
router.delete("/:id", role("admin"), admin.delete);
module.exports = router;
