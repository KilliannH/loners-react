import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import { useNotificationStore } from "../features/notifications/notificationStore";
import api from "../services/api";
import toast from "react-hot-toast";
import socket from "../services/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const ChatRoom = () => {
  const { t } = useTranslation();
  const { id: eventId } = useParams();
  const { user } = useAuthStore();
  const { markAsReadInStore } = useNotificationStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await api.post(`/notifications/mark-read/${eventId}`);
        markAsReadInStore(eventId);
      } catch (err) {
        console.error("Erreur markAsRead:", err);
      }
    };
    if (eventId) markAsRead();
  }, [eventId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${eventId}`);
        setMessages(res.data.messages || []);
      } catch {
        toast.error(t("chat.errors.fetch"));
      }
    };
    fetchMessages();
  }, [eventId, t]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-100px)] max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.sender._id === user._id
                  ? "bg-black text-white self-end"
                  : "bg-gray-100 text-black self-start"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-[10px] mt-1 text-gray-400">
                {msg.sender?.username || t("chat.unknown")}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        className="p-2 pb-5 border-t flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.input
          value={input}
          maxLength={300}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={t("chat.inputPlaceholder")}
          className="flex-1 border rounded px-3 py-2"
          whileFocus={{ scale: 1.01 }}
        />
        <motion.button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("chat.send")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ChatRoom;
