import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import CustomHelmet from "../components/CustomHelmet";
import EventCard from "../components/EventCard";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        const { user, events } = res.data;
        setUser(user);
        setEvents(events);
      } catch (err) {
        toast.error(t("userProfile.toast.fetchUserError"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndEvents();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center text-gray-500">{t("userProfile.loading")}</div>
    );
  }

  return (
    <>
      <CustomHelmet
        title={user.username}
        description={`${t("userProfile.meta.descriptionFirstPart")} ${user.username} ${t("userProfile.meta.descriptionSecondPart")} Loners`}
      />

      <motion.div
        className="max-w-md mx-auto p-4 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 🔙 Header */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
                      onClick={() => navigate(-1)}
                      className="text-gray-600 hover:text-black flex items-center gap-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ArrowLeft size={18} /> {t("eventDetail.back")}
                    </motion.button>
        </motion.div>

        {/* 👤 Avatar & Info */}
        <motion.div
          className="flex flex-col items-center space-y-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <h3 className="text-lg font-semibold">{user.username}</h3>
          {user.bio && (
            <p className="text-sm text-center text-gray-600 max-w-xs">“{user.bio}”</p>
          )}
        </motion.div>

        {/* 📅 Events */}
        {events.length > 0 && (
          <>
            {/* Événements à venir */}
            <motion.div
              className="mt-6 space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              <motion.h4
                className="text-md font-semibold"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                {t("userProfile.upcommingEvents")}
              </motion.h4>

              {events
                .filter((e) => new Date(e.date) >= new Date())
                .map((event) => (
                  <motion.div
                    key={event._id}
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
            </motion.div>

            {/* Événements passés récents */}
            <motion.div
              className="mt-8 space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              <motion.h4
                className="text-md font-semibold text-gray-500"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                {t("userProfile.pastEvents")}
              </motion.h4>

              {events
                .filter((e) => {
                  const now = new Date();
                  const date = new Date(e.date);
                  const diffDays = (now - date) / (1000 * 60 * 60 * 24);
                  return date < now && diffDays <= 7;
                })
                .map((event) => (
                  <motion.div
                    key={event._id}
                    className="relative"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  >
                    <div className="pointer-events-none opacity-60">
                      <EventCard event={event} />
                    </div>
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">
                      {t("common.pastEvent")}
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default UserProfile;