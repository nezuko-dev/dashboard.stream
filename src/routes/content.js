const express = require("express");
const router = express.Router();
const content = require("../controllers/content");
// middleware
const validator = require("../middleware/validator");
const busboy = require("connect-busboy");

/**
 * /api/content:
 */
router.get("/", content.index);
router.post(
  "/upload",
  busboy({ highWaterMark: 2 * 1024 * 1024 }),
  content.upload
);
router.post("/", validator.content, content.add);
router.delete("/:id", content.delete);
module.exports = router;
