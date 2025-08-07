import React, { useState } from "react";
import { useAuthStore } from "../features/auth/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomHelmet from "../components/CustomHelmet";
import { useTranslation } from "react-i18next";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    username: user?.username || "",
    avatarUrl: user?.avatarUrl || "",
    bio: user?.bio || ""
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
      setUser(
        res.data,
        localStorage.getItem("token"),
        localStorage.getItem("refreshToken")
      );
      toast.success(t("updateProfile.toast.success"));
      navigate(-1);
    } catch (err) {
      toast.error(t("updateProfile.toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHelmet
        titleKey="updateProfile.seo.title"
        descriptionKey="updateProfile.seo.description"
      />
      <motion.div
        className="max-w-md mx-auto p-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold">{t("updateProfile.title")}</h2>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleUpdate}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <input
            type="text"
            name="username"
            maxLength={30}
            placeholder={t("updateProfile.fields.username")}
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <label className="block mb-2 text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            name="bio"
            type="text"
            onChange={handleChange}
            maxLength={100}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder={t("updateProfile.fields.bio")}
          />
          <p className="text-xs text-gray-400 text-right">{form.bio.length}/100</p>
          <input
            type="url"
            name="avatarUrl"
            maxLength={200}
            placeholder={t("updateProfile.fields.avatarUrl")}
            value={form.avatarUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          {form.avatarUrl && (
            <motion.img
              src={form.avatarUrl}
              alt="avatar preview"
              className="w-20 h-20 rounded-full object-cover border mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? t("updateProfile.status.loading") : t("updateProfile.status.submit")}
          </button>
        </motion.form>
      </motion.div>
    </>
  );
};

export default UpdateProfile;
