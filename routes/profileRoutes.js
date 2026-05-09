const express = require("express");
const router = express.Router();
const {
	analyze,
	getAnalyze,
	getId,
	deleteId,
} = require("../controller/profileController");

router.post("/analyze", analyze);
router.get("/profiles", getAnalyze);
router.get("/profiles/:id", getId);
router.delete("/profiles/:id", deleteId);
module.exports = router;
