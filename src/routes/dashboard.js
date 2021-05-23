const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboard");
// middleware
const validator = require("../middleware/validator");
/**
 * /api/dashboard:
 */
router.get("/", dashboard.index);
router.get("/income", dashboard.income);
router.post("/report/:type", validator.reports, dashboard.report);
module.exports = router;
