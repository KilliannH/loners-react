import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GooglePlacesInput from "../components/GooglePlaceInput";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CreateEvent = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "concert",
    date: "",
    locationId: "",
  });
  const [newAddress, setNewAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        api
          .get(`/locations?query=${encodeURIComponent(searchQuery)}`)
          .then((res) => setLocationSuggestions(res.data))
          .catch(() => toast.error(t("createEvent.toast.locationSearchError")));
      } else {
        setLocationSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, t]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (!form.locationId) {
      toast.error(t("createEvent.toast.locationRequired"));
      setLoading(false);
      return;
    }

    try {
      await api.post("/events", form);
      toast.success(t("createEvent.toast.created"));
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.error || t("createEvent.toast.createError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-4 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {t("createEvent.title")}
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {[
          {
            name: "name",
            type: "text",
            placeholder: t("createEvent.fields.name"),
            component: "input",
          },
          {
            name: "description",
            placeholder: t("createEvent.fields.description"),
            component: "textarea",
          },
          {
            name: "type",
            component: "select",
            options: ["concert", "spectacle", "expo", "festival", "soiree_a_theme", "autre"],
          },
          {
            name: "date",
            type: "datetime-local",
            placeholder: t("createEvent.fields.date"),
            component: "input",
          },
        ].map((field, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            {field.component === "input" && (
              <input
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                maxLength={field.name === "name" ? 100 : undefined}
                className="w-full border rounded px-3 py-2"
              />
            )}
            {field.component === "textarea" && (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                maxLength={300}
                className="w-full border rounded px-3 py-2"
              />
            )}
            {field.component === "select" && (
              <select
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(`createEvent.types.${opt}`)}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
        ))}

        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <GooglePlacesInput
            onSelect={async (place) => {
              setSearchQuery(place.name);
              setNewAddress(place.address);
              setCoordinates(place.coordinates);

              try {
                const res = await api.get(`/locations?query=${encodeURIComponent(place.name)}`);
                const match = res.data.find((loc) => loc.address === place.address);

                if (match) {
                  setForm((prev) => ({ ...prev, locationId: match._id }));
                  toast.success(t("createEvent.toast.locationExists"));
                } else {
                  const created = await api.post("/locations", {
                    name: place.name,
                    address: place.address,
                    coordinates: place.coordinates,
                  });

                  setForm((prev) => ({ ...prev, locationId: created.data._id }));
                  toast.success(t("createEvent.toast.locationCreated", { name: created.data.name }));
                }
              } catch (err) {
                console.error("Erreur lieu Google → DB", err);
                toast.error(t("createEvent.toast.locationInvalid"));
              }
            }}
          />
        </motion.div>

        {form.locationId && (
          <motion.div
            className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mt-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span>📍</span>
            <span>
              {t("createEvent.fields.selectLocation")} <strong>{searchQuery}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, locationId: "" }));
                setSearchQuery("");
                toast(t("createEvent.toast.locationReset"), { icon: "❌" });
              }}
              className="ml-auto text-red-600 hover:underline text-xs"
            >
              {t("createEvent.fields.cancelSelection")}
            </button>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          {loading ? t("createEvent.status.loading") : t("createEvent.status.submit")}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default CreateEvent;
