import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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

        setCreatedEvents(allEvents.filter(e => e.owner._id === user._id));
        setJoinedEvents(allEvents.filter(e => e.owner._id !== user._id));
      } catch (err) {
        toast.error("Impossible de charger vos événements");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?._id]);

  const EventCard = ({ event }) => (
    <div
      key={event._id}
      onClick={() => navigate(`/events/${event._id}`)}
      className="cursor-pointer bg-white rounded shadow p-4 hover:shadow-md transition"
    >
      <h4 className="text-md font-semibold">{event.name}</h4>
      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <Users size={12} />
        {event.attendees.length} participant(s)
      </p>
    </div>
  );

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
      <section>
        <h3 className="text-lg font-bold mb-2">Événements créés</h3>
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded" />
              <div className="h-3 bg-gray-200 w-3/4 rounded" />
            </div>
          ))
        ) : createdEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">Tu n’as encore créé aucun événement.</p>
        ) : (
          <div className="space-y-3">
            {createdEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Événements rejoints */}
      <section>
        <h3 className="text-lg font-bold mb-2">Événements rejoints</h3>
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded" />
              <div className="h-3 bg-gray-200 w-3/4 rounded" />
            </div>
          ))
        ) : joinedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">Tu ne participes à aucun événement.</p>
        ) : (
          <div className="space-y-3">
            {joinedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
