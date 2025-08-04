import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import useChatNotifications from "../hooks/useChatNotifications"; // corrige aussi ce path si besoin
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const match = location.pathname.match(/^\/event\/([^/]+)\/chat$/);
  const currentEventId = match ? match[1] : null;

  useChatNotifications(currentEventId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow px-4 py-2">{children}</main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;