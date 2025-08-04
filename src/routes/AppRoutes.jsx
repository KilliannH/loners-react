import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Create from "../pages/Create";
import Profile from "../pages/Profile";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/create" element={<Create />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default AppRoutes;