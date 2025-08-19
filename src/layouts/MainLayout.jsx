import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import CookieConsent from "../components/CookieConsent";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isVerifyRoute = location.pathname.startsWith("/verify-email/");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`${isVerifyRoute ? "flex-grow px-4 py-2 bg-gray-100" : ""}`}>
        {children}
      </main>
      <CookieConsent />
    </div>
  );
};

export default MainLayout;