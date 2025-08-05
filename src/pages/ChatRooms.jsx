import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import api from "../services/api";
import { useNotificationStore } from "../features/notifications/notificationStore";
import socket from "../services/socket";

const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadByRoom = useNotificationStore((s) => s.unreadByRoom);
  const setUnreadByRoom = useNotificationStore((s) => s.setUnreadByRoom); // <-- manquant
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
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Mes salons de discussion</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500">Aucune room disponible.</p>
      ) : (
        rooms.map((event) => (
          <div
            key={event._id}
            onClick={() => navigate(`/event/${event._id}/chat`)}
            className="relative border rounded px-4 py-3 shadow hover:shadow-md transition cursor-pointer flex items-center gap-3"
          >
            <MessageCircle size={20} className="text-blue-600" />

            <div>
              <p className="font-semibold">{event.name}</p>
              <p className="text-sm text-gray-500">{event.location?.name}</p>
            </div>

            {unreadByRoom[event._id] > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {unreadByRoom[event._id]}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRooms;
