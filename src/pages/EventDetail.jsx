import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import MapWithMarker from "../components/MapWithMarkers";
import { motion } from "framer-motion";
import { MapPin, UserPlus, XCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const EventDetail = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const fetchedEvent = res.data;
        setEvent(fetchedEvent);

        const alreadyJoined = fetchedEvent.attendees?.some((u) => u._id === user?._id);
        setJoined(alreadyJoined);
      } catch {
        toast.error(t("eventDetail.toast.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user?._id, t]);

  const handleLeave = async () => {
    try {
      await api.post(`/events/${id}/leave`);
      setJoined(false);
      setEvent((prev) => ({
        ...prev,
        attendees: prev.attendees.filter((u) => u._id !== user._id),
      }));
      toast(t("eventDetail.toast.left"));
    } catch {
      toast.error(t("eventDetail.toast.leaveError"));
    }
  };

  const handleJoin = async () => {
    try {
      await api.post(`/events/${id}/join`);
      setJoined(true);
      if (!event.attendees.some((u) => u._id === user._id)) {
        setEvent((prev) => ({
          ...prev,
          attendees: [...prev.attendees, user],
        }));
      }
      toast.success(t("eventDetail.toast.joined"));
    } catch {
      toast.error(t("eventDetail.toast.joinError"));
    }
  };

  if (loading) return <p className="p-4">{t("eventDetail.loading")}</p>;
  if (!event) return <p className="p-4 text-red-500">{t("eventDetail.notFound")}</p>;

  const [lng, lat] = event.location?.coordinates?.coordinates || [];

  return (
    <motion.div
      className="max-w-md mx-auto p-4 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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

      <motion.h2 className="text-2xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {event.name}
      </motion.h2>

      <motion.p className="text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        {event.description}
      </motion.p>

      <motion.p className="text-sm text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {t("eventDetail.type")} : {t(`createEvent.types.${event.type}`)}
      </motion.p>

      <motion.p className="text-sm text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        {t("eventDetail.date")} : {new Date(event.date).toLocaleString()}
      </motion.p>

      {event.location && (
        <motion.p
          className="text-sm text-gray-500 flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MapPin size={16} className="text-gray-500" />
          {event.location.name} - {event.location.address}
        </motion.p>
      )}

      {Number.isFinite(lat) && Number.isFinite(lng) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <MapWithMarker lat={lat} lng={lng} />
        </motion.div>
      )}

      <motion.p className="text-sm text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        {event.attendees?.length || 0} {t("eventDetail.attendees")}
      </motion.p>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        {joined ? (
          <button
            onClick={handleLeave}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            <XCircle size={18} /> {t("eventDetail.leave")}
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            <UserPlus size={18} /> {t("eventDetail.join")}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EventDetail;
