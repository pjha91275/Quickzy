"use client";
import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiX, FiNavigation, FiMapPin, FiHome } from "react-icons/fi";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl font-black text-[#3BB77E] animate-bounce">
        Loading Map...
      </div>
    </div>
  ),
});

const LocationModal = ({ isOpen, onClose, compulsory = false }) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [showMapModal, setShowMapModal] = useState(false);

  // Lock scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
          );
          const data = await res.json();

          if (data.error) throw new Error(data.error);

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

          setSelectedAddress(
            formattedAddress ||
              `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          );
          toast.success("Location detected!");
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error("Failed to get address. Please try manual selection.");
        }
        setIsLoading(false);
      },
      (error) => {
        toast.error("Location access denied. Please select on map.");
        setIsLoading(false);
      },
    );
  };

  const handleMapConfirm = ({ address, lat, lng }) => {
    setSelectedAddress(address);
    setCoords({ lat, lng });
    setShowMapModal(false);
    toast.success("Location updated from map!");
  };

  const confirmAndSaveLocation = async () => {
    setIsLoading(true);
    try {
      if (status === "authenticated") {
        const response = await fetch("/api/user/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: selectedAddress,
            lat: coords.lat,
            lng: coords.lng,
          }),
        });

        if (response.ok) {
          localStorage.setItem("quickzy-location-confirmed", "true");
          toast.success("Delivery address saved!");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("Failed to save location. Please try again.");
        }
      } else {
        localStorage.setItem("quickzy-guest-location", selectedAddress);
        localStorage.setItem("quickzy-guest-coords", JSON.stringify(coords));
        localStorage.setItem("quickzy-location-confirmed", "true");
        toast.success("Location set!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("confirmAndSaveLocation error:", error.message);
      toast.error("Error saving location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => { 
            const isConfirmed = localStorage.getItem("quickzy-location-confirmed");
            if (!compulsory || isConfirmed) onClose(); 
          }}
        ></div>

        <div className="relative bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
          {(!compulsory || localStorage.getItem("quickzy-location-confirmed")) && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full"
            >
              <FiX size={20} />
            </button>
          )}

          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#DEF9EC] text-[#3BB77E] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#3BB77E]/10">
                <FiMapPin size={28} />
              </div>
              <h3 className="text-2xl font-black text-[#253D4E] tracking-tight">
                Confirm your Location
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                Mandatory for within 15 mins delivery
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="w-full bg-[#f0fdf4] text-[#3BB77E] py-4 rounded-2xl font-black border-2 border-[#DEF9EC] hover:bg-[#DEF9EC] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                <FiNavigation
                  size={20}
                  className="group-hover:rotate-45 transition-transform"
                />
                {isLoading && !selectedAddress ? "Detecting..." : "Use Current Location"}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-4 text-gray-400 font-black tracking-widest">
                    Or
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowMapModal(true)}
                className="w-full bg-white border-2 border-gray-100 text-[#253D4E] py-4 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group"
              >
                <FiMapPin size={20} className="text-red-500" />
                Select on Map
              </button>

              {selectedAddress && (
                <div className="mt-6 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 animate-in zoom-in-95">
                  <div className="flex items-start gap-3">
                    <FiHome className="text-[#3BB77E] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-[#3BB77E] font-black uppercase tracking-widest mb-1.5">
                        Confirm Address
                      </p>
                      <textarea
                        className="text-xs font-bold text-[#253D4E] leading-snug w-full bg-transparent border-none outline-none resize-none focus:ring-0 p-0"
                        rows={3}
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={confirmAndSaveLocation}
                    disabled={isLoading}
                    className="w-full mt-4 bg-[#3BB77E] text-white py-3.5 rounded-xl font-black text-sm hover:bg-[#29A56C] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Confirm & Continue"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showMapModal && (
        <MapContent
          onConfirm={handleMapConfirm}
          onClose={() => setShowMapModal(false)}
          initialCoords={coords}
        />
      )}
    </>
  );
};

export default LocationModal;
