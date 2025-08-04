import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GooglePlacesInput from "../components/GooglePlaceInput";

const CreateEvent = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "concert",
    date: "",
    locationId: "",
  });
  const [newAddress, setNewAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔁 Recherche dans la DB si le lieu existe déjà
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        api
          .get(`/locations?query=${encodeURIComponent(searchQuery)}`)
          .then((res) => setLocationSuggestions(res.data))
          .catch(() => toast.error("Erreur lors de la recherche de lieux"));
      } else {
        setLocationSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (!form.locationId) {
      toast.error("Tu dois choisir un lieu !");
      setLoading(false);
      return;
    }

    try {
      await api.post("/events", form);
      toast.success("Événement créé 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Créer un événement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="concert">Concert</option>
          <option value="spectacle">Spectacle</option>
          <option value="expo">Expo</option>
          <option value="autre">Autre</option>
        </select>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        {/* Autocomplete Google Places */}
        <GooglePlacesInput
          onSelect={async (place) => {
            setSearchQuery(place.name);
            setNewAddress(place.address);
            setCoordinates(place.coordinates);

            try {
              // 🔁 Vérifie s’il existe déjà
              const res = await api.get(`/locations?query=${encodeURIComponent(place.name)}`);
              const match = res.data.find((loc) => loc.address === place.address);

              if (match) {
                setForm((prev) => ({ ...prev, locationId: match._id }));
                toast.success("Lieu existant sélectionné ✅");
              } else {
                // ✅ Crée le lieu dans le back
                const created = await api.post("/locations", {
                  name: place.name,
                  address: place.address,
                  coordinates: place.coordinates,
                });

                setForm((prev) => ({ ...prev, locationId: created.data._id }));
                toast.success(`Lieu “${created.data.name}” ajouté et sélectionné ✅`);
              }
            } catch (err) {
              console.error("Erreur lieu Google → DB", err);
              toast.error("Impossible de valider ce lieu");
            }
          }}
        />

        {form.locationId && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mt-2">
            <span>📍</span>
            <span>
              Lieu sélectionné : <strong>{searchQuery}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, locationId: "" }));
                setSearchQuery("");
                toast("Sélection annulée", { icon: "❌" });
              }}
              className="ml-auto text-red-600 hover:underline text-xs"
            >
              annuler
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Création..." : "Créer l’événement"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;