import { useEffect } from "react";
import { registerGoogle } from "../services/authApi";
import { useAuthStore } from "../features/auth/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const GoogleLoginButton = () => {
    const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); // suppose que tu as une méthode login(data)

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
          width: "100%",
        }
      );
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      const { credential } = response;

      // Envoie le token Google au backend
      const res = await registerGoogle({ credential });

      const { user, token, refreshToken } = res;

      setUser(user, token, refreshToken); // stocker ton access + refresh token, user info, etc.
      toast.success(t("googleButton.success"));
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error(t("googleButton.error"));
    }
  };

  return <div id="google-signin-button" className="w-full mt-6 flex justify-center" />;
};

export default GoogleLoginButton;