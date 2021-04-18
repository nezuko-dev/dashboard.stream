const express = require("express");
const router = express.Router();

// middleware
const token = require("../middleware/token");
router.get("/", (req, res) => res.send("🍿"));
router.use("/account", require("./account"));
router.use("/genre", token, require("./genre"));
router.use("/dashboard", token, require("./dashboard"));
router.use("/admin", token, require("./admin"));
router.use("/content", token, require("./content"));

module.exports = router;
