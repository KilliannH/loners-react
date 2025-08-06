import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "0.5rem",
};

const isValidLatLng = (lat, lng) =>
  typeof lat === "number" && !isNaN(lat) && typeof lng === "number" && !isNaN(lng);

const MapWithMarkers = ({ markers = [], fallbackLat, fallbackLng }) => {
  const { t } = useTranslation();

  const center = isValidLatLng(fallbackLat, fallbackLng)
    ? { lat: fallbackLat, lng: fallbackLng }
    : null;

  if (!center) return <p className="text-red-500">🛑 Invalid coordinates</p>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={containerStyle}>
        <Map
          defaultCenter={center}
          defaultZoom={10}
          mapId="YOUR_MAP_ID" // facultatif, utile pour activer des styles ou advanced markers
          disableDefaultUI
        >
          {markers
            .filter((m) => isValidLatLng(m.lat, m.lng))
            .map((m, i) => (
              <AdvancedMarker key={i} position={{ lat: m.lat, lng: m.lng }}>
                <Pin />
              </AdvancedMarker>
            ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapWithMarkers;
