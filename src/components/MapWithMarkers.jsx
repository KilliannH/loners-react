import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: '0.75rem', // Tailwind 'rounded-xl'
  overflow: 'hidden',
};

const isValidLatLng = (lat, lng) =>
  typeof lat === "number" && !isNaN(lat) && typeof lng === "number" && !isNaN(lng);

const MapWithMarkers = ({ markers = [], fallbackLat, fallbackLng, zoom = 13 }) => {
  const { t } = useTranslation();

  const center = isValidLatLng(fallbackLat, fallbackLng)
    ? { lat: fallbackLat, lng: fallbackLng }
    : null;

  if (!center) return <p className="text-red-500">🛑 {t("map.invalid_coordinates")}</p>;

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={containerStyle}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="YOUR_MAP_ID"
          disableDefaultUI
        >
          {markers
            .filter((m) => isValidLatLng(m.lat, m.lng))
            .map((m, i) => (
              <AdvancedMarker key={i} position={{ lat: m.lat, lng: m.lng }}>
                <Pin
                  background={m.isUser ? '#2563eb' : undefined}
                  borderColor={m.isUser ? '#1e40af' : undefined}
                  glyphColor={m.isUser ? '#1e40af' : undefined}
                />
              </AdvancedMarker>
            ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapWithMarkers;
