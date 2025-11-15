// src/components/GoogleMap.tsx
"use client";

import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Polyline,
} from "@react-google-maps/api";
import { useMemo, useEffect, useRef } from "react";

// Define the props interface for our component
interface LatLng {
  lat: number;
  lng: number;
}
type FocusType = "pickup" | "dropoff" | "rider";

interface MapProps {
  pickup: LatLng;
  dropoff: LatLng;
  rider?: LatLng | null;
  focus?: { type: FocusType } | null;
}

const GoogleMapComponent = ({ pickup, dropoff, rider, focus }: MapProps) => {
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

  // store map instance for imperative actions
  const mapRef = useRef<google.maps.Map | null>(null);

  // react to focus changes from parent: pan/zoom to requested point
  useEffect(() => {
    if (!isLoaded || !focus || !mapRef.current) return;
    const map = mapRef.current as google.maps.Map;
    let target: { lat: number; lng: number } | null = null;
    if (focus.type === "pickup") target = { lat: pickup.lat, lng: pickup.lng };
    if (focus.type === "dropoff") target = { lat: dropoff.lat, lng: dropoff.lng };
    if (focus.type === "rider") target = rider || null;
    if (!target) return;
    try {
      // center the map explicitly and set a zoom that's appropriate per type
      map.setCenter(new window.google.maps.LatLng(target.lat, target.lng));
      const zoomLevel = focus.type === "rider" ? 17 : focus.type === "pickup" ? 14 : 15;
      map.setZoom(zoomLevel);
    } catch (e) {
      // ignore
    }
  }, [focus, pickup, dropoff, rider]);

  // --- RENDER LOGIC ---

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // --- KEY CHANGE: DEFINE ICONS AND PATHS *AFTER* isLoaded IS TRUE ---
  // Now we can safely access window.google.maps because the script has loaded.

  const path = [pickup, dropoff];

  const riderPath = rider ? [rider, dropoff] : null;

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
      onLoad={(map) => {
        // store map instance
        mapRef.current = map;

        // fit map to include all relevant points
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(pickup.lat, pickup.lng));
        bounds.extend(new window.google.maps.LatLng(dropoff.lat, dropoff.lng));
        if (rider) bounds.extend(new window.google.maps.LatLng(rider.lat, rider.lng));
        try {
          map.fitBounds(bounds);
        } catch (e) {
          // ignore
        }
      }}
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
          strokeColor: "#0000FF", // Blue line between pickup and dropoff
          strokeOpacity: 0.6,
          strokeWeight: 2,
        }}
      />

      {rider && (
        <>
          <MarkerF
            position={rider}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: "#1E90FF",
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: "white",
            }}
          />

          <Polyline
            path={riderPath!}
            options={{
              strokeColor: "#1E90FF", // Rider to dropoff line (bright blue)
              strokeOpacity: 0.9,
              strokeWeight: 3,
              icons: [
                {
                  icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 3,
                    strokeColor: "#1E90FF",
                  },
                  offset: "100%",
                },
              ],
            }}
          />
        </>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
