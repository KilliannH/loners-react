import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import MapWithMarkers from "../components/MapWithMarkers";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        toast.error(t("home.toast.geolocError"));
        setLoading(false);
      }
    );
  }, [t]);

  const fetchNearbyEvents = async () => {
    if (!position) return;
    setLoading(true);
    try {
      const res = await api.get("/events/nearby", {
        params: { lat: position.lat, lng: position.lng },
      });

      let filtered = res.data;
      if (typeFilter !== "all") {
        filtered = filtered.filter((ev) => ev.type === typeFilter);
      }
      setEvents(filtered);
    } catch {
      toast.error(t("home.toast.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyEvents();
  }, [position, typeFilter]);

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 py-6 space-y-6">

        {/* 🗺️ Map */}
        {position && typeof position.lat === "number" && typeof position.lng === "number" && (
          <MapWithMarkers
            markers={events
              .filter(e => Array.isArray(e?.location?.coordinates?.coordinates))
              .map(e => ({
                lat: Number(e.location.coordinates.coordinates[1]),
                lng: Number(e.location.coordinates.coordinates[0]),
              }))}
            fallbackLat={position.lat}
            fallbackLng={position.lng}
          />
        )}

        {/* 👤 User greeting */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover border"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300 animate-pulse" />
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {t("home.greeting", { username: user?.username })}
            </h2>
            <p className="text-sm text-gray-500">{t("home.subtitle")}</p>
          </div>
        </motion.div>

        {/* 🎛️ Filters */}
        <motion.div
          className="flex justify-between items-center w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">{t("home.filters.all")}</option>
            <option value="concert">{t("createEvent.types.concert")}</option>
            <option value="spectacle">{t("createEvent.types.spectacle")}</option>
            <option value="festival">{t("createEvent.types.festival")}</option>
            <option value="soiree_a_theme">{t("createEvent.types.soiree_a_theme")}</option>
            <option value="expo">{t("createEvent.types.expo")}</option>
            <option value="autre">{t("createEvent.types.autre")}</option>
          </select>

          <button
            onClick={() =>
              navigator.geolocation.getCurrentPosition(
                (pos) =>
                  setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  }),
                () => toast.error(t("home.toast.geolocRefreshError"))
              )
            }
            className="text-sm text-blue-600 hover:underline"
          >
            📍 {t("home.refreshPosition")}
          </button>
        </motion.div>

        {/* 📅 Events list */}
        <motion.div
          className="w-full max-w-md space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-4 animate-pulse space-y-2"
              >
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center">{t("home.noEvents")}</p>
          ) : (
            events.map((event) => (
              <motion.div
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <h3 className="text-lg font-bold">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Users size={12} />
                  {event.attendees?.length || 0} {t("home.attendees")}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* ➕ Create Event Button */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-20 right-4 bg-black text-white rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center hover:bg-gray-800 transition"
        aria-label={t("home.createEvent")}
      >
        +
      </button>
    </>
  );
};

export default Home;
