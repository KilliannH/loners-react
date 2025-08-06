import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import CustomHelmet from "../components/CustomHelmet";
import { useTranslation } from "react-i18next";

const EditEvent = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        type: "concert",
        date: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                const { name, description, type, date } = res.data;
                setForm({ name, description, type, date: new Date(date).toISOString().slice(0, 16) });
            } catch {
                toast.error(t("eventDetail.toast.loadError"));
                navigate("/home");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, t, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/events/${id}`, form);
            toast.success(t("eventDetail.toast.updated"));
            navigate(`/events/${id}`);
        } catch (err) {
            toast.error(err?.response?.data?.error || t("eventDetail.toast.updateError"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-4">{t("eventDetail.loading")}</p>;

    return (
        <>
        <CustomHelmet
                      titleKey="editEvent.seo.title"
                      descriptionKey="editEvent.seo.description"
                    />
        <motion.div
            className="max-w-md mx-auto p-4 space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* 🔙 Retour */}
            <motion.button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-black flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <ArrowLeft size={18} /> {t("eventDetail.back")}
            </motion.button>

            {/* 📝 Titre */}
            <motion.h2
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {t("eventDetail.edit")}
            </motion.h2>

            {/* 🧾 Formulaire */}
            <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.05,
                        },
                    },
                }}
            >
                {/* Champ Nom */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <input
                        name="name"
                        type="text"
                        placeholder={t("createEvent.fields.name")}
                        value={form.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className="w-full border rounded px-3 py-2"
                    />
                </motion.div>

                {/* Champ Description */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <textarea
                        name="description"
                        placeholder={t("createEvent.fields.description")}
                        value={form.description}
                        onChange={handleChange}
                        required
                        maxLength={300}
                        className="w-full border rounded px-3 py-2"
                    />
                </motion.div>

                {/* Champ Type */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        {["concert", "spectacle", "expo", "festival", "soiree_a_theme", "autre"].map((opt) => (
                            <option key={opt} value={opt}>
                                {t(`createEvent.types.${opt}`)}
                            </option>
                        ))}
                    </select>
                </motion.div>

                {/* Champ Date */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <input
                        name="date"
                        type="datetime-local"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </motion.div>

                {/* Bouton Enregistrer */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                    {loading ? t("createEvent.status.loading") : t("eventDetail.edit")}
                </motion.button>
            </motion.form>
        </motion.div>
        </>
    );
};

export default EditEvent;
