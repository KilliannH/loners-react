import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { MapPin, Users, Music2, Theater, Image, Calendar } from "lucide-react";

const getIcon = (type) => {
  switch (type) {
    case "concert":
      return <span><Music2 size={18} className="text-gray-600" /></span>;
    case "spectacle":
      return <span><Theater size={18} className="text-gray-600" /></span>;
    case "expo":
      return <span><Image size={18} className="text-gray-600" /></span>;
    default:
      return <span><Calendar size={18} className="text-gray-600" /></span>;
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [position, setPosition] = useState(null);

  // Obtenir position initiale
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        toast.error("Impossible d'obtenir la position 📍");
        setLoading(false);
      }
    );
  }, []);

  // Récupérer événements proches
  const fetchNearbyEvents = async () => {
    if (!position) return;

    setLoading(true);
    try {
      const res = await api.get("/events/nearby", {
        params: {
          lat: position.lat,
          lng: position.lng,
        },
      });

      let filtered = res.data;
      if (typeFilter !== "all") {
        filtered = filtered.filter((ev) => ev.type === typeFilter);
      }

      setEvents(filtered);
    } catch (err) {
      toast.error("Erreur de récupération des événements");
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
        {/* Header user */}
        <div className="flex items-center gap-4">
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
              Salut {user?.username}
            </h2>
            <p className="text-sm text-gray-500">Voici ce qui se passe près de toi</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex justify-between items-center w-full max-w-md">
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="all">Tous les types</option>
              <option value="concert">Concert</option>
              <option value="spectacle">Spectacle</option>
              <option value="expo">Expo</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <button
            onClick={() =>
              navigator.geolocation.getCurrentPosition(
                (pos) =>
                  setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  }),
                () => toast.error("Géoloc impossible")
              )
            }
            className="text-sm text-blue-600 hover:underline"
          >
            📍 Actualiser ma position
          </button>
        </div>

        {/* Liste événements */}
        <div className="w-full max-w-md space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse space-y-2">
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center">Aucun événement trouvé à proximité.</p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer"
              >
                <h3 className="text-lg font-bold">{event.name}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {event.attendees?.length || 0} participant(s)
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bouton flottant */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-20 right-4 bg-black text-white rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center hover:bg-gray-800 transition"
        aria-label="Créer un événement"
      >
        +
      </button>
    </>
  );
};

export default Home;
