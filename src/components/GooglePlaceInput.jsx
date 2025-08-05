import { useRef, useEffect } from "react";
import { useLoadGoogleMaps } from "../hooks/useLoadGoogleMaps";
import { useTranslation } from "react-i18next";

const GooglePlacesInput = ({ onSelect }) => {
  const { t } = useTranslation();
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

      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      console.log("📍 Lieu sélectionné :", {
        name: place.name,
        address: place.formatted_address,
        lat,
        lng,
      });

      onSelect({
        name: place.name,
        address: place.formatted_address,
        coordinates: { lat, lng },
      });
    });
  }, [loaded]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={t("googlePlacesInput.placeholder")}
      className="w-full border border-gray-300 rounded px-3 py-2"
      maxLength={300}
      disabled={!loaded}
    />
  );
};

export default GooglePlacesInput;
