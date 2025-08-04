import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";

function App() {
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