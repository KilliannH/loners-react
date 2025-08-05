import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import { useNotificationStore } from "./features/notifications/notificationStore";
import { useAuthStore } from "./features/auth/authStore";

function App() {
  const { user } = useAuthStore();
  const { fetchUnread, setupNotificationSocket } = useNotificationStore();

  useEffect(() => {
    if (user?._id) {
      fetchUnread();
      setupNotificationSocket(user._id);
    }
  }, [user?._id]);

  return (
    <Router>
      <MainLayout>
        <AppRoutes />
        <Toaster position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f0fdf4',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fee2e2',
              },
            },
          }} />
      </MainLayout>
    </Router>
  );
}

export default App;