import { create } from 'zustand';
import api from '../../services/api';
import socket from '../../services/socket';

export const useNotificationStore = create((set, get) => ({
  unreadByRoom: {},

  // 🔧 Remplace complètement les données
  setUnreadByRoom: (data) => set({ unreadByRoom: data }),

  // 🔄 Ajouter +1 pour une room
  incrementRoom: (roomId) =>
    set((state) => ({
      unreadByRoom: {
        ...state.unreadByRoom,
        [roomId]: (state.unreadByRoom[roomId] || 0) + 1,
      },
    })),

  // ✅ Remet à 0 une room
  markAsReadInStore: (roomId) =>
    set((state) => ({
      unreadByRoom: {
        ...state.unreadByRoom,
        [roomId]: 0,
      },
    })),

  // 📥 Charge depuis l’API
  fetchUnread: async () => {
    try {
      const res = await api.get("/notifications/unread");
      const unread = res.data;

      const countByRoom = {};
      unread.forEach((notif) => {
        const id = notif.event;
        countByRoom[id] = (countByRoom[id] || 0) + 1;
      });

      set({ unreadByRoom: countByRoom });
    } catch (err) {
      console.error("❌ Erreur fetchUnread:", err);
    }
  },

  // 🔌 Ecoute les notifs entrantes
  setupNotificationSocket: (userId) => {
    socket.emit("identify", userId);

    socket.off("message:notification");
    socket.on("message:notification", ({ eventId }) => {
      get().incrementRoom(eventId);
    });
  },

  // 🔢 Total non lues (badge global)
  totalUnread: () => {
    const map = get().unreadByRoom;
    return Object.values(map).reduce((a, b) => a + b, 0);
  },
}));