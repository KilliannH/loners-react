import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: true,
  transports: ["websocket"]
});

// ⬇️ Identification de l’utilisateur auprès du serveur
const userId = localStorage.getItem("userId"); // ou via ton store
if (userId) {
  socket.emit("identify", userId);
}

setInterval(() => {
  socket.emit("ping");
}, 10000);

export default socket;