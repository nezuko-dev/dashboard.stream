const express = require("express");
const router = express.Router();
const title = require("../controllers/title");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");
const busboy = require("connect-busboy");

/**
 * /api/titles:
 */
router.get("/", role("admin"), title.index);
router.post("/", role("admin"), validator.title, title.add);
router.post(
  "/image/:type",
  busboy({ highWaterMark: 2 * 1024 * 1024 }),
  role("admin"),
  title.image
);

module.exports = router;
