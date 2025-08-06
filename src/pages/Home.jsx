import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import MapWithMarkers from "../components/MapWithMarkers";
import { useTranslation } from "react-i18next";
import EventCard from "../components/EventCard";
import CustomHelmet from "../components/CustomHelmet";
import Carousel from "react-multi-carousel";

const responsive = {
  all: {
    breakpoint: { max: 4000, min: 0 },
    items: 1, // 1 colonne
    slidesToSlide: 1,
  },
};

const groupEvents = (events, perGroup = 3) => {
  const grouped = [];
  for (let i = 0; i < events.length; i += perGroup) {
    grouped.push(events.slice(i, i + perGroup));
  }
  return grouped;
};

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [position, setPosition] = useState(null);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 30;

  useEffect(() => {
    if (events.length > 0) {
      const firstGroup = groupEvents(events, 3)[0] || [];
      setVisibleMarkers(firstGroup);
    }
  }, [events]);

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

  const fetchNearbyEvents = async (newPage = 0) => {
    if (!position) return;

    if (newPage === 0) {
      setLoading(true); // Premier chargement
    } else {
      setIsFetchingMore(true); // Scroll vers la fin
    }

    try {
      const res = await api.get("/events/nearby", {
        params: {
          lat: position.lat,
          lng: position.lng,
          offset: newPage * pageSize,
          limit: pageSize,
          type: typeFilter !== "all" ? typeFilter : undefined,
        },
      });

      const newEvents = res.data.events || [];
      setTotalEvents(res.data.total || 0);

      if (newPage === 0) {
        setEvents(newEvents);
      } else {
        setEvents((prev) => [...prev, ...newEvents]);
      }

      setHasMore(res.data.hasMore);
      setPage(newPage);
    } catch (err) {
      toast.error(t("home.toast.fetchError"));
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };


  useEffect(() => {
    fetchNearbyEvents();
  }, [position, typeFilter]);

  const handleSlideChange = (_, { currentSlide }) => {
    const grouped = groupEvents(events, 3);
    const currentGroup = grouped[currentSlide] || [];

    setVisibleMarkers(currentGroup);

    if (hasMore && currentSlide >= grouped.length - 1) {
      fetchNearbyEvents(page + 1);
    }
  };

  return (
    <>
      <CustomHelmet
        titleKey="home.seo.title"
        descriptionKey="home.seo.description"
      />
      <div className="flex flex-col justify-start items-center min-h-[calc(100vh-80px)] pb-10 px-4 py-6 space-y-6">

        {/* 🗺️ Map */}
        {position && typeof position.lat === "number" && typeof position.lng === "number" && (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            <MapWithMarkers
              markers={[
                ...visibleMarkers.map(e => ({
                  lat: Number(e.location.coordinates.coordinates[1]),
                  lng: Number(e.location.coordinates.coordinates[0]),
                  isUser: false,
                })),
                {
                  lat: position.lat,
                  lng: position.lng,
                  isUser: true,
                },
              ]}
              fallbackLat={position.lat}
              fallbackLng={position.lng}
              zoom={10}
            />
          </motion.div>
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
              {t("home.greeting", { username: user?.username })} 👋
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
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <MapPin size={16} className="inline" />
            {t("home.refreshPosition")}
          </button>
        </motion.div>

        {/* 📅 Events list */}
        {!loading && totalEvents > 0 && (
          <p className="text-sm text-gray-500">{t("home.totalFound", { count: totalEvents })}</p>
        )}
        <div className="w-full max-w-md relative pb-10">
          <Carousel
            afterChange={handleSlideChange}
            responsive={responsive}
            arrows={false}
            showDots={true}
            swipeable
            draggable
            infinite={false}
            containerClass="carousel-container"
            renderDotsOutside={true}
            dotListClass="absolute left-0 bottom-0 right-0 z-10 flex justify-center gap-2"
            itemClass="px-1"
          >
            {groupEvents(events, 3).map((group, i) => (
              <div key={i} className="flex flex-col gap-4 h-full">
                {group.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            ))}
          </Carousel>
        </div>
        {isFetchingMore && (
          <div className="flex justify-center mt-4">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ➕ Create Event Button */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-16 h-16 text-3xl shadow-[0_4px_20px_rgba(99,102,241,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out"
        aria-label={t("home.createEvent")}
      >
        +
      </button>

    </>
  );
};

export default Home;
