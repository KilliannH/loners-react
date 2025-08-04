import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import toast from "react-hot-toast";

const Header = () => {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Déconnexion réussie");
        navigate("/login");
    };

    return (
        <header className="bg-black text-white flex justify-between items-center px-4 py-3">
            <h1 className="text-xl font-bold">Loners</h1>
            {isAuthenticated && (
                <button
                    onClick={handleLogout}
                    className="text-sm bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition"
                >
                    Déconnexion
                </button>
            )}
        </header>
    );
};

export default Header;