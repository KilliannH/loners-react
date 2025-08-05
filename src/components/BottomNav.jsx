import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, MessageSquare } from "lucide-react";
import { useNotificationStore } from "../features/notifications/notificationStore";

const BottomNav = () => {
  const total = useNotificationStore((s) => s.totalUnread());
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 text-sm z-50">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black font-semibold" : "text-gray-400"}`
        }
      >
        <Home size={22} />
        <span className="sr-only">Accueil</span>
      </NavLink>

      <NavLink
        to="/chat"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs relative ${isActive ? "text-black font-semibold" : "text-gray-400"}`
        }
      >
        <div className="relative">
          <MessageSquare size={22} />
          {total > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {total}
            </span>
          )}
        </div>
        <span className="sr-only">Chat</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs ${isActive ? "text-black font-semibold" : "text-gray-400"}`
        }
      >
        <User size={22} />
        <span className="sr-only">Profil</span>
      </NavLink>
    </nav>);
};

export default BottomNav;