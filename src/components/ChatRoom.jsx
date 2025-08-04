import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL); // Assure-toi que cette env var est bien configurée

const ChatRoom = () => {
  const { id: eventId } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Charger l'historique
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${eventId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        toast.error("Erreur de chargement du chat");
      }
    };

    fetchMessages();
  }, [eventId]);

  // Gestion socket
  useEffect(() => {
    socket.emit("join", eventId);

    socket.on("message:new", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave", eventId);
      socket.off("message:new");
    };
  }, [eventId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("message:send", {
      eventId,
      text: input.trim(),
      sender: user._id,
    });
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-md mx-auto">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.sender._id === user._id
                ? "bg-black text-white self-end"
                : "bg-gray-100 text-black self-start"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className="text-[10px] mt-1 text-gray-400">
              {msg.sender?.username || "Inconnu"}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Écris un message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;