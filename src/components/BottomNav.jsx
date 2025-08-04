import React from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusCircle, User, MessageSquare } from "lucide-react";

const BottomNav = () => (
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
      to="/create"
      className={({ isActive }) =>
        `flex flex-col items-center text-xs ${isActive ? "text-black font-semibold" : "text-gray-400"}`
      }
    >
      <PlusCircle size={22} />
      <span className="sr-only">Créer</span>
    </NavLink>

    <NavLink
      to="/chat"
      className={({ isActive }) =>
        `flex flex-col items-center text-xs ${isActive ? "text-black font-semibold" : "text-gray-400"}`
      }
    >
      <MessageSquare size={22} />
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
  </nav>
);

export default BottomNav;