const Chat = require("../models/Chat");

// Send a new message (User or Admin)
exports.sendMessage = async (req, res) => { //handles sending messages from both users and admins
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const chat = await Chat.create({
      senderId: req.user.id,
      senderRole: req.user.role,
      message
    });

    // Emit real-time message to all connected clients
    const io = req.app.get("io");
    if (io) {
      io.emit("receiveMessage", chat);
    }

    res.status(201).json({
      message: "Message sent successfully",
      chat
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get all messages (Admin or User)
exports.getMessages = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
