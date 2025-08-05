import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import { useNotificationStore } from "../features/notifications/notificationStore";
import api from "../services/api";
import toast from "react-hot-toast";
import socket from "../services/socket";

const ChatRoom = () => {
  const { id: eventId } = useParams();
  const { user } = useAuthStore();
  const { markAsReadInStore } = useNotificationStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Marquer les notifs comme lues
  useEffect(() => {
  const markAsRead = async () => {
    try {
      // 🧠 Sauve en base
      await api.post(`/notifications/mark-read/${eventId}`);
      // 🧼 Réinitialise côté frontend
      markAsReadInStore(eventId);
    } catch (err) {
      console.error("Erreur markAsRead:", err);
    }
  };

  if (eventId) {
    markAsRead();
  }
}, [eventId]);

  // Charger l’historique
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${eventId}`);
        setMessages(res.data.messages || []);
      } catch {
        toast.error("Erreur de chargement du chat");
      }
    };

    fetchMessages();
  }, [eventId]);

  // Gestion des sockets
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("join", eventId);

    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message:new", handleMessage);

    return () => {
      socket.emit("leave", eventId);
      socket.off("message:new", handleMessage);
    };
  }, [eventId]);

  // Envoi
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    socket.emit("message:send", {
      eventId,
      text: trimmed,
      sender: user._id,
    });

    setInput("");
  };

  // Scroll auto
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
