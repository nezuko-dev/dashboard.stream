const express = require("express");
const router = express.Router();
const genre = require("../controllers/genre");
// middleware
const role = require("../middleware/role");
const validator = require("../middleware/validator");
/**
 * /api/genre:
 */
router.get("/", genre.index);
router.post("/", role("admin"), validator.genre, genre.add);
router.post("/:id", role("admin"), validator.genre, genre.update);
router.delete("/:id", role("admin"), genre.delete);
module.exports = router;
