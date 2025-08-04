import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/events/mine"); // Crée cette route côté BE si besoin
        setMyEvents(res.data);
      } catch (err) {
        toast.error("Impossible de charger vos événements");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header utilisateur */}
      <div className="flex items-center gap-4">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => navigate("/profile/update")}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
        >
          Modifier mon profil
        </button>
      </div>

      {/* Événements créés */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold">Mes événements</h3>

        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded" />
              <div className="h-3 bg-gray-200 w-3/4 rounded" />
            </div>
          ))
        ) : myEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">Tu n’as encore créé aucun événement.</p>
        ) : (
          myEvents.map((event) => (
  <div
    key={event._id}
    onClick={() => navigate(`/events/${event._id}`)}
    className="bg-white rounded shadow p-4 cursor-pointer hover:bg-gray-100 transition"
  >
    <h4 className="text-md font-semibold">{event.name}</h4>
    <p className="text-sm text-gray-600">{event.description}</p>
    <p className="text-xs text-gray-400 mt-1 capitalize">{event.type}</p>
  </div>
))
        )}
      </div>
    </div>
  );
};

export default Profile;