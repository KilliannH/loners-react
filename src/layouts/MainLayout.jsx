import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow px-4 py-2">{children}</main>
    <BottomNav />
  </div>
);

export default MainLayout;