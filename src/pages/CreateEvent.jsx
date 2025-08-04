import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GooglePlaceAutocomplete from "../components/GooglePlaceInput";
import GooglePlacesInput from "../components/GooglePlaceInput";

const CreateEvent = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "concert",
    date: "",
    locationId: "",
  });
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
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
          onSelect={(place) => {
            setSearchQuery(place.name);
            setNewAddress(place.address);
            setCoordinates(place.coordinates);
            toast.success("Lieu sélectionné");
          }}
        />

        {/* Suggestions internes (si requête tapée manuellement) */}
        {(locationSuggestions.length > 0 || showLocationForm) && (
          <ul className="border rounded bg-white shadow-md max-h-48 overflow-auto mt-2">
            {locationSuggestions.map((loc) => (
              <li
                key={loc._id}
                onClick={() => {
                  setForm({ ...form, locationId: loc._id });
                  setSearchQuery(loc.name);
                  setLocationSuggestions([]);
                  setShowLocationForm(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {loc.name}{" "}
                <span className="text-xs text-gray-500">({loc.address})</span>
              </li>
            ))}
          </ul>
        )}

        {/* Si nouveau lieu → formulaire minimal */}
        {showLocationForm && (
          <div className="border rounded p-3 bg-gray-50 space-y-3">
            <input
              type="text"
              placeholder="Adresse du lieu"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setCoordinates({
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                    });
                    toast.success("Position détectée 📍");
                  },
                  () => toast.error("Position non autorisée")
                );
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              📍 Utiliser ma position actuelle
            </button>

            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await api.post("/locations", {
                    name: searchQuery,
                    address: newAddress,
                    coordinates,
                  });
                  setForm({ ...form, locationId: res.data._id });
                  setSearchQuery(res.data.name);
                  setLocationSuggestions([]);
                  setShowLocationForm(false);
                  toast.success(`Lieu “${res.data.name}” créé`);
                } catch (err) {
                  toast.error("Erreur création du lieu");
                }
              }}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              ✅ Créer ce lieu
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