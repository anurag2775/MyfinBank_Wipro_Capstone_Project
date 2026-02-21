const express = require("express");
const router = express.Router();
const investmentController = require("../controllers/investmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/fd", authMiddleware, investmentController.openFD);
router.post("/rd", authMiddleware, investmentController.openRD);
router.get("/", authMiddleware, investmentController.getMyInvestments);

module.exports = router;