import { useEffect } from "react";
import { useAuthStore } from "../features/auth/authStore";
import socket from "../services/socket";

const useIdentifySocket = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      socket.emit("identify", user._id);
    }
  }, [user?._id]);
};

export default useIdentifySocket;