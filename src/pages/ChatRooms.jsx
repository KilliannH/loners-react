import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import api from "../services/api";
import { useNotificationStore } from "../features/notifications/notificationStore";
import socket from "../services/socket";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ChatRooms = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadByRoom = useNotificationStore((s) => s.unreadByRoom);
  const setUnreadByRoom = useNotificationStore((s) => s.setUnreadByRoom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, unreadRes] = await Promise.all([
          api.get("/chat/rooms"),
          api.get("/notifications/unread"),
        ]);

        setRooms(roomsRes.data);

        const countByRoom = {};
        unreadRes.data.forEach((notif) => {
          const id = notif.event;
          countByRoom[id] = (countByRoom[id] || 0) + 1;
        });
        setUnreadByRoom(countByRoom);
      } catch (err) {
        console.error("❌ Erreur chargement chat ou notifs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleNotification = ({ eventId }) => {
      setUnreadByRoom((prev) => ({
        ...prev,
        [eventId]: (prev[eventId] || 0) + 1,
      }));
    };

    socket.on("message:notification", handleNotification);
    return () => socket.off("message:notification", handleNotification);
  }, []);

  return (
    <motion.div
      className="max-w-md mx-auto p-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {t("chatRooms.title")}
      </motion.h2>

      {loading ? (
        <p>{t("chatRooms.loading")}</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500">{t("chatRooms.noRooms")}</p>
      ) : (
        <div className="space-y-3">
          {rooms.map((event, index) => (
            <motion.div
              key={event._id}
              onClick={() => navigate(`/event/${event._id}/chat`)}
              className="relative border rounded px-4 py-3 shadow hover:shadow-md transition cursor-pointer flex items-center gap-3 bg-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <MessageCircle size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold">{event.name}</p>
                <p className="text-sm text-gray-500">{event.location?.name}</p>
              </div>

              {unreadByRoom[event._id] > 0 && (
                <motion.span
                  className="absolute top-2 right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadByRoom[event._id]}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ChatRooms;
