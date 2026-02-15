"use client";
import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiX, FiCheck, FiNavigation } from "react-icons/fi";

// FIX: Leaflet default icon issues in Next.js
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon.src || icon,
  shadowUrl: iconShadow.src || iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapContent = ({ onConfirm, onClose, initialCoords }) => {
  const [position, setPosition] = useState(
    initialCoords.lat
      ? [initialCoords.lat, initialCoords.lng]
      : [28.6139, 77.209], // Default New Delhi
  );
  const [address, setAddress] = useState("Drag the marker to your location");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddress = async (lat, lng) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Use display_name or build a fallback string
      const formattedAddress =
        data.display_name ||
        [
          data.address?.road,
          data.address?.neighbourhood,
          data.address?.city,
          data.address?.state,
        ]
          .filter(Boolean)
          .join(", ");

      setAddress(
        formattedAddress || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      );
    } catch (error) {
      console.error("Geocoding error:", error);
      setAddress("Could not find address line. You can still confirm.");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically try to get user location if no initial coords
  React.useEffect(() => {
    if (!initialCoords.lat && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchAddress(latitude, longitude);
      });
    } else if (initialCoords.lat) {
      fetchAddress(initialCoords.lat, initialCoords.lng);
    }
  }, []);

  const DraggableMarker = () => {
    const markerRef = React.useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition([newPos.lat, newPos.lng]);
            fetchAddress(newPos.lat, newPos.lng);
          }
        },
      }),
      [],
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
    );
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    // Update map center when position state changes (e.g., after geolocation)
    React.useEffect(() => {
      map.flyTo(position, map.getZoom());
    }, [position]);

    return null;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-[700px] h-[600px] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-white z-10">
          <div>
            <h3 className="text-xl font-black text-[#253D4E]">
              Select Location
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Move the pin to your doorstep
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative z-0">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <DraggableMarker />
            <MapEvents />
          </MapContainer>

          {/* Address Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-[1000]">
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <FiNavigation className="text-[#3BB77E]" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-[#3BB77E] font-black uppercase tracking-widest mb-1">
                    Current Selection
                  </p>
                  <textarea
                    className="text-sm font-bold text-[#253D4E] w-full bg-transparent border-none outline-none resize-none focus:ring-0 p-0 leading-snug"
                    rows={2}
                    value={isLoading ? "Fetching address..." : address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <button
                disabled={
                  isLoading || address === "Drag the marker to your location"
                }
                onClick={() =>
                  onConfirm({ address, lat: position[0], lng: position[1] })
                }
                className="w-full bg-[#3BB77E] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#29A56C] transition-all disabled:opacity-50"
              >
                <FiCheck size={20} /> Confirm Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContent;
