import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow px-4 py-2 ${isAuthRoute ? "bg-gray-100" : ""}`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;