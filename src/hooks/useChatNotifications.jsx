import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(import.meta.env.VITE_API_URL);

const useChatNotifications = (currentEventId) => {
  useEffect(() => {
    const handleNotification = ({ eventId, from, text }) => {
      if (eventId === currentEventId) return;

      toast.custom(
        <div className="bg-white border shadow-md px-4 py-2 rounded text-sm max-w-xs">
          💬 <b>{from}</b> a envoyé un message :<br />
          <i>{text.slice(0, 50)}...</i>
        </div>,
        { position: "bottom-right", duration: 4000 }
      );

      const audio = new Audio("/notif.mp3");
      audio.play().catch(() => {});
    };

    socket.on("message:notification", handleNotification);

    return () => socket.off("message:notification", handleNotification);
  }, [currentEventId]);
};

export default useChatNotifications;