import { useEffect, useState } from "react";
import { sendMessage, getMessages } from "../services/chatService";
import io from "socket.io-client";

function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  const loadMessages = async () => {
    const data = await getMessages();
    if (Array.isArray(data)) {
      setChats(data);
    } else {
      setChats([]);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Socket.io connection
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("receiveMessage", (newMessage) => {
      setChats((prevChats) => [...prevChats, newMessage]);
    });

    return () => socket.disconnect();
  }, []);

  const handleSend = async () => {
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="container py-4">
      <h4 className="text-primary mb-3">Customer Support Chat</h4>

      <div className="border rounded p-3 mb-3" style={{ height: "300px", overflowY: "auto" }}>
        {chats.map((chat, index) => (
          <div key={index} className="mb-2">
            <strong>{chat.senderRole.toUpperCase()}:</strong> {chat.message}
          </div>
        ))}
      </div>

      <textarea
        className="form-control mb-2"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default Chat;
