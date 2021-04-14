const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboard");
// middleware
const token = require("../middleware/token");
/**
 * /api/dashboard:
 */
router.get("/", token, dashboard.index);

module.exports = router;
