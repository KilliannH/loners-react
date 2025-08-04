import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import api from "../services/api";
import toast from "react-hot-toast";
import MapWithMarker from "../components/MapWithMarker";
import { MapPin, UserPlus, Check, ArrowLeft } from "lucide-react";

const EventDetail = () => {
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

        // Vérifie si le user est déjà inscrit
        const alreadyJoined = fetchedEvent.attendees?.some((u) => u._id === user?._id);
        setJoined(alreadyJoined);
      } catch (err) {
        toast.error("Erreur de chargement de l'événement");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user?._id]);

  const handleJoin = async () => {
    try {
      await api.post(`/events/${id}/join`);
      setJoined(true);
      toast.success("Tu participes maintenant 🎉");
    } catch {
      toast.error("Erreur lors de l’inscription");
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!event) return <p className="p-4 text-red-500">Événement introuvable</p>;

const [lng, lat] = event.location?.coordinates?.coordinates || [];
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-black flex items-center gap-1"
      >
        <ArrowLeft size={18} /> Retour
      </button>

      <h2 className="text-2xl font-bold">{event.name}</h2>
      <p className="text-gray-600">{event.description}</p>
      <p className="text-sm text-gray-400">Type : {event.type}</p>
      <p className="text-sm text-gray-400">
        Date : {new Date(event.date).toLocaleString()}
      </p>

      {event.location && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin size={16} className="text-gray-500" />
          {event.location.name} - {event.location.address}
        </p>
      )}

      {Number.isFinite(lat) && Number.isFinite(lng) && (
  <MapWithMarker lat={lat} lng={lng} />
)}

      <p className="text-sm text-gray-400">
        {event.attendees?.length || 0} participant(s)
      </p>

      {!joined ? (
        <button
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          <UserPlus size={18} /> Je participe
        </button>
      ) : (
        <div className="w-full flex items-center justify-center gap-2 text-green-600 font-medium">
          <Check size={18} /> Tu participes déjà
        </div>
      )}
    </div>
  );
};

export default EventDetail;
