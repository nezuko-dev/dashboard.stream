const express = require("express");
const router = express.Router();
const genre = require("../controllers/genre");
// middleware
const token = require("../middleware/token");
const validator = require("../middleware/validator");
/**
 * /api/genre:
 */
router.get("/", token, genre.index);
router.post("/", token, validator.genre, genre.add);
router.post("/:id", token, validator.genre, genre.edit);
router.delete("/:id", token, genre.delete);
module.exports = router;
