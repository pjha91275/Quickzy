"use client";
import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiX, FiCheck, FiNavigation, FiSearch, FiMapPin } from "react-icons/fi";

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

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Using existing LocationIQ key for search
      const res = await fetch(
        `https://us1.locationiq.com/v1/search.php?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`,
      );
      const data = await res.json();
      if (!data.error) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setPosition([lat, lon]);
    setAddress(item.display_name);
    setSearchQuery("");
    setSearchResults([]);
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
      <div className="relative bg-white w-full max-w-[700px] h-[650px] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b flex flex-col gap-4 bg-white z-20">
          <div className="flex justify-between items-center">
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

          {/* Search Box */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 h-12 focus-within:border-[#3BB77E] transition-all">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for your area, city or street..."
                className="flex-1 bg-transparent text-sm font-bold text-[#253D4E] outline-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {isSearching && (
                <div className="w-4 h-4 border-2 border-[#3BB77E] border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001]">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSearchResult(item)}
                    className="p-4 hover:bg-[#f0fdf4] cursor-pointer border-b last:border-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-[#3BB77E] mt-1 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#253D4E] line-clamp-1">
                          {item.display_name.split(",")[0]}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase truncate">
                          {item.display_name.split(",").slice(1).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
