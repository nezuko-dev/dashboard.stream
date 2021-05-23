const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboard");
// middleware

/**
 * /api/dashboard:
 */
router.get("/", dashboard.index);
router.get("/income", dashboard.income);
module.exports = router;
