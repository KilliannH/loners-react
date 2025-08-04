import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authApi";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const { user, token, refreshToken } = await loginUser({ email, password });
            setUser(user, token, refreshToken);
            setIsLoading(false);
            toast.success("Connexion réussie 👋");
            navigate("/");
        } catch (err) {
            const message =
                err?.response?.data?.error || "Erreur de connexion, veuillez réessayer";
                setIsLoading(false);
                toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="ton.email@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-2 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 mt-4">
                    Pas encore inscrit ?{" "}
                    <a href="/register" className="text-black font-medium hover:underline">
                        Créer un compte
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;