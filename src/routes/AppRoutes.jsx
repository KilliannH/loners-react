import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CreateEvent from "../pages/CreateEvent";
import Profile from "../pages/Profile";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "../pages/UpdateProfile";
import useChatNotifications from "../hooks/useChatNotifications";
import useIdentifySocket from "../hooks/useIdentifySocket";
import { useLocation } from "react-router-dom";
import EventDetail from "../pages/EventDetail";
import ChatRoom from "../components/ChatRoom";
import ChatRooms from "../pages/ChatRooms";

const AppRoutes = () => {
  useIdentifySocket();
  const location = useLocation();
  const match = location.pathname.match(/^\/event\/([^/]+)\/chat$/);
  const currentEventId = match ? match[1] : null;

  useChatNotifications(currentEventId);

  return (<Routes>
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

    <Route path="/profile/update" element={
      <PrivateRoute>
        <UpdateProfile />
      </PrivateRoute>
    } />

    <Route path="/events/:id" element={
      <PrivateRoute>
        <EventDetail />
      </PrivateRoute>
    } />

    <Route path="/event/:id/chat" element={
      <PrivateRoute>
        <ChatRoom />
      </PrivateRoute>
    } />

    <Route
      path="/chat"
      element={
        <PrivateRoute>
          <ChatRooms />
        </PrivateRoute>
      } />
  </Routes>)
};

export default AppRoutes;