"use client";
import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiX,
  FiMail,
  FiArrowRight,
  FiNavigation,
  FiMapPin,
  FiHome,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";

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

const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialStep = 1 }) => {
  const [step, setStep] = useState(initialStep); // 1: Email, 2: Magic Link Sent, 3: Location
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [showMapModal, setShowMapModal] = useState(false);

  // Sync step with initialStep when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

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

  // 1. Send Magic Link
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.info("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.ok) {
        setStep(2);
        toast.success("Magic link sent! Check your inbox.");
      } else {
        toast.error("Failed to send magic link. Try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google Login
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: window.location.origin });
    } catch (error) {
      toast.error("Google login failed.");
    }
  };

  // 3. Location
  const handleUseCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        // Reverse Geocode using LocationIQ
        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse.php?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
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

  const handleOpenMapModal = () => {
    setShowMapModal(true);
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
        toast.success("Delivery address saved!");
        // We force a reload to ensure the session is updated with the new address
        // throughout the app (Navbar, Checkout, etc.)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to save location. Please try again.");
      }
    } catch (error) {
      toast.error("Error saving location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        transition={Bounce}
      />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative bg-white w-full max-w-[850px] min-h-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
          {/* Left Side */}
          <div className="w-full md:w-1/2 bg-[#3BB77E] p-10 flex flex-col justify-center text-white relative h-48 md:h-auto">
            <div className="relative z-10">
              <div className="text-4xl font-black mb-4 flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-12 h-12" />
                Quickzy
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Fastest Delivery in your city
              </h2>
              <p className="text-green-100 text-sm font-medium">
                Get your groceries delivered in minutes.
              </p>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 opacity-10 rotate-12 select-none pointer-events-none">
              <img
                src="/logo.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiX size={24} />
            </button>

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-2xl font-black text-[#253D4E] mb-2 tracking-tight">
                    Login or Signup
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">
                    No password required. Fast & Secure.
                  </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="flex items-center border-2 border-gray-100 rounded-2xl px-5 py-4 focus-within:border-[#3BB77E] transition-all bg-gray-50">
                    <FiMail className="text-gray-400 mr-3 text-xl" />
                    <input
                      type="email"
                      placeholder="Enter Email Address"
                      className="flex-1 bg-transparent outline-none text-[#253D4E] font-black text-lg"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    disabled={isLoading}
                    className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-2 group text-lg disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Continue with Email"}{" "}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-bold">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border-2 border-gray-100 text-[#253D4E] py-4 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-base shadow-sm"
                >
                  <FcGoogle size={24} />
                  Google
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-[#DEF9EC] text-[#3BB77E] rounded-full flex items-center justify-center mx-auto">
                  <FiMail size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#253D4E] mb-2">
                    Check your inbox
                  </h3>
                  <p className="text-gray-500 font-medium">
                    We sent a magic link to <br />
                    <strong className="text-[#3BB77E]">{email}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-[#3BB77E] font-black text-sm hover:underline"
                >
                  Change email address
                </button>
              </div>
            )}

            {/* Step 3 (Location) - IMPLEMENTATION INSTRUCTIONS:
              1. STATE: Create state for 'selectedAddress' (String) and 'coords' (Object: {lat, lng}).
              2. GPS: Create 'handleUseCurrentLocation' function:
                 - Use navigator.geolocation.getCurrentPosition.
                 - On success: Call LocationIQ Reverse Geocoding API with lat/lng.
                 - Map the 'display_name' from API to 'selectedAddress'.
              3. MAP: Create 'handleOpenMapModal' function:
                 - Open a secondary modal/overlay with 'react-leaflet'.
                 - Use a Draggable Marker.
                 - On marker DragEnd: Repeat the Reverse Geocoding call.
              4. PERSISTENCE: Create 'confirmAndSaveLocation' function:
                 - POST the data to '/api/user/update-location'.
                 - On success: Update local state, call onLoginSuccess(), and redirect.
            */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div>
                  <h3 className="text-2xl font-black text-[#253D4E] mb-2 tracking-tight">
                    Delivery Location
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">
                    Select where to deliver your orders
                  </p>
                </div>
                <div className="space-y-4">
                  {/* Option 1: Direct GPS */}
                  <button
                    onClick={handleUseCurrentLocation}
                    className="w-full bg-[#f0fdf4] text-[#3BB77E] py-5 rounded-2xl font-black border-2 border-[#DEF9EC] hover:bg-[#DEF9EC] transition-all flex items-center justify-center gap-3 group"
                  >
                    <FiNavigation
                      size={22}
                      className="group-hover:rotate-45 transition-transform"
                    />
                    Use Current Location
                  </button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-gray-400 font-bold">
                        Or
                      </span>
                    </div>
                  </div>
                  {/* Option 2: Select on Map */}
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="w-full bg-white border-2 border-gray-100 text-[#253D4E] py-5 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group"
                  >
                    <FiMapPin size={22} className="text-red-500" />
                    Select on Map
                  </button>
                  {/* Manual Address Display (Shown after location is fetched) */}
                  {selectedAddress && (
                    <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 animate-in zoom-in-95">
                      <div className="flex items-start gap-3">
                        <FiHome className="text-[#3BB77E] mt-1 shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#3BB77E] font-black uppercase tracking-widest mb-1">
                            Confirm Address
                          </p>
                          <textarea
                            className="text-sm font-bold text-[#253D4E] leading-snug w-full bg-transparent border-none outline-none resize-none focus:ring-0 p-0"
                            rows={3}
                            value={selectedAddress}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        onClick={confirmAndSaveLocation}
                        className="w-full mt-4 bg-[#3BB77E] text-white py-3 rounded-xl font-bold hover:bg-[#29A56C] transition-all"
                      >
                        Confirm & Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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

export default AuthModal;
