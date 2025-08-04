import React, { useState } from "react";
import { useAuthStore } from "../features/auth/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const [form, setForm] = useState({
        username: user?.username || "",
        avatarUrl: user?.avatarUrl || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put("/users/me", form);
            setUser(res.data, localStorage.getItem("token"), localStorage.getItem("refreshToken"));
            toast.success("Profil mis à jour !");
        } catch (err) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            <div className="flex items-center gap-2">
  <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
    <ArrowLeft size={20} />
  </button>
  <h2 className="text-2xl font-bold">Mon profil</h2>
</div>
            <form onSubmit={handleUpdate} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="url"
                    name="avatarUrl"
                    placeholder="URL de l'avatar"
                    value={form.avatarUrl}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />

                {form.avatarUrl && (
                    <img
                        src={form.avatarUrl}
                        alt="avatar preview"
                        className="w-20 h-20 rounded-full object-cover border mx-auto"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                    {loading ? "Mise à jour..." : "Mettre à jour"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;