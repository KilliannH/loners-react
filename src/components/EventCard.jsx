import React from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getTypeColor = (type) => {
  const map = {
    concert: "bg-pink-100 text-pink-800",
    festival: "bg-indigo-100 text-indigo-800",
    expo: "bg-yellow-100 text-yellow-800",
    spectacle: "bg-green-100 text-green-800",
    soiree_a_theme: "bg-blue-100 text-blue-800",
    autre: "bg-gray-200 text-gray-700",
  };
  return map[type] || "bg-gray-200 text-gray-700";
};

export default function EventCard({ event }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition cursor-pointer min-h-[140px] relative"
    >
      <h3 className="text-lg font-bold">{event.name}</h3>
      <p className="text-sm text-gray-600">
        {event.description.length > 150 ? event.description.slice(0, 150) + "..." : event.description}
      </p>
      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
        <Users size={12} />
        {event.attendees?.length || 0} {t("home.attendees")}
      </p>

      {/* 🎫 Badge Type d'événement */}
      <span className={`absolute bottom-2 right-2 text-xs font-semibold px-2 py-1 rounded ${getTypeColor(event.type)}`}>
        {t(`createEvent.types.${event.type}`)}
      </span>
    </div>
  );
}