import React from "react";
import { NavLink } from "react-router-dom";

const BottomNav = () => (
  <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 text-sm">
    <NavLink to="/" className={({ isActive }) => isActive ? "font-bold" : ""}>
      Accueil
    </NavLink>
    <NavLink to="/create" className={({ isActive }) => isActive ? "font-bold" : ""}>
      Créer
    </NavLink>
    <NavLink to="/profile" className={({ isActive }) => isActive ? "font-bold" : ""}>
      Profil
    </NavLink>
  </nav>
);

export default BottomNav;