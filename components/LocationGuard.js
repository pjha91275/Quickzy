"use client";
import React, { useState, useEffect } from "react";
import LocationModal from "./LocationModal";

const LocationGuard = ({ children }) => {
  const [showGuard, setShowGuard] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkLocation = () => {
      const location = localStorage.getItem("quickzy-guest-location");
      const coords = localStorage.getItem("quickzy-guest-coords");
      const confirmed = localStorage.getItem("quickzy-location-confirmed");
      
      // If no location or not confirmed, show the mandatory modal
      if (!location || !coords || !confirmed) {
        setShowGuard(true);
      } else {
        setShowGuard(false);
      }
      setIsLoaded(true);
    };

    checkLocation();

    // Also listen for potential manual clear or storage changes
    window.addEventListener("storage", checkLocation);
    // Custom event just in case we clear it programmatically
    window.addEventListener("location-cleared", checkLocation);

    return () => {
      window.removeEventListener("storage", checkLocation);
      window.removeEventListener("location-cleared", checkLocation);
    };
  }, []);

  if (!isLoaded) return null;

  return (
    <>
      {showGuard && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all duration-500">
          <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 bg-white p-10 rounded-[40px] shadow-2xl border border-white/20">
             <div className="flex justify-center">
                <div className="w-24 h-24 bg-[#3BB77E]/10 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
                   <img src="/logo.png" alt="Quickzy" className="w-16 h-16 object-contain" />
                </div>
             </div>
             
             <div className="space-y-3">
                <h1 className="text-3xl font-black text-[#253D4E] tracking-tight">
                   Welcome to <span className="text-[#3BB77E]">Quickzy</span>
                </h1>
                <p className="text-gray-500 font-bold leading-relaxed">
                   To show you available products and ensure delivery within 15 minutes, we need your location first.
                </p>
             </div>

             <div className="pt-4">
                <LocationModal 
                  isOpen={true} 
                  onClose={() => {}} // No closing allowed
                  compulsory={true} 
                />
             </div>

             <div className="pt-10 flex items-center justify-center gap-6 opacity-30">
                <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-8 rounded-full border border-gray-300"></div>
                   <span className="text-[8px] font-black uppercase tracking-tighter">Fast</span>
                </div>
                <div className="w-12 h-[1px] bg-gray-300 mb-4"></div>
                <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-8 rounded-full border border-gray-300"></div>
                   <span className="text-[8px] font-black uppercase tracking-tighter">Fresh</span>
                </div>
                <div className="w-12 h-[1px] bg-gray-300 mb-4"></div>
                <div className="flex flex-col items-center gap-1">
                   <div className="w-8 h-8 rounded-full border border-gray-300"></div>
                   <span className="text-[8px] font-black uppercase tracking-tighter">Direct</span>
                </div>
             </div>
          </div>
        </div>
      )}
      <div className={showGuard ? "blur-md brightness-75 pointer-events-none transition-all duration-700 h-screen overflow-hidden" : "transition-all duration-700"}>
        {children}
      </div>
    </>
  );
};

export default LocationGuard;
