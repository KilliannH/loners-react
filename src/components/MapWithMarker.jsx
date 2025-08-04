import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "0.5rem",
};

const MapWithMarker = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = {
    lat: Number(lat),
    lng: Number(lng),
  };

  if (!isLoaded) return <p>Chargement carte...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
      options={{ disableDefaultUI: true }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapWithMarker;