const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// User/Admin sends message
router.post("/send", authMiddleware, chatController.sendMessage);

// User/Admin reads chat
router.get("/", authMiddleware, chatController.getMessages);

module.exports = router;
