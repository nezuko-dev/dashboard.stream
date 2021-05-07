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
router.post("/:id", role("admin"), validator.franchise, franchise.update);
router.get("/title/:id", role("admin"), franchise.titles);
router.delete("/:id", role("admin"), franchise.delete);
module.exports = router;
