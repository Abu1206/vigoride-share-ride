// src/components/GoogleMap.tsx
"use client";

import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Polyline,
} from "@react-google-maps/api";
import { useMemo } from "react";

// Define the props interface for our component
interface MapProps {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
}

const GoogleMapComponent = ({ pickup, dropoff }: MapProps) => {
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  // Memoize the map center to prevent unnecessary re-renders
  const mapCenter = useMemo(
    () => ({
      lat: (pickup.lat + dropoff.lat) / 2,
      lng: (pickup.lng + dropoff.lng) / 2,
    }),
    [pickup, dropoff]
  );

  // --- RENDER LOGIC ---

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // --- KEY CHANGE: DEFINE ICONS AND PATHS *AFTER* isLoaded IS TRUE ---
  // Now we can safely access window.google.maps because the script has loaded.

  const path = [
    { lat: pickup.lat, lng: pickup.lng },
    { lat: dropoff.lat, lng: dropoff.lng },
  ];

  const pickupIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#4CAF50", // Green
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "white",
  };

  const dropoffIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: "#F44336", // Red
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "white",
  };

  return (
    <GoogleMap
      zoom={13}
      center={mapCenter}
      mapContainerClassName="w-full h-full"
      options={{
        disableDefaultUI: true,
      }}
    >
      <MarkerF position={pickup} icon={pickupIcon} />
      <MarkerF position={dropoff} icon={dropoffIcon} />
      <Polyline
        path={path}
        options={{
          strokeColor: "#0000FF", // Blue line
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
      />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
