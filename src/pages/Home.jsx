import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Exemple de géolocalisation statique (à remplacer par useGeolocation plus tard)
    const lat = 48.8566;
    const lng = 2.3522;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get(`/events/nearby?lat=${lat}&lng=${lng}`);
                setEvents(res.data);
            } catch (err) {
                toast.error("Impossible de récupérer les événements proches.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
  <>
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 py-6 space-y-6">
      {/* Avatar et bonjour */}
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
        <h2 className="text-lg font-semibold">
          Salut {user?.username || "Loner"} 👋
        </h2>
      </div>

      {/* Loader ou liste */}
      <div className="w-full max-w-md space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun événement trouvé à proximité.</p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {event.participants?.length || 0} participant(s)
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