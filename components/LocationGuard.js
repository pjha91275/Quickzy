"use client";
import React, { useState, useEffect } from "react";
import LocationModal from "./LocationModal";
import { useSession } from "next-auth/react";

const LocationGuard = ({ children }) => {
  const [showGuard, setShowGuard] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session, status: authStatus } = useSession();

  useEffect(() => {
    const checkLocation = () => {
      // 1. Check guest data
      const guestLocation = localStorage.getItem("quickzy-guest-location");
      const guestCoords = localStorage.getItem("quickzy-guest-coords");
      const confirmed = localStorage.getItem("quickzy-location-confirmed");

      // 2. Check session data (if logged in)
      const hasDbAddress = authStatus === "authenticated" && session?.user?.address?.text;
      
      // If we have no confirmed location (either guest or DB), show the mandatory modal
      // We check confirmed flag as well to ensure they went through the modal flow
      if (!confirmed && !hasDbAddress) {
        setShowGuard(true);
      } else if (!guestLocation && !hasDbAddress) {
        // Fallback for cases where session is loaded but location isn't in localStorage
        setShowGuard(true);
      } else {
        setShowGuard(false);
      }
      setIsLoaded(true);
    };

    if (authStatus !== "loading") {
      checkLocation();
    }

    // Also listen for potential manual clear or storage changes
    window.addEventListener("storage", checkLocation);
    // Custom event just in case we clear it programmatically
    window.addEventListener("location-cleared", checkLocation);

    return () => {
      window.removeEventListener("storage", checkLocation);
      window.removeEventListener("location-cleared", checkLocation);
    };
  }, [authStatus, session]);

  if (!isLoaded) return null;

  return (
    <>
      {showGuard && (
        <LocationModal 
          isOpen={true} 
          onClose={() => {}} // No closing allowed
        />
      )}
      {/* Optimized for mobile performance: Removed 'blur-md' as it's GPU intensive and lags on mobile. Using simple brightness-75 instead. */}
      <div className={showGuard ? "brightness-75 pointer-events-none transition-all duration-700 h-screen overflow-hidden" : "transition-all duration-700"}>
        {children}
      </div>
    </>
  );
};

export default LocationGuard;
