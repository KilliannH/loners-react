import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CreateEvent from "../pages/CreateEvent";
import Profile from "../pages/Profile";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    } />
    <Route path="/create" element={
      <PrivateRoute>
        <CreateEvent />
      </PrivateRoute>
    } />
    <Route path="/profile" element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    } />
  </Routes>
);

export default AppRoutes;