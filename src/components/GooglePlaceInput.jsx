import { useRef, useEffect } from "react";
import { useLoadGoogleMaps } from "../hooks/useLoadGoogleMaps";

const GooglePlacesInput = ({ onSelect }) => {
  const inputRef = useRef(null);
  const loaded = useLoadGoogleMaps();

  useEffect(() => {
    if (!loaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const { lat, lng } = place.geometry.location;

      onSelect({
        name: place.name,
        address: place.formatted_address,
        coordinates: {
          lat: lat(),
          lng: lng(),
        },
      });
    });
  }, [loaded]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Rechercher un lieu..."
      className="w-full border border-gray-300 rounded px-3 py-2"
      disabled={!loaded}
    />
  );
};

export default GooglePlacesInput;