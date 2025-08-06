import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "0.5rem",
};

const isValidLatLng = (lat, lng) =>
  typeof lat === "number" && !isNaN(lat) &&
  typeof lng === "number" && !isNaN(lng);

const MapWithMarkers = ({ markers = [], fallbackLat, fallbackLng }) => {
  console.log("📍 Markers to display:", markers);
  const { t } = useTranslation();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Vérifie si les coordonnées sont valides
  const center = isValidLatLng(fallbackLat, fallbackLng)
    ? { lat: fallbackLat, lng: fallbackLng }
    : null;

  if (!isLoaded) return <p>{t("map.loading")}</p>;
  if (!center) return <p className="text-red-500">🛑 Invalid coordinates</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
      options={{ disableDefaultUI: true }}
    >
      <Marker position={{lat: fallbackLat, lng: fallbackLng}} />
    </GoogleMap>
  );
};

export default MapWithMarkers;
