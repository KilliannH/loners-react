import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/my-involved");
        const allEvents = res.data;

        setCreatedEvents(allEvents.filter((e) => e.owner._id === user._id));
        setJoinedEvents(allEvents.filter((e) => e.owner._id !== user._id));
      } catch (err) {
        toast.error(t("profile.toast.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?._id, t]);

  const EventCard = ({ event }) => (
    <motion.div
      onClick={() => navigate(`/events/${event._id}`)}
      className="cursor-pointer bg-white rounded shadow p-4 hover:shadow-md transition"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <h4 className="text-md font-semibold">{event.name}</h4>
      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <Users size={12} />
        {event.attendees.length} {t("profile.attendees")}
      </p>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-md mx-auto p-4 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header utilisateur */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate("/profile/update")}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
        >
          {t("profile.edit")}
        </button>
      </motion.div>

      {/* Événements créés */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        <motion.h3
          className="text-lg font-bold mb-2"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          {t("profile.createdEvents")}
        </motion.h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded" />
              <div className="h-3 bg-gray-200 w-3/4 rounded" />
            </div>
          ))
        ) : createdEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("profile.noCreated")}</p>
        ) : (
          <motion.div className="space-y-3">
            {createdEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Événements rejoints */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        <motion.h3
          className="text-lg font-bold mb-2"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          {t("profile.joinedEvents")}
        </motion.h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded" />
              <div className="h-3 bg-gray-200 w-3/4 rounded" />
            </div>
          ))
        ) : joinedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("profile.noJoined")}</p>
        ) : (
          <motion.div className="space-y-3">
            {joinedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default Profile;
