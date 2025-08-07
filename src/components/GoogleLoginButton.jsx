import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useAuthStore } from "../features/auth/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // suppose que tu as une méthode login(data)

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // à ajouter dans ton .env
        callback: handleGoogleCallback,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      const { credential } = response;

      // Envoie le token Google au backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      if (!res.ok) throw new Error("Erreur Google login");

      const data = await res.json();

      login(data); // stocker ton access + refresh token, user info, etc.
      toast.success("Connexion réussie !");
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Échec de la connexion Google");
    }
  };

  return <div id="google-signin-button"></div>;
};

export default GoogleLoginButton;