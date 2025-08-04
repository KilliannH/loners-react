import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/chat/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error("Erreur chargement rooms", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
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
            className="border rounded px-4 py-3 shadow hover:shadow-md transition cursor-pointer flex items-center gap-3"
          >
            <MessageCircle size={20} className="text-blue-600" />
            <div>
              <p className="font-semibold">{event.name}</p>
              <p className="text-sm text-gray-500">{event.location?.name}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRooms;