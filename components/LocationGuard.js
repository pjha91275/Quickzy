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
        <LocationModal 
          isOpen={true} 
          onClose={() => {}} // No closing allowed
          compulsory={true} 
        />
      )}
      <div className={showGuard ? "blur-md brightness-75 pointer-events-none transition-all duration-700 h-screen overflow-hidden" : "transition-all duration-700"}>
        {children}
      </div>
    </>
  );
};

export default LocationGuard;
