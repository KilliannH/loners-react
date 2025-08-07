import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";

const useChatNotifications = (currentEventId) => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleNotification = ({ eventId, from, text }) => {
      console.log("📥 Notification reçue :", { eventId, currentEventId, from, text });

      // Évite les erreurs de comparaison avec null/undefined
      if (String(eventId) === String(currentEventId)) {
        console.log("🛑 Notification ignorée : utilisateur déjà dans la salle");
        return;
      }

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id); // facultatif : ferme le toast
              navigate(`/event/${eventId}/chat`); // adapte l'URL
            }}
            className="cursor-pointer bg-white border shadow-md px-4 py-2 rounded text-sm max-w-xs hover:bg-gray-50 transition"
          >
            💬 <b>{from}</b> sent a message:
            <br />
            <i>{text.slice(0, 50)}...</i>
          </div>
        ),
        {
          position: "bottom-right",
          duration: 4000,
        }
      );
    };

    console.log("🔌 Montage du listener notif (eventId courant :", currentEventId, ")");
    socket.on("message:notification", handleNotification);

    return () => {
      socket.off("message:notification", handleNotification);
    };
  }, [currentEventId]);
};

export default useChatNotifications;