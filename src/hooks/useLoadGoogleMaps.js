import { useEffect, useState } from "react";

export const useLoadGoogleMaps = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.maps?.places) {
        setLoaded(true);
      } else {
        console.error("❌ Google Maps loaded but places library is missing");
      }
    };

    script.onerror = () => {
      console.error("❌ Failed to load Google Maps script");
    };

    document.head.appendChild(script);
  }, []);

  return loaded;
};