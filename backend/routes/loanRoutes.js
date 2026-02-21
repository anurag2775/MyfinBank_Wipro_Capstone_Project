const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/calculate-emi", authMiddleware, loanController.calculateEmi);
router.post("/apply", authMiddleware, loanController.applyLoan);
router.post("/repay", authMiddleware, loanController.repayLoan);

module.exports = router;
