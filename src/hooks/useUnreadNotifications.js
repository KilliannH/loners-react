import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";

const useUnreadNotifications = () => {
  const [count, setCount] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await api.get("/notifications/unread");
      setCount(res.data.length);
    } catch (err) {
      console.error("Erreur fetch unread notifs", err);
    }
  };

  useEffect(() => {
    fetchUnread();

    const handleNewNotif = () => {
      fetchUnread(); // 🔁 refresh du count
    };

    socket.on("message:notification", handleNewNotif);

    return () => {
      socket.off("message:notification", handleNewNotif);
    };
  }, []);

  return { count };
};

export default useUnreadNotifications;