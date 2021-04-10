const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("🍿"));
router.use("/account", require("./account"));
router.use("/genre", require("./genre"));

module.exports = router;
