const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/deposit", authMiddleware, accountController.deposit);
router.post("/withdraw", authMiddleware, accountController.withdraw);


module.exports = router;
